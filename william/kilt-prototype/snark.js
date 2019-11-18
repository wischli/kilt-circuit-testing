const genTree = require('./generate_tree_input')
const fs = require('fs')
const zkSnark = require('snarkjs')

const files = {
    circuit: 'circuit.json',
    baseName: 'myCircuit',
}

const timeTrack = async (fn, fName, args) => {
    console.time(fName)
    const result = await fn(args)
    console.timeEnd(fName)
    return result
}

const circuitLoad = () => {
    const circuitDef = JSON.parse(fs.readFileSync(files.circuit, 'utf8'))
    return new zkSnark.Circuit(circuitDef)
}

const trustedSetup = circuit => {
    console.log(zkSnark)
    const setup = zkSnark.setup(circuit)
    fs.writeFileSync(
        `${files.baseName}.vk_proof`,
        JSON.stringify(setup.vk_proof),
        'utf8'
    )
    fs.writeFileSync(
        `${files.baseName}.vk_verifier`,
        JSON.stringify(setup.vk_verifier),
        'utf8'
    )
    setup.toxic // Must be discarded.
}

const main = async () => {
    // load a circuit
    const circuit = await timeTrack(circuitLoad, 'Load & generate circuit')

    // generate witness
    const witness = await timeTrack(genTree.treeWitness, 'Generate Witness')

    // trusted setup
    const setup = await timeTrack(trustedSetup, 'Run trusted setup', circuit)
}

main()
