import { useState } from "react";
import { ChakraProvider, useDisclosure } from "@chakra-ui/react";
import theme from "./theme";
import Header from "./components/Header";
import Account from "./components/Account";
import "@fontsource/inter";
import "./global.css";
import {AccountInfo, AccountInfoNull} from "./scripts/interfaces/AccountInterface"

function App() {

  const [AccountInfo, setAccountInfo] = useState<AccountInfo>(AccountInfoNull);

  return (
    <ChakraProvider theme={theme}>
     
      <Header/>

      <Account
      AccountInfo={AccountInfo}
      setAccountInfo={setAccountInfo}
      />
    </ChakraProvider>
  );
}

export default App;
