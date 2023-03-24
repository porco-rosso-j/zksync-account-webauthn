import { useEffect, useRef, useState } from "react";
import {
  Flex,
  Box,
  Button,
  Input,
  useDisclosure,
  Text,
  useColorMode,
  VStack,
  useMediaQuery,Center,
} from "@chakra-ui/react";
import {AccountInfo} from "../scripts/interfaces/AccountInterface"
import {_faucet} from "../scripts/faucet"
import {
  useEthers,
} from "@usedapp/core";
import { Provider } from 'zksync-web3';
import ConnectButton from "./ConnectButton";
import {getFontSize} from "../scripts/utils/lib";

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
  const [etherBalance, setEtherBalance] = useState<number>(0)
  const [isScreenFullWidth] = useMediaQuery("(min-width: 475px)");

  const [faucetAmount, setFaucetAmt] = useState<number>(0)

  const provider = new Provider("http://localhost:3050", 270);

  useEffect(() => {
    const timeOutId = setTimeout(async () => {
      console.log("isConnected: ", isConnected)
      if (isConnected) {
        let rawQuote = await provider.getBalance(AccAddress);
        let balance = Number(rawQuote) / 10 ** 18;
        console.log("rawQuote: ", rawQuote)
        setEtherBalance(balance);
      }
    }, 300);
    return () => clearTimeout(timeOutId);
  }, []);

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
              {console.log("chainId:" , chainId)}
                {console.log("isConnected:" , isConnected)}
                {console.log("AccAddress:" , AccAddress)}
              - address: {isConnected ? AccAddress : ""}
              </Box>
              <Box color={colorMode === "dark" ? "white" : "black"}>
              - balance: {etherBalance ? etherBalance : 0}  ETH
              </Box>
              {/* <Box color={colorMode === "dark" ? "white" : "black"} fontSize={15} pt={2}>
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
              - signature: {AccountInfo.WebAuthnInfo.signature}
            </Box>
            credentialId */}
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
                  console.log("faucetAmount: ", faucetAmount)
                   faucetAmount ? await _faucet(
                    AccountInfo.AccAddress,
                    faucetAmount,
                    AccountInfo.WebAuthnInfo
                  ) : console.log("number not set") ;

                  const rawQuote = await provider.getBalance(AccAddress);
                  console.log("rawQuote: ", rawQuote)
                  let balance = Number(rawQuote) / 10 ** 18;
                  setEtherBalance(balance);
                }} >
                 Get faucet ETH
          </Button>
          <Input
          placeholder="0.0"
          fontSize="md"
          width="40%"
          size="30rem"
          textAlign="center"
          focusBorderColor="blue"
          type= "number"
          color={colorMode === "dark" ? "white" : "black"}
          onChange={async function (e) {
            if (
              e.target.value !== undefined 
              && isConnected
            ) {
               setFaucetAmt(Number(e.target.value));
            } else {
            }
          }}
          />
         </VStack>
        </Box>
      </Box>
    </Box>
  ) :
  ( <Box mt={"150px"}>
      <Center >
          <Text fontSize={25} pt={100}>
            Sign Ethereum transactions with your fingerprint.  No private key needed.
          </Text>
      </Center>
      <Center>
          <ConnectButton
                        handleOpenModal={onOpen}
                        fontSize={getFontSize(isScreenFullWidth)}
                        AccountInfo={AccountInfo}
              />
      </Center>
    </Box>

    )
   ;
}
