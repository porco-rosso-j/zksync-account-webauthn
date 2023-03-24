import { expect } from "chai";
import { Wallet, Provider, Contract, utils } from "zksync-web3";
import * as hre from "hardhat";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
 
const RICH_WALLET = {
  address: "0x36615Cf349d7F6344891B1e7CA7C72883F5dc049",
  privateKey: "0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110"
};
// "address": "0xa61464658AfeAf65CccaaFD3a512b69A83B77618"
// "privateKey": "0xac1e735be8536c6534bb4f17f06f6afc73b2b5ba84ac2cfb12f7461b20c0bbe3"


   
describe('AAFactory', () => {
    let aaFactory;

    beforeEach(async () => {
    const provider = Provider.getDefaultProvider();
    const wallet = new Wallet(RICH_WALLET.privateKey, provider);
    const deployer = new Deployer(hre, wallet);

    const aaFactoryArtifact = await deployer.loadArtifact('AAFactory');
    const aaArtifact = await deployer.loadArtifact('MerkleRecoveryAA');
    const aaBytecodehash = utils.hashBytecode(aaArtifact.bytecode);
    aaFactory = await deployer.deploy(
        aaFactoryArtifact,
        [aaBytecodehash],
        undefined,
        [aaArtifact.bytecode]
        );
    });

    it('should deploy', async () => {
        console.log(`aa address: ${aaFactory.address}`);
    });

});