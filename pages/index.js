import { Box, Button, Fade, Flex, Heading, Link, LinkBox, Stack, Text } from "@chakra-ui/react";
import Navbar from "../components/navbar";
import { Link as ReachLink } from 'next/link';
import { useEffect, useState } from 'react';

import { signIn, signOut, useSession } from 'next-auth/client';

export default function Home() {
  const [fadeTrigger, setFadeTrigger] = useState(false);

  useEffect(() => {
    setTimeout(() => setFadeTrigger(true), 600)
  }, [])

  return (
    <Box w='full'>
      <Stack h='100vh'>
        <Box shadow='sm'>
          <Navbar />
        </Box>
        <Flex h='100%' align='center' justifyContent='center'>
          <Box textAlign='center'>
            <Fade in={true}>
              <Heading mb={2} size='4xl' textShadow='md'>
                FoxInTheBox
              </Heading>
            </Fade>
            <Fade in={fadeTrigger}>
              <Text fontSize='2xl'>Cool riddles and fun challenges</Text>

              <Button mt={6} onClick={signIn} colorScheme='blue'>START NOW</Button>
            </Fade>
          </Box>
        </Flex>
      </Stack>
    </Box>
  );
}
