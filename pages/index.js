import { Box, Button, Fade, Flex, Heading, Link, LinkBox, Stack, Text } from "@chakra-ui/react";
import Navbar from "../components/navbar";
import { useEffect, useState } from 'react';

import { session, signIn, signOut, useSession } from 'next-auth/client';
import { useRouter } from 'next/router';

console.log(process.env.DATABASE_URL);

export default function Home() {
  const router = useRouter();
  const [fadeTrigger, setFadeTrigger] = useState(false);

  useEffect(() => {
    setTimeout(() => setFadeTrigger(true), 600)
  }, [])

  const handleClick = () => {
    router.push('/competition');
  }

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

              <Button mt={6} onClick={session ? handleClick : signIn} colorScheme='blue'>START NOW</Button>
            </Fade>
          </Box>
        </Flex>
      </Stack>
    </Box>
  );
}
