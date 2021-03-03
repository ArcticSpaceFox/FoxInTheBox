import { Badge, Box, Flex, Icon, Text } from "@chakra-ui/react";
import Navbar from "../components/navbar";
import { FiAnchor } from "react-icons/fi";

const FourOhFour = () => {
  return (
    <Box w='full' h='100vh'>
      <Navbar/>
      <Flex h='100%' align='center' justifyContent='center'>
        <Box textAlign='center'>
          <Icon boxSize='16' as={FiAnchor}/>
          <Text mt={2} fontSize='lg'><Badge colorScheme='red'>404</Badge> Sorry but that one doesnt exist</Text>
        </Box>
      </Flex>
    </Box>
  )
}

export default FourOhFour
