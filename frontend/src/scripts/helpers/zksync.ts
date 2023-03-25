import * as ethers from 'ethers';
import {address} from "../utils/address"
import {Provider, utils, types} from 'zksync-web3';

// gas limit is 10M as signature verification using ECDSA with p256 curve costs at least 7-8M gas
const gasLimit = ethers.utils.hexlify(12000000) 
const provider = new Provider("http://localhost:3050", 270);

export async function getEIP712TxRequest(_from:string, _to: string, _calldata: ethers.BytesLike, _customData:types.Eip712Meta):Promise<types.TransactionRequest> {
    return {
        from: _from,
        to: _to,
        chainId: (await provider.getNetwork()).chainId,
        nonce: await provider.getTransactionCount(_from),
        type: 113,
        data: _calldata,
        customData: _customData,
        value: ethers.BigNumber.from(0),
        gasPrice: await provider.getGasPrice(),
        gasLimit: gasLimit 
    }
}


export const _paymasterParams = utils.getPaymasterParams(address.paymaster, {
    type: "General",
    innerInput: new Uint8Array()
}
);


export async function getCustomData(_signature:ethers.BytesLike):Promise<types.Eip712Meta> {
  
      const customData: types.Eip712Meta = {
        gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
        paymasterParams: _paymasterParams,
        customSignature: _signature
      }

    return customData
}