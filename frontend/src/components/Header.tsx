import { ReactNode, useEffect, useState } from "react";
import {
  Flex,
  Menu,
  useColorMode,
  VStack,
  useDisclosure,
  Spacer,
  useMediaQuery
} from "@chakra-ui/react";

import AccountModal from "./Modal/AccountModal";
import {AccountInfo} from "../scripts/interfaces/AccountInterface" ;
import {IoBulb,IoBulbOutline} from "react-icons/io5";

type Props = {
  children?: ReactNode;
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



  useEffect(() => setIsDarkMode(colorMode === "dark"), [colorMode]);

  return (
    
    <Menu>
      <Flex alignItems="center" mx="1.5rem" mt="1.5rem">
        <Spacer />
        <VStack spacing={2}>
          <IoBulb
            size="30px"
            onClick={toggleColorMode}
            color={isDarkMode ? "white" : "black"}
          >
          </IoBulb>
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
