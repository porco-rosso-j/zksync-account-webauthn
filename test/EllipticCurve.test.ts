// import {loadFixture} from "@nomicfoundation/hardhat-network-helpers"
import { expect } from "chai";
import * as _crypto from 'crypto';
const crypto = _crypto.webcrypto
import ethers from 'hardhat';
import * as zksync from 'zksync-web3';

// data available in playground: https://webauthn.passwordless.id/demos/playground.html
const InputBase64 = {
    // from signature verification section 
    // pubKey: "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEWyyMt1l16_1rzDP63Ayw9EFpn1VbSt4NSJ7BOsDzqed5Z3aTfQSvzPBPHb4uYQuuckOKRbdoH9S0fEnSvNxpRg==",
    // signature: "MEYCIQDgSy1brw1UVCT4kzaZIiiihNuC7KvV2vm3gO5f1CSscQIhAM6-MihKO2jnF_BHeEJMYZ7jN-kz9TuWqYwJJzm4fOcl",
    // authenticatorData: "SZYN5YgOjGh0NBcPZHZgW4_krrmihjLHmVzzuoMdl2MFAAAAAQ==",
    // clientData: "eyJ0eXBlIjoid2ViYXV0aG4uZ2V0IiwiY2hhbGxlbmdlIjoiMjRkMjI0ZDMtMWQwZi00MzAxLTg3NTktMzk4ODcwNTg1ZTU1Iiwib3JpZ2luIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwIiwiY3Jvc3NPcmlnaW4iOmZhbHNlfQ==",
    // clientChallenge: "24d224d3-1d0f-4301-8759-398870585e55"

    // data from authentication section
    pubKey: "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAECHPcvASU7M6gqEKnMax_KATt_yeGUC3GS3ji4Rm6p6Yw9G0EtR_D_JdEbT7o35GgwPTWTOlp-kFhdrXulbxh4w==",
    signature: "MEUCIQCHnopulCeWB0-PRhbhwOjZMK05pVtK74b58t2iVZlDWwIgb_AlokXup-rsaN43b-w2OoQJcxA8HP3kcCr4wZ0H9uk=",
    authenticatorData: "T7IIVvJKaufa_CeBCQrIR3rm4r0HJmAjbMYUxvt8LqAFAAAAAA==",
    clientData: "eyJ0eXBlIjoid2ViYXV0aG4uZ2V0IiwiY2hhbGxlbmdlIjoiNjk3ZTg1NTgtZTE4My00OTEyLWJmM2QtNWJiM2FiNTM1YzVlIiwib3JpZ2luIjoiaHR0cHM6Ly93ZWJhdXRobi5wYXNzd29yZGxlc3MuaWQiLCJjcm9zc09yaWdpbiI6ZmFsc2V9",
    clientChallenge: "697e8558-e183-4912-bf3d-5bb3ab535c5e"
}

describe("Webauthn", function () {
  const provider = new zksync.Provider("http://localhost:3050", 270);
  console.log("provider: ", provider)
  
  function derToRS(der) {
    var offset = 3;
    var dataOffset;

    if (der[offset] == 0x21) {
      dataOffset = offset + 2;
    }
    else {
      dataOffset = offset + 1;
    }
    const r = der.slice(dataOffset, dataOffset + 32);
    offset = offset + der[offset] + 1 + 1
    if (der[offset] == 0x21) {
      dataOffset = offset + 2;
    }
    else {
      dataOffset = offset + 1;
    }
    const s = der.slice(dataOffset, dataOffset + 32);
    return [ r, s ]
  }

function bufferFromBase64(value) {
    return Buffer.from(value, "base64")
}
function bufferToHex (buffer) {
    // return ("0x").concat([...new Uint8Array (buffer)]
    //   .map (b => b.toString (16).padStart (2, "0"))
    //   .join (""));
}
  
  async function getKey(pubkey) {
      const algoParams = {
          name: 'ECDSA',
          namedCurve: 'P-256',
          hash: 'SHA-256',
        };
    return await crypto.subtle.importKey('spki', pubkey, algoParams, true, ['verify'])
  }

  async function deploy() {
    const pubKeyBuffer = bufferFromBase64(InputBase64.pubKey);
    const rawPubkey = await crypto.subtle.exportKey("jwk", await getKey(pubKeyBuffer))
    const { x, y } = rawPubkey;
  //   const pubkeyUintArray = [ 
  //   ethers.BigNumber.from(bufferToHex(bufferFromBase64(x))),
  //   ethers.BigNumber.from(bufferToHex(bufferFromBase64(y)))
  //  ]

  //   const EllipticCurve2 = await ethers.getContractFactory('EllipticCurve');
  //   const ellipticCurve2 = await EllipticCurve2.deploy(); 

  //   const Webauthn = await ethers.getContractFactory('WebAuthn', {
  //     libraries: { EllipticCurve2: ellipticCurve2.address }
  //   });
  //   const webauthn = await Webauthn.deploy();
  //   return { webauthn, pubkeyUintArray };
  }

  it.skip('should verify', async function () {

    //const { webauthn, pubkeyUintArray } = await loadFixture(deploy);
    const signature = bufferFromBase64(InputBase64.signature);
    const signatureParsed = derToRS(signature);
    const sig = [
      //ethers.BigNumber.from(bufferToHex(signatureParsed[0])),
      //ethers.BigNumber.from(bufferToHex(signatureParsed[1]))
    ];
    const authenticatorData = bufferFromBase64(InputBase64.authenticatorData);
    const clientData = bufferFromBase64(InputBase64.clientData);
    const challengeOffset = clientData.indexOf("226368616c6c656e6765223a", 0, "hex") + 12 + 1;    

    const result = 0
    //  await webauthn.validate(
    //     authenticatorData,
    //     0x05, 
    //     clientData, 
    //     InputBase64.clientChallenge, 
    //     challengeOffset, 
    //     sig, 
    //     pubkeyUintArray
    //     );

   expect(result);
  });

});

