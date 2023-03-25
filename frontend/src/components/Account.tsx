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
  HStack,
  useMediaQuery,
} from "@chakra-ui/react";
import {AccountInfo} from "../scripts/interfaces/AccountInterface"
import { _faucet, _transferETH, _enabledLocation} from "../scripts/methods"
import { Provider } from 'zksync-web3';

type Props = {
  AccountInfo: AccountInfo
  setAccountInfo: any
};

export default function Account({AccountInfo} : Props) {
  const AccAddress = AccountInfo.AccAddress
  const isConnected = AccountInfo.isConnected

  // const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode } = useColorMode();
  const [etherBalance, setEtherBalance] = useState<number>(0)
  const [etherBalance2, setEtherBalance2] = useState<number>(0)
  const [isScreenFullWidth] = useMediaQuery("(min-width: 475px)");

  const [faucetAmount, setFaucetAmt] = useState<number>(0)
  const [transferAmount, setTransferAmount] = useState<number>(0)
  const [recepient, setRecepient] = useState<string>("")

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

  useEffect(() => {
    const timeOutId = setTimeout(async () => {
      console.log("isConnected: ", isConnected)
      if (isConnected && recepient) {
        let rawQuote = await provider.getBalance(recepient);
        let balance = Number(rawQuote) / 10 ** 18;
        console.log("rawQuote: ", rawQuote)
        setEtherBalance2(balance);
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
                {console.log("isConnected:" , isConnected)}
                {console.log("AccAddress:" , AccAddress)}
              - address: {isConnected ? AccAddress : ""}
              </Box>
              <Box color={colorMode === "dark" ? "white" : "black"}>
              - balance: {etherBalance ? etherBalance : 0}  ETH
              </Box>
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
                size="small"
                fontSize="0.8rem"
                fontWeight="normal"
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
                  recepient && transferAmount  ? await _transferETH(
                    AccountInfo.AccAddress,
                    recepient,
                    transferAmount,
                    AccountInfo.WebAuthnInfo
                  ) : console.log("number not set") ;

                  const rawQuote = await provider.getBalance(AccAddress);
                  console.log("rawQuote: ", rawQuote)
                  let balance = Number(rawQuote) / 10 ** 18;
                  setEtherBalance(balance);
                }} >
                 Send ETH
          </Button>
          <HStack spacing={1} >
          <Text pl={20} pr={5}>Amount: </Text>
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
               setTransferAmount(Number(e.target.value));
            } else {
            }
          }}
          />
          </HStack>
          <HStack spacing={1} >
          <Text pl={20} pr={5}>Recepient: </Text>
          <Input
          placeholder="0x..."
          fontSize="md"
          width="40%"
          size="80rem"
          textAlign="center"
          focusBorderColor="blue"
          type= "string"
          color={colorMode === "dark" ? "white" : "black"}
          onChange={async function (e) {
            if (
              e.target.value !== undefined 
              && e.target.value !== ''
              && isConnected
            ) {
              console.log("type: ", typeof(e.target.value))
              setRecepient(e.target.value);
               const rawQuote = await provider.getBalance(e.target.value);
               console.log("rawQuote2: ", rawQuote)
               let balance = Number(rawQuote) / 10 ** 18;
               setEtherBalance2(balance);
            } else if (e.target.value === '') {
              setEtherBalance2(0)
            } else {
              console.log("smth wrong")
            }
          }}
          />
          </HStack>
          <Box color={colorMode === "dark" ? "white" : "black"}>
             Recepient ETH Balance: {etherBalance2 ? etherBalance2 : 0}  ETH
              </Box>
         </VStack>
        </Box>
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
            pl={110}
          >
         <Button
                size="small"
                fontSize="0.8rem"
                fontWeight="normal"
                color="rgb(30, 114, 32)"
                px={10}
                py={4}
                h="1.62rem"
                _hover={{
                  background: "none",
                  borderColor: "rgb(56, 165, 58)",
                  textDecoration: "underline",
                }}
                onClick={async function()  {
                  await _enabledLocation(
                    AccountInfo.AccAddress,
                    AccountInfo.WebAuthnInfo
                  )
                }} >
                 Enable Location Validation
          </Button>
            </Box>

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
            pl={110}
          >
         <Button
                size="small"
                fontSize="0.8rem"
                fontWeight="normal"
                color="rgb(30, 114, 32)"
                px={10}
                py={4}
                h="1.62rem"
                _hover={{
                  background: "none",
                  borderColor: "rgb(56, 165, 58)",
                  textDecoration: "underline",
                }}
                onClick={async function()  {
                  await _enabledLocation(
                    AccountInfo.AccAddress,
                    AccountInfo.WebAuthnInfo
                  )
                }} >
                 Update Coordinates
          </Button>
            </Box>
      </Box>

    </Box>
  ) : <Text align={"center"} fontSize={25} pt={100}>
    Sign Ethereum transactions with your fingerprint.  No private key needed.
  </Text> ;
}
