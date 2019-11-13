const x = require('./generate_tree_input')

const timeTrack = (fn, args) => {
    console.time(fn)
    fn(args)
    console.timeEnd(fn)
}

const main = async () => {
    console.log(x)
    const tWitness = await x.treeWitness()
    console.log(tWitness)
}

main()
