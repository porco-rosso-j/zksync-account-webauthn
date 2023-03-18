import {
  Box,
  Button,
  Flex,
  Input,
  Link,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  useColorMode,
  VStack,
  HStack,
} from "@chakra-ui/react";

import { ExternalLinkIcon, CopyIcon } from "@chakra-ui/icons";
import { useEthers } from "@usedapp/core";
import Identicon from "../Identicon";
import {AccountInfo} from "../../common/interfaces/AccountInterface"
import {_deployAccount} from "../../common/deployAccount"

type Props = {
  isOpen: any;
  onClose: any;
  AccountInfo: AccountInfo
  setAccountInfo: any
};

export default function AccountModal({ isOpen, onClose, AccountInfo, setAccountInfo }: Props) {
  const AccAddress = AccountInfo.AccAddress
  const isConnected = AccountInfo.isConnected

  const { account, deactivate } = useEthers();
  const {colorMode } = useColorMode();

  function handleDeactivateAccount() {
    deactivate();
    onClose();
    setAccountInfo({isConnected: false})
  }

  function closeModal() {
    deactivate();
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
      <ModalOverlay />
      <ModalContent
        background={colorMode === "dark" ? "black" : "white"}
        border="0.06rem"
        borderStyle="solid"
        borderColor="gray.300"
        borderRadius="3xl"
      >
        <ModalHeader color={colorMode === "dark" ? "white" : "black"} px={4} fontSize="lg" fontWeight="medium">
          Account
        </ModalHeader>
        <ModalCloseButton
          color={colorMode === "dark" ? "white" : "black"}
          fontSize="sm"
          _hover={{
            color: "gray.600",
          }}
        />

        {AccountInfo.isConnected ? (
        <ModalBody pt={0} px={4}>
          <Box
            borderRadius="3xl"
            border="0.06rem"
            borderStyle="solid"
            borderColor="gray.300"
            px={5}
            pt={4}
            pb={2}
            mb={3}
          >
            <Flex justifyContent="space-between" alignItems="center" mb={3}>
              <Text color={colorMode === "dark" ? "rgb(180,180,180)" : "gray"} fontSize="sm">
              Connected with Contract Account
              </Text>
              <Button
                variant="outline"
                size="sm"
                borderRadius="3xl"
                fontSize="0.81rem"
                fontWeight="normal"
                borderColor="rgb(236, 236, 236)"
                color="rgb(30, 114, 32)"
                px={2}
                h="1.62rem"
                _hover={{
                  background: "none",
                  borderColor: "rgb(56, 165, 58)",
                  textDecoration: "underline",
                }}
                onClick={handleDeactivateAccount}>
                Change
              </Button>
            </Flex>

            <Flex alignItems="center" mt={2} mb={4} lineHeight={1}>
              <Identicon />
              <Text
                color={colorMode === "dark" ? "white" : "black"}
                fontSize="xl"
                fontWeight="semibold"
                ml="2"
                lineHeight="1.1">
                 {
                   `${AccountInfo.AccAddress.slice(0, 6)}...${AccountInfo.AccAddress.slice(
                    AccountInfo.AccAddress.length - 4,
                    AccountInfo.AccAddress.length
                    )}`
                  } 
              </Text>
            </Flex>
            <Flex alignContent="center" m={3}>
              <Button
                variant="link"
                color={colorMode === "dark" ? "rgb(180,180,180)" : "gray"}
                fontWeight="normal"
                fontSize="0.825rem"
                onClick={() => {navigator.clipboard.writeText(
                  (AccountInfo.AccAddress || ""))}}
                _hover={{
                  textDecoration: "none",
                  color: "rgb(110, 114, 125)",
                }}>
                <CopyIcon mr={1} />
                Copy Address
              </Button>
              <Link
                fontSize="0.825rem;"
                d="flex"
                alignItems="center"
                href={`https://zksync2-testnet.zkscan.io/address/${account}`}
                isExternal
                color="rgb(110, 114, 125)"
                ml={6}
                _hover={{
                  color: "rgb(110, 114, 125)",
                  textDecoration: "underline",
                }}>
                <ExternalLinkIcon mr={1} />
                View on Explorer
              </Link>
            </Flex>
          </Box>
        </ModalBody>

        ) : (
        
        <ModalBody
          justifyContent="flex-start"
          bg= {colorMode === "dark" ? "black" : "white"}
          borderBottomLeftRadius="3xl"
          borderBottomRightRadius="3xl"
          //p={6}
        >
        <Box
            borderRadius="3xl"
            border="0.06rem"
            borderStyle="solid"
            borderColor="gray.300"
            px={5}
            pt={4}
            pb={2}
            mb={5}
          >
          <VStack  align='stretch' spacing={3} mb={3} >
        <Button
                variant="outline"
                size="medium"
                borderRadius="3xl"
                fontSize="1.0rem"
                fontWeight="normal"
                borderColor="rgb(236, 236, 236)"
                color="rgb(30, 114, 32)"
                px={58}
                py={4}
                h="1.62rem"
                _hover={{
                  background: "none",
                  borderColor: "rgb(56, 165, 58)",
                  textDecoration: "underline",
                }}
                onClick={async function()  {
                  setAccountInfo(
                    {isConnected: !isConnected})
                }} >
                 Login with Wallet Address
          </Button>
          <Input
          placeholder="0xYZ12...789"
          fontSize="md"
          width="100%"
          size="50rem"
          textAlign="center"
          borderColor="rgb(236, 236, 236)"
          focusBorderColor="blue"
          borderWidth= "1px"
          type="string"
          color={colorMode === "dark" ? "white" : "black"}
          
          onChange={async function (e) {

            if (
              e.target.value !== undefined 
              && !isConnected
            ) {
              setAccountInfo({AccAddress: e.target.value});
            } else {
            }
          }}
          />
          <Box
            alignSelf={"center"}
            // borderRadius="3xl"
            // border="0.06rem"
            // borderStyle="solid"
            // borderColor="gray.300"
            px={5}
            //pt={4}
            pb={2}
            mb={5}
          >

            <Text align={"center"} fontSize={15} py={3} pb={5} > or
             </Text>

            {/* <Text align={"center"} fontSize={15} py={3} color={"red"}> Don't have wallet?
             </Text> */}
          <Button
          onClick={async function()  {
              const timeOutId = setTimeout(async () => {
                  const result = await _deployAccount();
                  setAccountInfo({
                    AccAddress: result[0],
                    isConnected: true,
                    WebAuthnInfo: {
                      pubkey: result[1],
                      authenticatorData: result[2],
                      clientData: result[3]
                    }
                  })

                  if (result[0] != "") {
                    closeModal()
                  } 
              }, 300);
              return () => clearTimeout(timeOutId);
          }}
           >
            Create your wallet
          </Button>
          </Box>
          </VStack>
          </Box>
        </ModalBody>
        )};
      </ModalContent>
    </Modal>
    )}
