const smt = require('circomlib/src/smt')
const bigInt = require('snarkjs').bigInt
const fs = require('fs')
const { stringifyBigInts } = require('snarkjs/src/stringifybigint.js')

// leaf array from minified input
const leafArr = [
    0x4adf483a788c691947405f71f8ca45664f586b23decbd6fc5ca75dc8fc36a67e,
    0x97e941d9211b91726362282b4bbee528ab1340842ccd44b083dc732a6a8b44cc8813c0a2dd72dafd39b68ada5d7ec92b99190a8e5e1ed7750d7f4c73f35d0f0f,
    0xc6a30fbe790804a28390fedf7429ad96e895e66c7ea7691d674edaaf0f80d8ee,
    parseInt('5Cf2axfXbRKsNBDXuha7hTNi561BNxKM1A7B33xhY1qhR6Hz', 16),
    29,
]

// construct tree from given leaf array
const constructTree = async leafArr => {
    const tree = await smt.newMemEmptyTrie()
    try {
        for (let i = 0; i < leafArr.length; i++) {
            await tree.insert(i + 1, leafArr[i])
        }
    } catch (e) {
        console.log('Error during tree construction: \n', e)
    }
    return tree
}

const witnessInput = async (
    nLevels = leafArr.length,
    witnessIndex = leafArr.length - 1
) => {
    const tree = await constructTree(leafArr)
    const fnc = 0
    const oldValue = 0
    const oldKey = 0
    const enabled = 1
    const { siblings, foundValue: value, isOld0 } = await tree.find(
        witnessIndex
    )
    console.log(nLevels, witnessIndex, siblings.length)
    while (siblings.length < nLevels) {
        siblings.push(bigInt(0))
    }
    return {
        enabled,
        siblings,
        oldKey,
        oldValue,
        isOld0,
        value,
        fnc,
        key: witnessIndex,
        root: tree.root,
    }
}

const main = async () => {
    // construct input
    const inputs = witnessInput()

    fs.writeFileSync(
        'input.json',
        JSON.stringify(stringifyBigInts(inputs), 'utf-8')
    )

    // // write as input
    // fs.writeFileSync(
    //     './input.json',
    //     JSON.stringify(inputs, (_, v) =>
    //         typeof v === 'bigint' ? v.toString() : v
    //     ),
    //     'utf-8'
    // )
    console.log('Created input.json')
}

main()

module.exports.witnessInput = witnessInput
