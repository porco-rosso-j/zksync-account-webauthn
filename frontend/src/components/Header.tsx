import { ReactNode, useEffect, useState } from "react";
import {
  Flex,
  Menu,
  Image,
  useColorMode,
  VStack,
  useDisclosure,
  Switch,
  Spacer,
  useMediaQuery
} from "@chakra-ui/react";

import AccountModal from "./Modal/AccountModal";
import ConnectButton from "./ConnectButton";
import {AccountInfo} from "../common/interfaces/AccountInterface"

type Props = {
  children?: ReactNode;
  // AccAddress: string;
  // setAccAddress: any
  // isConnected: boolean
  // setIsConnected: any
  AccountInfo: AccountInfo;
  setAccountInfo: any;
};

// 
export default function Layout({ children, AccountInfo, setAccountInfo }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const [isDarkMode, setIsDarkMode] = useState(colorMode === "dark");
  const [isScreenFullWidth] = useMediaQuery("(min-width: 435px)");
  const [isScreenMediumWidth] = useMediaQuery("(min-width: 400px)");
  const [isScreenSmallWidth] = useMediaQuery("(min-width: 380px)");

  function getFontSize() {
    return isScreenFullWidth ? "md" : "sm";
  }

  function getLogoSize() {
    if (isScreenFullWidth) {
      return "8rem";
    } else if (isScreenMediumWidth) {
      return "7rem";
    } else if (isScreenSmallWidth) {
      return "6rem";
    }
    return "5rem";
  }

  useEffect(() => setIsDarkMode(colorMode === "dark"), [colorMode]);

  return (
    
    <Menu>
      <Flex alignItems="center" mx="1.5rem" mt="1.5rem">
        <Spacer />
        <VStack spacing={4}>
          <Switch
            colorScheme="green"
            onChange={toggleColorMode}
            isChecked={isDarkMode}
            fontSize={getFontSize()}
            fontWeight="400"
            color={isDarkMode ? "white" : "black"}
          >
            Switch to {isDarkMode ? "light" : "dark"} mode
          </Switch>
          <ConnectButton
            handleOpenModal={onOpen} 
            fontSize={getFontSize()} 
            AccountInfo={AccountInfo}
             />

        </VStack>

        <AccountModal 
        isOpen={isOpen}
        onClose={onClose}
        AccountInfo={AccountInfo}
        setAccountInfo={setAccountInfo}
        />
      </Flex>
    </Menu>
  );
}
