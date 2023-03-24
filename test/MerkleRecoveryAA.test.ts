import { expect } from "chai";
import { Wallet, Provider, Contract, utils } from "zksync-web3";
import * as hre from "hardhat";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import { ethers } from 'ethers';
import * as _crypto from 'crypto';
const crypto = _crypto.webcrypto;

const RICH_WALLET = {
  address: "0x36615Cf349d7F6344891B1e7CA7C72883F5dc049",
  privateKey: "0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110"
};
// "address": "0xa61464658AfeAf65CccaaFD3a512b69A83B77618"
// "privateKey": "0xac1e735be8536c6534bb4f17f06f6afc73b2b5ba84ac2cfb12f7461b20c0bbe3"


   
describe('MerkleRecoveryAA', () => {
    let factory;
    let aaFactoryArtifact;
    let wallet; 

    beforeEach(async () => {
        const provider = Provider.getDefaultProvider();
        wallet = new Wallet(RICH_WALLET.privateKey, provider);
        const deployer = new Deployer(hre, wallet);
        // Factory
        aaFactoryArtifact = await deployer.loadArtifact('AAFactory');
        const aaArtifact = await deployer.loadArtifact('MerkleRecoveryAA');
        const aaBytecodehash = utils.hashBytecode(aaArtifact.bytecode);
        factory = await deployer.deploy(
            aaFactoryArtifact,
            [aaBytecodehash],
            undefined,
            [aaArtifact.bytecode]
            );

        // AA
        const aaFactory = new ethers.Contract(
            factory.address,
            aaFactoryArtifact.abi,
            wallet
        );

        const salt = ethers.constants.HashZero;

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
        }

        const pubKeyBuffer = bufferFromBase64('MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEWyyMt1l16_1rzDP63Ayw9EFpn1VbSt4NSJ7BOsDzqed5Z3aTfQSvzPBPHb4uYQuuckOKRbdoH9S0fEnSvNxpRg');
        
        const rawPubkey = await crypto.subtle.exportKey("jwk", await getKey(pubKeyBuffer))
        const { x, y } = rawPubkey;
        const pubkeyUintArray = [ 
        ethers.BigNumber.from(ethers.utils.hexlify(bufferFromBase64(x))),
        ethers.BigNumber.from(ethers.utils.hexlify(bufferFromBase64(y)))
        ]

        const tx = await aaFactory.deployAccount(
            salt,
            pubkeyUintArray
          );
          await tx.wait();
  
          const abiCoder = new ethers.utils.AbiCoder();
          const accountAddress = utils.create2Address(
            factory.address,
            await aaFactory.merkleRecoveryBytecodeHash(),
            salt,
            abiCoder.encode(['bytes32', 'uint256[2]'], [salt, pubkeyUintArray])
          );
          console.log(`Account deployed on address ${accountAddress}`);
    });

    it('should deploy AA account', async () => {




    });

});