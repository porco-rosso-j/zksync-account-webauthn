

import { BigNumber, BytesLike, constants, utils as ethUtils} from 'ethers';
import { Wallet, Provider, utils, Contract, types, Web3Provider } from 'zksync-web3';
import {default as paymasterArtifact} from "./artifacts/Paymaster.json"
// import {default as accountArtifact} from "./artifacts/Account.json"
// import { Paymaster } from "../../../typechain-types"
import {address} from "./utils/address"
import {Buffer} from 'buffer';
import { rich_wallet } from "./utils/rich-wallet"
import {client, server, parsers, utils as webUtils, types as webTypes} from './webauthn/index'
import {WebAuthn} from "./interfaces/AccountInterface"

// const web3provider = new Web3Provider(window.ethereum)
const gasLimit = ethUtils.hexlify(9000000)
const provider = new Provider("http://localhost:3050", 270);
const wallet = new Wallet(rich_wallet[0].privateKey, provider);
// const paymaster = <Paymaster>(new Contract(address.paymaster, paymasterArtifact.abi, wallet))
const paymaster = new Contract(address.paymaster, paymasterArtifact.abi, provider)

export async function _faucet(
       _account:string, 
       _amount: number, 
       WebAuthn:WebAuthn
    ):Promise<any> {
    console.log("WebAuthn.credentialId: ", WebAuthn.credentialId)
    const challenge = data.challenge
    console.log("challenge: ",challenge)
    let result;
    try {
        result = await client.authenticate(WebAuthn.credentialId ? [WebAuthn.credentialId] : [], challenge, data.options)
        console.log("result", result)

    const signature: BytesLike = ethUtils.arrayify(
        await getSig(
            result?.signature as string, 
            result?.authenticatorData as string, 
            result?.clientData as string
            )
       )

       console.log("signature: ", signature)
        
    const _customData: types.Eip712Meta = {
        gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
        paymasterParams: _paymasterParams,
        customSignature: signature
    }

    console.log("amount: ", ethUtils.parseEther(_amount.toString()))
    const popTx: types.TransactionRequest = await paymaster.populateTransaction.faucet(ethUtils.parseEther(_amount.toString()))
    console.log("popTx calldata: ", popTx)
    console.log("_customData: ", _customData)
    const tx: types.TransactionRequest = await getEIP712TxRequest(_account, popTx, _customData)
    console.log("tx: ", tx)
    const _result = await(await provider.sendTransaction(utils.serialize(tx))).wait()
    console.log("result: ", _result)
    } catch(e) {
     console.warn(e)
    }

    
}

const _paymasterParams = utils.getPaymasterParams(address.paymaster, {
    type: "General",
    innerInput: new Uint8Array()
} as types.GeneralPaymasterInput 
);

const data = {
    challenge: webUtils.randomChallenge(),
    options: {
        authenticatorType: 'auto',
        userVerification: 'required',
        timeout: 0,
    } as webTypes.AuthenticateOptions,
    algorithm: "ES256"
}

async function getSig(_signatureBase64:string, _authenticatorData:string, _clientData:string):Promise<string> {
    const signatureBuffer = bufferFromBase64(_signatureBase64);
    console.log("signatureBuffer: ", signatureBuffer)
    const signatureParsed = derToRS(signatureBuffer);
    console.log("signatureParsed: ", signatureParsed)

    const sig:BigNumber[] = [
        BigNumber.from(bufferToHex(signatureParsed[0])),
        BigNumber.from(bufferToHex(signatureParsed[1]))
      ];

    const authenticatorData = bufferFromBase64(_authenticatorData);
    const clientData = bufferFromBase64(_clientData);
    const challengeOffset = clientData.indexOf("226368616c6c656e6765223a", 0, "hex") + 12 + 1;  
    console.log("challengeOffset: ", challengeOffset)
    
    const abiCoder = new ethUtils.AbiCoder();
    const signature = abiCoder.encode(
        ["bytes", "bytes1", "bytes", "string", "uint", "uint[2]"],
        [authenticatorData, 0x01, clientData, data.challenge, challengeOffset, sig])
    console.log("signature: ", signature)
    return signature;

    // const account = new Contract(
    //     "0x179df28aE9a5f379629ABF61EfcAB738b0701Ee2", 
    //     accountArtifact.abi,
    //     wallet
    //     )
    
    // const coordinates0:BigNumber = await account.callStatic.coordinates(0)
    // const coordinates1:BigNumber = await account.callStatic.coordinates(1)

    // console.log(
    //     "authenticatorData", authenticatorData,
    //     "clientData", clientData,
    //     "data.challenge", data.challenge,
    //     "challengeOffset", challengeOffset,
    //     "sig", sig,
    //     "coordinates0", coordinates0,
    //     "coordinates1", coordinates1,
    //     )

    // const result = await account.callStatic.checkSignature(
    //     authenticatorData,
    //     0x01,
    //     clientData,
    //     data.challenge,
    //     challengeOffset,
    //     sig,
    //     [coordinates0, coordinates1]
    // )

    // console.log("result: ", result)

    // return "wait"
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

  function bufferFromBase64(value: string):Buffer {
    return Buffer.from(value, "base64")
}
function bufferToHex (buffer: Buffer):string {
    return ("0x").concat([...new Uint8Array (buffer)]
      .map (b => b.toString (16).padStart (2, "0"))
      .join (""));
}

function bufferToHexForBN (buffer: Buffer):string {
    return [...new Uint8Array (buffer)]
      .map (b => b.toString (16).padStart (2, "0"))
      .join ("");
}

async function getEIP712TxRequest(_from:string, _popTx: types.TransactionRequest, _customData:types.Eip712Meta):Promise<types.TransactionRequest> {
    console.log("_from", _from)
    console.log("_calldata", _popTx.data as BytesLike)
    console.log("_customData", _customData.customSignature)

    return {
        from: _from,
        to: address.paymaster,
        chainId: (await provider.getNetwork()).chainId,
        nonce: await provider.getTransactionCount(_from),
        type: 113,
        data: _popTx.data as BytesLike,
        customData: _customData,
        value: BigNumber.from(0),
        gasPrice: await provider.getGasPrice(),
        gasLimit: gasLimit // BigNumber.from(1000000),
    }
}


// const credentialKey = {
//     id: WebAuthn.credentialId,
//     publicKey: WebAuthn.pubkey,
//     algorithm: data.algorithm as "ES256"
// }

// const parsed = await server.verifyAuthentication(result, credentialKey, {
//     challenge: data.challenge,
//     origin: document.location.origin,
//     userVerified: true,
//     counter: 0
// })

// console.log("parsed: ", parsed)