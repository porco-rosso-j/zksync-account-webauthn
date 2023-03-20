import { ethers} from "ethers";
import { Wallet, utils, Contract, Provider} from 'zksync-web3';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { Deployer } from '@matterlabs/hardhat-zksync-deploy';
import { rich_wallet } from "./utils/rich-wallet"
import { toBN } from "./utils/helper";

// Deploy function
export default async function deployAll (hre: HardhatRuntimeEnvironment) {
    const provider = new Provider("http://localhost:3050", 270);
    const wallet = new Wallet(rich_wallet[0].privateKey, provider);
    const deployer = new Deployer(hre, wallet);

    // Deploy Multicall
    const multicallArtifact = await deployer.loadArtifact('Multicall1');
    const multicall = await deployer.deploy(multicallArtifact)
    console.log(`multicall1: "${multicall.address}",`);

    // Deploy Multicall2
    const multical2Artifact = await deployer.loadArtifact('Multicall2');
    const multicall2 = await deployer.deploy(multical2Artifact)
    console.log(`multicall2: "${multicall2.address}",`);
    
    // Deploy AccountFactory
    const factoryArtifact = await deployer.loadArtifact("AccountFactory");
    const accountArtifact = await deployer.loadArtifact("Account");
    const bytecodeHash = utils.hashBytecode(accountArtifact.bytecode);

    const factory = <Contract>(await deployer.deploy(
        factoryArtifact, 
        [bytecodeHash], 
        undefined, 
        [accountArtifact.bytecode,])
        );

    console.log(`factory: "${factory.address}",`)

    // Deploy Paymaster
    const paymasterArtifact = await deployer.loadArtifact('Paymaster');
    const paymaster = await deployer.deploy(paymasterArtifact, [])

    console.log(`paymaster: "${paymaster.address}",`)

      // Supplying paymaster with ETH
  await (
    await deployer.zkWallet.sendTransaction({
      to: paymaster.address,
      value: ethers.utils.parseEther("100"),
    })
  ).wait();

  console.log("paymaster balance: ", (await provider.getBalance(paymaster.address)).toString())
  // await( await paymaster.faucet(toBN("1"))).wait()
  // console.log("paymaster balance: ", (await provider.getBalance(paymaster.address)).toString())
}


