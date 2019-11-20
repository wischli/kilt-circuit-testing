const genTree = require('./generate_tree_input')
const fs = require('fs')
const zkSnark = require('snarkjs')
const {
    stringifyBigInts,
    unstringifyBigInts,
} = require('snarkjs/src/stringifybigint.js')

/** config data **/
const config = {
    circuitFileCircom: 'myCircuit',
    snarkMethod: 'original',
    // snarkMethod: 'groth',
    smtLevels: 5,
}
// prefix for json files created (for size checks)
const prefix = `./${config.snarkMethod}-method_files/${config.snarkMethod}${config.smtLevels}>`

/** utility **/
// write file and handle bigints
const writeFile = (fileName, inputs) =>
    fs.writeFileSync(fileName, JSON.stringify(stringifyBigInts(inputs)), 'utf8')

// read file and handle bigints
const readFile = fileName =>
    unstringifyBigInts(JSON.parse(fs.readFileSync(fileName, 'utf8')))

// execute a function and track execution time
const timeTrack = async (fn, fName, args) => {
    console.time(fName)
    const result = await fn(args)
    console.timeEnd(fName)
    return result
}

/** zksnark methods **/
// step 1: Load circuit and generate zkSnark circuit
const circuitLoad = () => {
    const circuitDef = JSON.parse(
        fs.readFileSync(`circuit${config.smtLevels}.json`, 'utf8')
    )
    return new zkSnark.Circuit(circuitDef)
}
// step 2: Generate witness inputs and witness
const witnessGen = async circuit => {
    const input = await genTree.witnessInput(config.smtLevels)
    const witness = await circuit.calculateWitness(input)
    writeFile(`${prefix}witness.json`, witness)
    return witness
}
// step 3: Run trusted setup
const trustedSetup = circuit => {
    const setup = zkSnark[config.snarkMethod].setup(circuit)
    const { vk_proof, vk_verifier } = setup
    writeFile(`${prefix}proving_key.json`, vk_proof)
    writeFile(`${prefix}verification_key.json`, vk_verifier)
    console.log('Toxic waste: ', setup.toxic)
    setup.toxic // Must be discarded.
    return { vk_proof, vk_verifier }
}

// step 4: Proof generation
const proofGen = ([vk_proof, witness]) => {
    try {
        const { proof, publicSignals } = zkSnark[config.snarkMethod].genProof(
            vk_proof,
            witness
        )
        writeFile(`${prefix}proof.json`, proof)
        writeFile(`${prefix}public.json`, publicSignals)
        return { proof, publicSignals }
    } catch (error) {
        console.log('error in proofGen: ', error)
    }
}
// step 5: Verify proof
const proofVerify = ([vk_verifier, proof, publicSignals]) => {
    const isValid = zkSnark[config.snarkMethod].isValid(
        vk_verifier,
        proof,
        publicSignals
    )
    console.log(`Proof is ${isValid ? 'valid' : 'invalid'}`)
    return isValid
}

/** Execution **/
const main = async () => {
    // load a circuit
    const circuit = await timeTrack(circuitLoad, 'Load & generate circuit')

    // generate witness
    const witness = await timeTrack(witnessGen, 'Generate Witness', circuit)

    // trusted setup
    const { vk_proof, vk_verifier } = await timeTrack(
        trustedSetup,
        'Run trusted setup',
        circuit
    )

    // generate proof
    const { proof, publicSignals } = await timeTrack(
        proofGen,
        'Generate proof',
        [vk_proof, witness]
    )

    // verify
    const proofIsValid = await timeTrack(proofVerify, 'Verify proof', [
        vk_verifier,
        proof,
        publicSignals,
    ])
}

main()
