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
    
    // Deploy AccountFactory
    // const accountArtifact = await deployer.loadArtifact("Account");

    // const account = new Contract(
    //     "0x025314E1aa058fb7054C56982a3Cec45F9e3D0a1", 
    //     accountArtifact.abi,
    //     wallet
    //     )

    // // const coordinates0 = await account.callStatic.Q(0)
    // // const coordinates1 = await account.callStatic.Q(1)
    // // console.log(`coordinates 0: "${coordinates0}",`)
    // // console.log(`coordinates 1: "${coordinates1}",`)


    // const array: Buffer = new Buffer(Buffer.from("0x00000000000000000000000000000000000000000000000000000000000000e00100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000001e00000000000000000000000000000000000000000000000000000000000000024ab4fa076c84db7ed8ef48f524e6a412e274b1eafb0f851f40066369d78df95e5e434909da0ef57c0bbe23f0a4bf7eb2331d7ffef5f83c249478aa0944a195322000000000000000000000000000000000000000000000000000000000000002549960de5880e8c687434170f6476605b8fe4aeb9a28632c7995cf3ba831d97630500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000007f7b2274797065223a22776562617574686e2e676574222c226368616c6c656e6765223a2239623134623066612d393866312d346465352d623538612d396133313261306665623234222c226f726967696e223a22687474703a2f2f6c6f63616c686f73743a33303030222c2263726f73734f726967696e223a66616c73657d00000000000000000000000000000000000000000000000000000000000000002439623134623066612d393866312d346465352d623538612d39613331326130666562323400000000000000000000000000000000000000000000000000000000"))
    // console.log("array", array)

    // const sig = await account.decodeSignature(array)

    // console.log("sig: ", sig)

    console.log("bal: ", await provider.getBalance("0x3058227C7Ff4AeA070fB399de1e7C37364431cf6"))
}



