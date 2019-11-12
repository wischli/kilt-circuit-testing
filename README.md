# kilt-circuit-testing
This is a testing repository to come up with a circuit for a minified KILT credential to test the file sized of keys, proof etc.. As Merkle trees look promising, we will start with such. Ideally, we can come up with a `circom` file. Later, we will extend to circuit to more input.

## Todos
- [ ] Create a Merkle tree circuit for `input.json` (if not possible, create one for even less input)
- [ ] Check filesizes for keys, proof, verification
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

