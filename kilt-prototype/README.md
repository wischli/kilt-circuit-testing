## Generate membership inclusion proof for single leaf of attestedClaim prototype using iden3 libraries

The goal was to see whether file sizes and execution times for a minified version of an attestedClaim instance were viable using iden3. 

**As of now, I don't see any objections,** as the biggest file size was `proving_key.json` (using 15 levels) with 21mb. This file would probably stay on your machine. The corresponding `proof.json` was below 2kb, `public.json` 300 bytes and `verification_key.json` 5.6kb.

**However**, note that the used proof is a much simplified version of what we would most likely need. We simply made an SMT-inclusion proof of one datapoint. For us, we would need to add circuits for our private inputs. For instance, we might have to proof one of our leaves is the hash of two numbers x and y and so on.

### Benchmark

#### Original Method

|               | 5 levels                                     | 10 levels         | 15 levels          |
| ------------- | -------------------------------------------- | ----------------- | ------------------ |
| Circuit       | 65ms / 9.5mb (circuit.json)                  | 100ms / 16mb      | 146ms / 22mb       |
| Trusted Setup | 86s / 9.5mb (proving_key.json)               | 131s / 15mb       | 170s / 21mb        |
| Proof         | 50s / 1.5kb (proof.json), 273B (public.json) | 92s / 1.5kb, 295B | 120s / 1.5kb, 313B |
| Validation    | 3s / 4.46kb (verification_key.json)          | 3s / 4.8kb        | 3s / 5.6kb         |

#### Groth Method

|               | 5 levels                                    | 10 levels         | 15 levels         |
| ------------- | ------------------------------------------- | ----------------- | ----------------- |
| Circuit       | 65ms / 9.5mb (circuit.json)                 | 100ms / 16mb      | 146ms / 22mb      |
| Witness       | 252ms / 173kb (witness.json)                | 310ms / 291kb     | 400ms / 409kb     |
| Trusted Setup | 54s / 8.1mb (proving_key.json)              | 81s / 13mb        | 100s / 18mb       |
| Proof         | 36s / <1kb (proof.json), 273B (public.json) | 65s / 1.7kb, 295B | 82s / 1.7kb, 300B |
| Validation    | 0.7s / 4.1kb (verification_key.json)        | 0.7s / 4.5kb      | 0.8s / 5.7kb      |

### What has been tested?

I used the [`smtverifier.circom`](https://github.com/iden3/circomlib/blob/master/circuits/smt/smtverifier.circom) circuit from iden3's circuit library [circomlib](https://github.com/iden3/circomlib) to make an inclusion proof of a single leaf data. 

- 2 supported proving methods (`groth` and `orginal`) that can be set in `config` inside `benchmark.js`
- 3 supported SMT levels (5, 10 and 15)
- files for proof, verification, public, etc. of zkSNARK are located in`kilt-prototype/*method_files` directories

## How to run benchmark

Execute `benchmark.js` inside`kilt-prototype` directory. To make changes to the proving-method (iden3 supports `groth` and `original`) or tree levels, change the corresponding keys in the `config` variable inside `benchmark.js`.

### How to test other number of levels of SMT tree

If you chose to benchmark another number of levels, you need to to generate a circuit for this beforehand. 

1. Install circom globally: `npm install -g circom`
2. Create a copy of `smtverifier*.circom`, adjust number of levels in last line `component main = SMTVerifier(nLevels)`
3. Compile circuit: `circom smtverifierX.circom -o circuitX.json`
4. Change `config.smtLevels` to `X` in `benchmark.js`
