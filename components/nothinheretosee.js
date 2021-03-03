import { Box, Icon, Text } from "@chakra-ui/react";
import { FiCoffee } from "react-icons/fi";

const NothinHereToSee = ({text}) => {
  return (
    <Box textAlign='center'>
      <Icon boxSize={16} as={FiCoffee} />
      <Text mt={2} fontSize='xl' colorScheme='gray'>{text || "Nothin to see here"}</Text>
    </Box>
  )
}

export default NothinHereToSee
