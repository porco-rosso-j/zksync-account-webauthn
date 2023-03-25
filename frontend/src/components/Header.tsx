import {  useEffect, useState } from "react";
import {
  Flex,
  Menu,
  useColorMode,
  VStack,
  useDisclosure,
  Spacer,
  useMediaQuery
} from "@chakra-ui/react";

import {IoBulb,IoBulbOutline} from "react-icons/io5";


// 
export default function Layout() {
  const { colorMode, toggleColorMode } = useColorMode();
  const [isDarkMode, setIsDarkMode] = useState(colorMode === "dark");



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
      </Flex>
    </Menu>
  );
}
