

import { BigNumber, constants} from 'ethers';
import { Wallet, Provider, utils, Contract } from 'zksync-web3';
import {default as accountFacArtifact} from "./artifacts/AccountFactory.json"
import { AccountFactory } from "../../../typechain-types"
import {address} from "./utils/address"
import { rich_wallet } from "./utils/rich-wallet"
import { data, bufferFromBase64, bufferToHex } from "./helpers/webuathn"
import {client} from './webauthn/index'

const provider = new Provider("http://localhost:3050", 270);
const wallet = new Wallet(rich_wallet[0].privateKey, provider);
const factory = <AccountFactory>(new Contract(address.factory, accountFacArtifact.abi, wallet))

export async function _deployAccount():Promise<any> {

    let result
    try {
        result = await client.register("user", data.challenge, data.registerOptions);
        console.log(result);
    } catch(e) {
        console.warn(e)
    }

    const cordinates = await getCordinates(result?.credential.publicKey);
    const salt = constants.HashZero;
    const tx = await (await factory.deployAccount(salt, [cordinates[0], cordinates[1]])).wait()
    const accAddress = (await utils.getDeployedContracts(tx))[0].deployedAddress

    return [
        accAddress, 
        result?.credential.id,
        result?.credential.publicKey, 
        result?.authenticatorData, 
        result?.clientData
    ]
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
    const rawPubkey = await crypto.subtle.exportKey("jwk", await getKey(pubKeyBuffer))
    const { x, y } = rawPubkey;
    const pubkeyUintArray = [ 
    BigNumber.from(bufferToHex(bufferFromBase64(x as string))),
    BigNumber.from(bufferToHex(bufferFromBase64(y as string)))
   ]

   return pubkeyUintArray
}