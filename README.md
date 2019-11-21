# kilt-circuit-testing
This is a testing repository to come up with a circuit for a minified KILT credential to test the file sized of keys, proof etc. As Merkle trees look promising, we will start with such. Ideally, we can come up with a `circom` file. Later, we will extend to circuit to more input.

## kilt-prototype using iden3

In summary, two different "membership inclusion" proving methods were tested on a Macbook Pro 2018 (2,6 GHz CPU, 16GB RAM) for three different numbers of SMT levels (5, 10, 15). The biggest files were `circuit15.json` and `original15>proof.json` with about 22mb each. These should stay on the Claimer's local machine and not be used on-chain. On the other hand, files needed for on-chain use/distribution were fairly small: `public.json` (<1kb), `verification_key.json` (~4-5kb) and `proof.json` (~1-2kb). The proof building execution times varied between 36s (Groth 5L) and 120s (Original 15L). The trusted setup took even longer (between 50-170s) but this would only need to be done once for every different circuit we come up with (and ideally be done in an MPC).

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

See [kilt-prototype/README.md](https://github.com/KILTprotocol/zksnark-circuit-testing/tree/master/kilt-prototype) for more details. 

## Todos
- [x] Create a Merkle tree circuit for `input.json` (if not possible, create one for even less input)
- [x] Check filesizes for keys, proof, verification
- [ ] Check differences between hashing all input values vs. not all
- [ ] Extend circuit for more attribute inputs and compare file sizes

## Resources
- [Devcon Workshop for zkRollup using Merkle trees with circom and snarkjs](https://keen-noyce-c29dfa.netlify.com/#0)
- [Circuit in circomlib example](https://github.com/DalaiLlaama/snappframes/tree/master/circuits)
- [Circomlib Js SMT](https://github.com/iden3/circomlib/blob/master/src/smt.js)
- [Circomlib SMT circom files](https://github.com/iden3/circomlib/tree/master/circuits/smt)
- [Circom](https://github.com/iden3/circom)
- [Circom + Snarkjs Tutorial](https://github.com/iden3/circom/blob/master/TUTORIAL.md)
- [Quadratic Arithmetic Programs from Zero to hero](https://medium.com/@VitalikButerin/quadratic-arithmetic-programs-from-zero-to-hero-f6d558cea649)
- [Poseidon hash function](https://eprint.iacr.org/2019/458.pdf)

## Minified credential

This is a flattened and minified version of an actual attestedClaim object. It would also be interesting to see, whether non-hashed attributes should actually be hashed before using them as input for the circuit.

attestedClaimMini.json
```json
{
    "name": "Alice",
    "age": 29,
    "claimerHash": "0xc6a30fbe790804a28390fedf7429ad96e895e66c7ea7691d674edaaf0f80d8ee",
    "claimerSignature": "0x97e941d9211b91726362282b4bbee528ab1340842ccd44b083dc732a6a8b44cc8813c0a2dd72dafd39b68ada5d7ec92b99190a8e5e1ed7750d7f4c73f35d0f0f",
    "attester": "5Cf2axfXbRKsNBDXuha7hTNi561BNxKM1A7B33xhY1qhR6Hz",
    "attestationHash": "0x4adf483a788c691947405f71f8ca45664f586b23decbd6fc5ca75dc8fc36a67e",
}
```

attestedClaim.json
```json
{
  "request": {
    "claim": {
      "cType": "0x981955a2b7990554f6193a9e770ea625c68d2bfc5a1ff996e6e28d2a620fae16",
      "contents": {
        "name": "Alice",
        "age": 29
      },
      "owner": "5CLSZ86fcHY7GPKQqnMwM787bqgDddadctnA7rtL1CduQuTu"
    },
    "claimOwner": {
      "nonce": "1467fdb4-b14f-45de-a1cb-181b7194199a",
      "hash": "0xc6a30fbe790804a28390fedf7429ad96e895e66c7ea7691d674edaaf0f80d8ee"
    },
    "ctypeHash": {
      "nonce": "f7e96d23-5e53-4011-b5eb-27a36b62f9a3",
      "hash": "0x1162f2a836f53a62d7ac679749b2e34ea94c79bfc023f35ca223099bccaeccb3"
    },
    "legitimations": [],
    "claimHashTree": {
      "name": {
        "nonce": "0474aa5b-575b-499d-8ee5-3d273ebde014",
        "hash": "0xfd5c7630da06ee73e8e4261f23338cb293c2dfaa01bd12299acf0f15cb95f4a5"
      },
      "age": {
        "nonce": "a7100759-2479-456d-a8b2-a9d2d74a85c8",
        "hash": "0xca28d654014284e417de246b3a088e3d3fd183e85545bca4c19d489e73809c2a"
      }
    },
    "hash": "0x4adf483a788c691947405f71f8ca45664f586b23decbd6fc5ca75dc8fc36a67e",
    "claimerSignature": "0x97e941d9211b91726362282b4bbee528ab1340842ccd44b083dc732a6a8b44cc8813c0a2dd72dafd39b68ada5d7ec92b99190a8e5e1ed7750d7f4c73f35d0f0f"
  },
  "attestation": {
    "owner": "5Cf2axfXbRKsNBDXuha7hTNi561BNxKM1A7B33xhY1qhR6Hz",
    "claimHash": "0x4adf483a788c691947405f71f8ca45664f586b23decbd6fc5ca75dc8fc36a67e",
    "cTypeHash": "0x981955a2b7990554f6193a9e770ea625c68d2bfc5a1ff996e6e28d2a620fae16",
    "revoked": false
  }
}
```

