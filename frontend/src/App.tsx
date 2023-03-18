import { useState } from "react";
import { ChakraProvider, useDisclosure } from "@chakra-ui/react";
import theme from "./theme";
import Header from "./components/Header";
import AccountModal from "./components/Modal/AccountModal";
import Account from "./components/Account";
import "@fontsource/inter";
import "./global.css";
import {AccountInfo, AccountInfoNull} from "./common/interfaces/AccountInterface"

function App() {

  const  { isOpen, onClose } = useDisclosure();

  // const [AccAddress, setAccAddress] = useState<string>("");
  // const [isConnected, setIsConnected] = useState<boolean>(false);

  const [AccountInfo, setAccountInfo] = useState<AccountInfo>(AccountInfoNull);

  return (
    <ChakraProvider theme={theme}>
     
      <Header 
      AccountInfo={AccountInfo}
      setAccountInfo={setAccountInfo}
      // setAccAddress={setAccAddress} 
      // AccAddress={AccAddress}
      // isConnected={isConnected} 
      // setIsConnected={setIsConnected}  
      /> 

      {/* <AccountModal 
      isOpen={isOpen} 
      onClose={onClose}
      //AccountInfo={AccountInfo}
      
      // setAccAddress={setAccAddress} 
      // AccAddress={AccAddress}
      // isConnected={isConnected} 
      // setIsConnected={setIsConnected} 
      /> */}
      <Account
      AccountInfo={AccountInfo}
      setAccountInfo={setAccountInfo}
      // isConnected={isConnected} 
      // AccAddress={AccAddress}
      />
    </ChakraProvider>
  );
}

export default App;
