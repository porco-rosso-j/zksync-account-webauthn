
import * as ethers from 'ethers';
import { Provider, utils, Contract, types } from 'zksync-web3';
import {default as paymasterArtifact} from "./artifacts/Paymaster.json"
import {address} from "./utils/address"
import {WebAuthn} from "./interfaces/AccountInterface"
import { authenticate } from "./helpers/webuathn"
import { getEIP712TxRequest, getCustomData } from "./helpers/zksync"

const provider = new Provider("http://localhost:3050", 270);
const paymaster = new Contract(address.paymaster, paymasterArtifact.abi, provider)

export async function _faucet(
       _account:string, 
       _amount: number, 
       _webAuthnData:WebAuthn
    ):Promise<any> {

    const signature = await authenticate(_webAuthnData.credentialId)
    if (!signature) return;

    const customData: types.Eip712Meta = await getCustomData(signature)
    const popTx: types.TransactionRequest = await paymaster.populateTransaction.faucet(ethers.utils.parseEther(_amount.toString()))
    const tx: types.TransactionRequest = await getEIP712TxRequest(_account, address.paymaster, popTx.data as ethers.BytesLike, customData)

    const response = await(await provider.sendTransaction(utils.serialize(tx))).wait()
    console.log("response: ", response)

}

export async function _transferETH(
    _account:string, 
    _recipient:string,
    _amount: number, 
    _webAuthnData:WebAuthn
 ):Promise<any> {

 const signature = await authenticate(_webAuthnData.credentialId)
 if (!signature) return;

 const customData: types.Eip712Meta = await getCustomData(signature)
 let tx: types.TransactionRequest = await getEIP712TxRequest(_account, _recipient, "0x", customData)
 tx.value = ethers.utils.parseEther(_amount.toString())

 const response = await(await provider.sendTransaction(utils.serialize(tx))).wait()
 console.log("response: ", response)

}