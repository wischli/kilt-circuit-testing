const smt = require('circomlib/src/smt')
const bigInt = require('snarkjs').bigInt
const fs = require('fs')

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

const main = async () => {
    // leaf array from minified input
    const leafArr = [
        // 0x4adf483a788c691947405f71f8ca45664f586b23decbd6fc5ca75dc8fc36a67e,
        // 0x97e941d9211b91726362282b4bbee528ab1340842ccd44b083dc732a6a8b44cc8813c0a2dd72dafd39b68ada5d7ec92b99190a8e5e1ed7750d7f4c73f35d0f0f,
        // 0xc6a30fbe790804a28390fedf7429ad96e895e66c7ea7691d674edaaf0f80d8ee,
        // parseInt('5Cf2axfXbRKsNBDXuha7hTNi561BNxKM1A7B33xhY1qhR6Hz', 16),
        // 29,
        1,
        2,
        3,
        4,
        5,
    ]

    // construct tree
    const tree = await constructTree(leafArr)

    // construct input
    const key = 3
    const fnc = 0
    const { siblings, foundValue: value, isOld0 } = await tree.find(key)

    // TODO: Figure out these
    // https://github.com/iden3/circomlib/blob/master/test/smtverifier.js
    const oldValue = 0
    const oldKey = 0
    const enabled = 1

    // TODO push siblings in dependence of level?
    while (siblings.length < 10) siblings.push(bigInt(0))

    // set input
    const inputs = {
        enabled,
        root: tree.root,
        siblings,
        oldKey,
        oldValue,
        isOld0,
        key,
        value,
        fnc,
    }

    // write as input
    fs.writeFileSync(
        './input.json',
        JSON.stringify(inputs, (_, v) =>
            typeof v === 'bigint' ? v.toString() : v
        ),
        'utf-8'
    )
    console.log(tree)
    console.log(siblings)
    console.log(await tree.find(1))
    console.log(await tree.find(2))
    console.log(await tree.find(3))
    console.log(await tree.find(4))
    console.log(await tree.find(5))
    console.log(await tree.find(6))
    console.log(tree.db.nodes)
}

main()
