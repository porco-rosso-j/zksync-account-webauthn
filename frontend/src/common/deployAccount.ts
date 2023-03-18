

import { BigNumber, constants, utils as ethUtils} from 'ethers';
import { Wallet, Provider, utils, Contract, types } from 'zksync-web3';
import { Deployer } from '@matterlabs/hardhat-zksync-deploy';
import {default as accountFacArtifact} from "./artifacts/AccountFactory.json"
import {default as accountArtifact} from "./artifacts/Account.json"
// import {default as paymasterArtifact} from "./artifacts/Paymaster.json"
import { AccountFactory } from "../../../typechain-types"
import {address} from "./utils/address"
import {Buffer} from 'buffer';
import { rich_wallet } from "./utils/rich-wallet"

import {client, server, parsers, utils as webUtils, types as webTypes} from './webauthn/index'

const provider = new Provider("http://localhost:3050", 270);
// const web3provider = new Web3Provider(window.ethereum)
const wallet = new Wallet(rich_wallet[0].privateKey, provider);
const factory = <AccountFactory>(new Contract(address.factory, accountFacArtifact.abi, wallet))
//const paymaster = <AccountFactory>(new Contract(address.paymaster, paymasterArtifact.abi, provider))

// const deployer = new Deployer(hre, wallet);

export async function _deployAccount():Promise<any> {

    //console.log("here")
    let result
    try {
        result = await client.register("test", data.challenge, data.options);
        console.log(result);
    } catch(e) {
        console.warn(e)
    }

    console.log(result);
    console.log(result?.credential.publicKey);

    const cordinates = await getCordinates(result?.credential.publicKey);
    //const account = await deployAccountSponsored(cordinates)
    const salt = constants.HashZero;
    const tx = await (await factory.deployAccount(salt, [cordinates[0], cordinates[1]])).wait()
    const accAddress = (await utils.getDeployedContracts(tx))[0].deployedAddress
    console.log("accAddress: ", accAddress)

    return [accAddress, result?.credential.publicKey, result?.authenticatorData, result?.clientData]
}

// async function deployAccountSponsored(cordinates:BigNumber[]):Promise<string> {
//     const salt = constants.HashZero;

//     const _paymasterParams = utils.getPaymasterParams(address.paymaster, {
//         type: "General",
//         innerInput: new Uint8Array()
//     } as types.GeneralPaymasterInput 
//     );

//     const _customData = {
//         ergsPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
//         paymasterParams: _paymasterParams,
//     }

//     const gasPrice = await provider.getGasPrice();
//     const gasLimit = await factory.estimateGas.deployAccount(salt, [cordinates[0], cordinates[1]], {
//         customData: _customData,
//     });

//     const create2Address = utils.create2Address(
//         factory.address,
//         utils.hashBytecode(accountArtifact.bytecode), // bytecodeHash
//         ethUtils.keccak256(ethUtils.solidityPack(['uint[]'], [cordinates])), // salt
//         []
//       );

//     const transaction = await(await factory.deployAccount(salt, [cordinates[0], cordinates[1]], {
//         from: create2Address,
//         maxFeePerGas: gasPrice,
//         maxPriorityFeePerGas: gasPrice,
//         gasLimit,
//         customData: _customData,
//     })).wait()

//     const accAddress = (await utils.getDeployedContracts(transaction))[0].deployedAddress
//     console.log("accAddress: ", accAddress)
//     return accAddress
// }

const data = {

    challenge: webUtils.randomChallenge(),
    options: {
        authenticatorType: 'auto',
        userVerification: 'required',
        timeout: 60000,
        attestation: false,
    } as webTypes.RegisterOptions,
}

function bufferFromBase64(value: string):ArrayBufferLike {
    console.log("value: ", value)
    return Buffer.from(value, "base64")
}
function bufferToHex (buffer: ArrayBufferLike):string {
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

async function getCordinates(pubkey:string | undefined):Promise<BigNumber[]> {
    const pubKeyBuffer = bufferFromBase64(pubkey as string);
    console.log("pubKeyBuffer: ", pubKeyBuffer)
    const rawPubkey = await crypto.subtle.exportKey("jwk", await getKey(pubKeyBuffer))
    const { x, y } = rawPubkey;
    console.log("x: ", x)
    console.log("y: ", y)
    const pubkeyUintArray = [ 
    BigNumber.from(bufferToHex(bufferFromBase64(x as string))),
    BigNumber.from(bufferToHex(bufferFromBase64(y as string)))
   ]

   return pubkeyUintArray
}