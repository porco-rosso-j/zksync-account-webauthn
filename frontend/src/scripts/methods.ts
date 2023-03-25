
import * as ethers from 'ethers';
import { Provider, utils, Contract, types } from 'zksync-web3';
import {default as paymasterArtifact} from "./artifacts/Paymaster.json"
import {default as accountArtifact} from "./artifacts/Account.json"
import {address} from "./utils/address"
import {WebAuthn} from "./interfaces/AccountInterface"
import { authenticate } from "./helpers/webuathn"
import { getEIP712TxRequest, getCustomData } from "./helpers/zksync"
import { getLocationHash, getTxWithPosition } from "./helpers/position"

const provider = new Provider("http://localhost:3050", 270);


export async function _faucet(
       _account:string, 
       _amount: number, 
       _webAuthnData:WebAuthn
    ):Promise<any> {
    const customData: types.Eip712Meta = await _getCustomData(_webAuthnData.credentialId)

    const paymaster = new Contract(address.paymaster, paymasterArtifact.abi, provider)
    const popTx: types.TransactionRequest = await paymaster.populateTransaction.faucet(ethers.utils.parseEther(_amount.toString()))
    let tx: types.TransactionRequest = await getEIP712TxRequest(_account, address.paymaster, popTx.data as ethers.BytesLike, customData)

    await _sendTx(_account, tx)
}

export async function _transferETH(
    _account:string, 
    _recipient:string,
    _amount: number, 
    _webAuthnData:WebAuthn
 ):Promise<any> {
  const customData: types.Eip712Meta = await _getCustomData(_webAuthnData.credentialId)

 let tx: types.TransactionRequest = await getEIP712TxRequest(_account, _recipient, "0x", customData)
 tx.value = ethers.utils.parseEther(_amount.toString())

 await _sendTx(_account, tx)
}

//https://github.blog/2023-03-23-we-updated-our-rsa-ssh-host-key/


export async function _enabledLocation(_account:string, _webAuthnData: WebAuthn):Promise<any> {
  const customData: types.Eip712Meta = await _getCustomData(_webAuthnData.credentialId)

  const account = new Contract(_account, accountArtifact.abi, provider)
  const positionHash: string | undefined = await getLocationHash(_account)
  const popTx: types.TransactionRequest = await account.populateTransaction.enablePosition(positionHash)
  let tx: types.TransactionRequest = await getEIP712TxRequest(_account, _account, popTx.data as ethers.BytesLike, customData)

  await _sendTx(_account, tx)
}

async function _getCustomData(_credentialId: string):Promise<types.Eip712Meta> {
  const signature = await authenticate(_credentialId)
  if (!signature) console.log("invalid signature");
  return await getCustomData(signature as ethers.utils.BytesLike)
}

async function _sendTx(_account: string, tx: types.TransactionRequest) {
  tx.data = await getTxWithPosition(_account, tx.data as ethers.BytesLike)
  const response = await(await provider.sendTransaction(utils.serialize(tx))).wait()
  console.log("response: ", response)
}