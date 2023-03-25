import { expect } from "chai";
import { Wallet, Provider, Contract, utils } from "zksync-web3";
import * as hre from "hardhat";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import { ethers } from 'ethers';
import {Buffer} from 'buffer';
import * as _crypto from 'crypto';
const crypto = _crypto.webcrypto;

const RICH_WALLET = {
  address: "0x36615Cf349d7F6344891B1e7CA7C72883F5dc049",
  privateKey: "0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110"
};
// "address": "0xa61464658AfeAf65CccaaFD3a512b69A83B77618"
// "privateKey": "0xac1e735be8536c6534bb4f17f06f6afc73b2b5ba84ac2cfb12f7461b20c0bbe3"

   
describe('TransferableAA', () => {
    let factory;
    let transferableAAFactoryArtifact;
    let wallet; 
    let accountAddress;

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

    function bufferFromBase64(value) {
        return Buffer.from(value, "base64")
    };

    async function getKey(pubkey) {
        const algoParams = {
            name: 'ECDSA',
            namedCurve: 'P-256',
            hash: 'SHA-256',
            };
        return await crypto.subtle.importKey('spki', pubkey, algoParams, true, ['verify'])
    };

    async function getSig(_signatureBase64:string, _authenticatorData:string, _clientData:string, _challenge:string):Promise<string> {
        const signatureBuffer = bufferFromBase64(_signatureBase64);
        // console.log("signatureBuffer: ", signatureBuffer)
        const signatureParsed = derToRS(signatureBuffer);
        // console.log("signatureParsed: ", signatureParsed)
    
        const sig = [
            ethers.BigNumber.from(ethers.utils.hexlify(signatureParsed[0])),
            ethers.BigNumber.from(ethers.utils.hexlify(signatureParsed[1]))
          ];
    
        const authenticatorData = bufferFromBase64(_authenticatorData);
        const clientData = bufferFromBase64(_clientData);
        const challengeOffset = clientData.indexOf("226368616c6c656e6765223a", 0, "hex") + 12 + 1;  
        // console.log("challengeOffset: ", challengeOffset)
        
        const abiCoder = new ethers.utils.AbiCoder();
        const signature = abiCoder.encode(
            ["bytes", "bytes1", "bytes", "string", "uint", "uint[2]"],
            [authenticatorData, 0x01, clientData, _challenge, challengeOffset, sig])
        // console.log("signature: ", signature)
        return signature;
    };

    beforeEach(async () => {
        const provider = Provider.getDefaultProvider();
        wallet = new Wallet(RICH_WALLET.privateKey, provider);
        const deployer = new Deployer(hre, wallet);
        // Factory
        transferableAAFactoryArtifact = await deployer.loadArtifact('TransferableAAFactory');
        const transferableAAArtifact = await deployer.loadArtifact('TransferableAA');
        const transferableAABytecodehash = utils.hashBytecode(transferableAAArtifact.bytecode);
        factory = await deployer.deploy(
            transferableAAFactoryArtifact,
            [transferableAABytecodehash],
            undefined,
            [transferableAAArtifact.bytecode]
            );

        // AA
        const transferableAAFactory = new ethers.Contract(
            factory.address,
            transferableAAFactoryArtifact.abi,
            wallet
        );

        const salt = ethers.constants.HashZero;


        const pubKeyBuffer = bufferFromBase64('MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEWyyMt1l16_1rzDP63Ayw9EFpn1VbSt4NSJ7BOsDzqed5Z3aTfQSvzPBPHb4uYQuuckOKRbdoH9S0fEnSvNxpRg');
        
        const rawPubkey = await crypto.subtle.exportKey("jwk", await getKey(pubKeyBuffer))
        const { x, y } = rawPubkey;
        const pubkeyUintArray = [ 
        ethers.BigNumber.from(ethers.utils.hexlify(bufferFromBase64(x))),
        ethers.BigNumber.from(ethers.utils.hexlify(bufferFromBase64(y)))
        ]

        const tx = await transferableAAFactory.deployAccount(
            salt,
            pubkeyUintArray
          );
          await tx.wait();
  
          const abiCoder = new ethers.utils.AbiCoder();
          const accountAddress = utils.create2Address(
            factory.address,
            await transferableAAFactory.transferableAABytecodeHash(),
            salt,
            abiCoder.encode(['bytes32', 'uint256[2]'], [salt, pubkeyUintArray])
          );
          console.log(`TransferableAA deployed on address ${accountAddress}`);
    });

    // from signature verification section 
    const sigParams = {
    pubKey: "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEWyyMt1l16_1rzDP63Ayw9EFpn1VbSt4NSJ7BOsDzqed5Z3aTfQSvzPBPHb4uYQuuckOKRbdoH9S0fEnSvNxpRg==",
    signature: "MEYCIQDgSy1brw1UVCT4kzaZIiiihNuC7KvV2vm3gO5f1CSscQIhAM6-MihKO2jnF_BHeEJMYZ7jN-kz9TuWqYwJJzm4fOcl",
    authenticatorData: "SZYN5YgOjGh0NBcPZHZgW4_krrmihjLHmVzzuoMdl2MFAAAAAQ==",
    clientData: "eyJ0eXBlIjoid2ViYXV0aG4uZ2V0IiwiY2hhbGxlbmdlIjoiMjRkMjI0ZDMtMWQwZi00MzAxLTg3NTktMzk4ODcwNTg1ZTU1Iiwib3JpZ2luIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwIiwiY3Jvc3NPcmlnaW4iOmZhbHNlfQ==",
    clientChallenge: "24d224d3-1d0f-4301-8759-398870585e55"
    };

    it('Set new coordinates on TransferalbeAA account', async () => {
        // const sig = await getSig(
        //     sigParams.signature,
        //     sigParams.authenticatorData,
        //     sigParams.clientData,
        //     sigParams.clientChallenge
        // );

        // const signature = ethers.utils.arrayify(sig);

        // console.log("signature: ", signature)
            
        // const _customData: types.Eip712Meta = {
        //     gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
        //     paymasterParams: _paymasterParams,
        //     customSignature: signature
        // }
        // return {
        //     from: _from,
        //     to: address.paymaster,
        //     chainId: (await provider.getNetwork()).chainId,
        //     nonce: await provider.getTransactionCount(_from),
        //     type: 113,
        //     data: _popTx.data as BytesLike,
        //     customData: _customData,
        //     value: BigNumber.from(0),
        //     gasPrice: await provider.getGasPrice(),
        //     gasLimit: gasLimit // BigNumber.from(1000000),
        // }



    });

});


// const bytesArray = new Uint8Array(32).fill(255); 
// const maxValue = ethers.utils.hexlify(bytesArray);

// transaction.data = ethers.utils.defaultAbiCoder.encode(
//     ['bytes32', 'uint[2]'], 
//     [maxValue, XXXXXXXXXXXX]
// )