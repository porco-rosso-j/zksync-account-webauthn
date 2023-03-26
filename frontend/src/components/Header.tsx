import {  useEffect, useState } from "react";
import {
  Flex,
  Menu,
  useColorMode,
  VStack,
  Spacer,
  Image,Text
} from "@chakra-ui/react";
import logo from '../assets/logo.svg';

import {IoBulb} from "react-icons/io5";


// 
export default function Layout() {
  const { colorMode, toggleColorMode } = useColorMode();
  const [isDarkMode, setIsDarkMode] = useState(colorMode === "dark");



  useEffect(() => setIsDarkMode(colorMode === "dark"), [colorMode]);

  return (
    
    <Menu>
      <Flex alignItems="center" mx="1.5rem" mt="1.5rem">
      <Image src={logo} alt={'logo'} w={"70px"} h={"70px"} />
      <Text>
      Bye Bye Private Key
      </Text>
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
