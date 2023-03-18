import { Button, Box, Text, Flex, useColorMode } from "@chakra-ui/react";
import { useEthers, useEtherBalance } from "@usedapp/core";
import { formatEther } from "@ethersproject/units";
import Identicon from "./Identicon";
import {AccountInfo} from "../common/interfaces/AccountInterface"

type Props = {
  handleOpenModal: any;
  fontSize: string;
  AccountInfo: AccountInfo;
};

export default function ConnectButton({ handleOpenModal, fontSize, AccountInfo }: Props) {
  const AccAddress = AccountInfo.AccAddress
  const etherBalance = useEtherBalance( AccountInfo.isConnected ? AccAddress : null);
  const {colorMode } = useColorMode();

  return AccountInfo.isConnected ? (
    <Flex alignItems="center" bg={colorMode === "dark" ? "rgb(30,30,30)" : "rgb(247, 248, 250)"} borderRadius="xl" py="0" mx="1.5rem">
      <Box px="3">
        <Text color={colorMode === "dark" ? "white" : "black"} fontSize={fontSize}>
          {console.log("ethbalance!: ", etherBalance)}
          {etherBalance && parseFloat(formatEther(etherBalance)).toFixed(0)} ETH
        </Text>
      </Box>
      <Button
        onClick={handleOpenModal}
        bg={colorMode === "dark" ? "black" : "white"}
        border="0.06rem solid transparent"
        _hover={{
          border: "0.06rem",
          borderStyle: "solid",
          borderColor: "rgb(211,211,211)",
        }}
        borderRadius="xl"
        m="0.06rem"
        px={3}
        h="2.37rem"
      >
        <Text color={colorMode === "dark" ? "white" : "black"} fontSize={fontSize} fontWeight="medium" mr="2">
        {AccAddress &&
          `${AccAddress.slice(0, 6)}...${AccAddress.slice(
            AccAddress.length - 4,
            AccAddress.length
          )}`}
      </Text>
        <Identicon />
      </Button>
    </Flex>
  ) : (
    <Button
      onClick={handleOpenModal}
      bg="rgb(253, 234, 241)"
      color="rgb(213, 0, 102)"
      fontSize={fontSize}
      fontWeight="semibold"
      borderRadius="xl"
      border="0.06rem solid rgb(253, 234, 241)"
      _hover={{
        borderColor: "rgb(213, 0, 102)",
      }}
      _active={{
        borderColor: "rgb(213, 0, 102)",
      }}
    >
      Connect to a wallet
    </Button>
  );
}
