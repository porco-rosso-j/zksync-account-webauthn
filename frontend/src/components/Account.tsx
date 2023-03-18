import {  useRef } from "react";
import {
  Flex,
  Box,
  Button,
  Input,
  useDisclosure,
  Text,
  useColorMode,
  VStack,
  useMediaQuery,
} from "@chakra-ui/react";
import {AccountInfo} from "../common/interfaces/AccountInterface"
import {
  useEthers,
  useEtherBalance,
} from "@usedapp/core";

type Props = {
  AccountInfo: AccountInfo
  setAccountInfo: any
};

export default function Account({AccountInfo} : Props) {
  const AccAddress = AccountInfo.AccAddress
  const isConnected = AccountInfo.isConnected

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { chainId } = useEthers();
  const { colorMode } = useColorMode();
  const etherBalance = useEtherBalance((isConnected ? AccAddress: ""));
  const [isScreenFullWidth] = useMediaQuery("(min-width: 475px)");

  return isConnected ? (
    <Box
      w={isScreenFullWidth ? "475px" : "calc(98vw)"}
      mx="auto"
      mt="3.5rem"
      mb="1.5rem"
      boxShadow="rgb(0 0 0 / 8%) 0rem 0.37rem 0.62rem"
      borderRadius="1.37rem"
    >

      <Flex
        alignItems="center"
        p="1rem 1.25rem 0rem"
        bg={colorMode === "dark" ? "#1e1e1e" : "white"}
        justifyContent="space-between"
        borderRadius="1.37rem 1.37rem 0 0"
      >
      </Flex>

      <Box
        p="0.5rem"
        bg={colorMode === "dark" ? "#1e1e1e" : "white"}
        borderRadius="0 0 1.37rem 1.37rem"
      >
        <Text textAlign={"center"} color={colorMode === "dark" ? "white" : "black"} fontSize={25} fontWeight="500">
          Account 
        </Text>
      { isConnected && (
           <VStack
             align="left"
             spacing={0.1}
             fontSize={14} 
             py={2} 
             px={5}
             borderColor="black"
             borderRadius="3"
             >
              <Box color={colorMode === "dark" ? "white" : "black"} fontSize={15} >
              [Account Data]
              </Box>
              <Box color={colorMode === "dark" ? "white" : "black"}>
              - address: {isConnected ? AccAddress : ""}
              </Box>
              <Box color={colorMode === "dark" ? "white" : "black"}>
              - balance: {etherBalance ? etherBalance : 0}  ETH
              </Box>
              <Box color={colorMode === "dark" ? "white" : "black"} fontSize={15} pt={2}>
              [WebAuthn Data] 
              </Box>
              <Box color={colorMode === "dark" ? "white" : "black"} fontSize={12} >
              - PublicKey: {AccountInfo.WebAuthnInfo.pubkey}
              </Box>
              <Box color={colorMode === "dark" ? "white" : "black"} fontSize={12}>
              - authenticatorData:  {AccountInfo.WebAuthnInfo.authenticatorData}
              </Box>
            <Box color={colorMode === "dark" ? "white" : "black"} fontSize={12}>
              - clientData:  {AccountInfo.WebAuthnInfo.clientData}
              </Box>
            <Box color={colorMode === "dark" ? "white" : "black"} fontSize={12}>
              - signature:
            </Box>
            {/* credentialId */}
           </VStack>
          )}
          
          
          <Box
            borderRadius="3xl"
            border="0.06rem"
            borderStyle="solid"
            borderColor="gray.300"
            mt={3}
            px={5}
            pt={4}
            pb={2}
            mb={5}
          >
           <VStack alignItems={"center"}  align='stretch' spacing={3} mb={3} >
        <Button
                //variant="outline"
                size="small"
                // borderRadius="3xl"
                fontSize="0.8rem"
                fontWeight="normal"
               // borderColor="rgb(236, 236, 236)"
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
                 // setIsConnected({isConnected: !isConnected})
                }} >
                 Get faucet ETH
          </Button>
          <Input
          placeholder="0.0"
          fontSize="md"
          width="40%"
          size="30rem"
          textAlign="center"
          //borderColor="rgb(236, 236, 236)"
          focusBorderColor="blue"
          //borderWidth= "1px"
          type="number"
          color={colorMode === "dark" ? "white" : "black"}
          onChange={async function (e) {
            if (
              e.target.value !== undefined 
              && !isConnected
            ) {
              //setAccAddress(e.target.value);
            } else {
            }
          }}
          />
         </VStack>

        </Box>
      </Box>


    </Box>
  ) : <Text align={"center"}>
    Connect your wallet!
  </Text> ;
}
