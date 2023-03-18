import { ethers, BigNumber} from "ethers";

export const toBN = (x: string): BigNumber => {
    return ethers.utils.parseEther(x)
}

export const GASLIMIT = {
    gasLimit: ethers.utils.hexlify(1000000)
}