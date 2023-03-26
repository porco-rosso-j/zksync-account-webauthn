import {Buffer} from 'buffer';
import * as ethers from 'ethers';
import * as webauthn from '../webauthn/index'
import {WebAuthn} from "../interfaces/AccountInterface"

export async function register(_credentialId:string):Promise<any> {
    let result
    try {
        result = await webauthn.client.register("user", data.challenge, data.registerOptions);
        console.log(result);
    } catch(e) {
        console.warn(e)
    }
  
    const cordinates = await getCordinates(result?.credential.publicKey);

    const webauthnData: WebAuthn = {        
        credentialId: result?.credential.id as string,
        pubkey: result?.credential.publicKey as string,
        authenticatorData: result?.authenticatorData as string, 
        clientData: result?.clientData as string,
        signature: ""
    }

    return [webauthnData, cordinates]
}

export async function authenticate(_credentialId:string):Promise<ethers.BytesLike | undefined> {
    try {
        const result = await webauthn.client.authenticate(
          _credentialId ? [_credentialId] : [],
          data.challenge, 
          data.authOptions
          )

          const signature: ethers.BytesLike = await getSig(
            result?.signature as string, 
            result?.authenticatorData as string, 
            result?.clientData as string
          )

          return signature
   
    } catch(e) {
        console.warn(e)
    }
}

export async function getSig(_signatureBase64:string, _authenticatorData:string, _clientData:string):Promise<ethers.BytesLike> {
    const signatureBuffer = bufferFromBase64(_signatureBase64);
    const signatureParsed = derToRS(signatureBuffer);

    const sig:ethers.BigNumber[] = [
        ethers.BigNumber.from(bufferToHex(signatureParsed[0])),
        ethers.BigNumber.from(bufferToHex(signatureParsed[1]))
      ];

    const authenticatorData = bufferFromBase64(_authenticatorData);
    const clientData = bufferFromBase64(_clientData);
    const challengeOffset = clientData.indexOf("226368616c6c656e6765223a", 0, "hex") + 12 + 1;  
    
    const abiCoder = new ethers.utils.AbiCoder();
    const signature = abiCoder.encode(
        ["bytes", "bytes1", "bytes", "string", "uint", "uint[2]"],
        [authenticatorData, 0x01, clientData, data.challenge, challengeOffset, sig])
    return ethers.utils.arrayify(signature);
}


function derToRS(der:Buffer):Buffer[] {
    var offset:number = 3;
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

export const data = {
    challenge: webauthn.utils.randomChallenge(),
    registerOptions: {
        authenticatorType: 'auto',
        userVerification: 'required',
        timeout: 0,
        attestation: false,
    } as webauthn.types.RegisterOptions,
    authOptions: {
        authenticatorType: 'auto',
        userVerification: 'required',
        timeout: 0,
    } as webauthn.types.AuthenticateOptions,
    algorithm: "ES256"
}

export function bufferFromBase64(value: string):Buffer {
    return Buffer.from(value, "base64")
}
export function bufferToHex (buffer: ArrayBufferLike):string {
    return ("0x").concat([...new Uint8Array (buffer)]
      .map (b => b.toString (16).padStart (2, "0"))
      .join (""));
}


async function getKey(pubkey:ArrayBufferLike) {
    const algoParams = {
        name: 'ECDSA',
        namedCurve: 'P-256',
        hash: 'SHA-256',
      };
  return await crypto.subtle.importKey('spki', pubkey, algoParams, true, ['verify'])
}

async function getCordinates(pubkey:string | undefined):Promise<ethers.BigNumber[]> {
    const pubKeyBuffer = bufferFromBase64(pubkey as string);
    const rawPubkey = await crypto.subtle.exportKey("jwk", await getKey(pubKeyBuffer))
    const { x, y } = rawPubkey;
    const pubkeyUintArray = [ 
    ethers.BigNumber.from(bufferToHex(bufferFromBase64(x as string))),
    ethers.BigNumber.from(bufferToHex(bufferFromBase64(y as string)))
   ]

   return pubkeyUintArray
}

