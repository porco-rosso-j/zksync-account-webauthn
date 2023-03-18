
import { Chain } from "@usedapp/core"
import {address} from "./utils/address"

const zksyncExplorerUrl = 'https://zksync2-testnet.zkscan.io'

export const ZkSyncLocal:Chain = {
    chainId: 270,
    chainName: 'zkSync local',
    isTestChain: true,
    isLocalChain: true,
    multicallAddress: address.multicall1,
    multicall2Address: address.multicall2,
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