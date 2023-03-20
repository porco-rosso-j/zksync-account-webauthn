import { Button, Box, Text, VStack } from "@chakra-ui/react";
import { useEthers } from "@usedapp/core";
import { ZkSyncLocal } from "../scripts/zkSyncLocal";
import { grayed_lavender, lavender, turquoise } from "../theme";

type Props = {
  deployAccount: any;
  isConnected: boolean;
  disabled: boolean
};

export default function SwapButton({
  deployAccount,
  isConnected,
  disabled
}: Props) {
  const { account, chainId, switchNetwork, activateBrowserWallet, error } =
    useEthers();

  function funcIsCorrectChainId() {
      return chainId === ZkSyncLocal.chainId;
  }
  
  const isCorrectChainId = funcIsCorrectChainId();

  async function handleConnectWallet() {
    activateBrowserWallet({ type: "metamask" });
    await switchNetwork(ZkSyncLocal.chainId);
  }

  return !isConnected ? (
          <Box mt="0.5rem">
          <Button
            onClick={() => {
              deployAccount();
            }}
            color="white"
            bg={lavender}
            width="100%"
            p="1.62rem"
            borderRadius="1.25rem"
            _hover={{ bg: turquoise }}
            disabled={disabled}
          >
            deployAccount
          </Button>
        </Box>
      ) : null
}

