
import { Chain } from "@usedapp/core"

const zksyncExplorerUrl = 'https://zksync2-testnet.zkscan.io'

export const ZkSyncLocal:Chain = {
    chainId: 270,
    chainName: 'zkSync local',
    isTestChain: true,
    isLocalChain: true,
    multicallAddress: "",
    multicall2Address: "",
    rpcUrl: 'http://localhost:3050',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    blockExplorerUrl: zksyncExplorerUrl,
    getExplorerAddressLink: () => '',
    getExplorerTransactionLink: () => '',
  }