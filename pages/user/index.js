import Navbar from "../../components/navbar";
import { Box, Divider, Flex, Heading, useColorMode, Text, Spacer, Badge, Image } from "@chakra-ui/react";

import { getSession } from 'next-auth/client';
import prisma from "../../lib/prisma";

/*
    For dynamic data on every request
*/
export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) return {
    props: {
      authError: true,
    },
    redirect: {
      destination: '/'
    }
  }

  const userData = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      bloods: true,
      image: true,
      name: true,
      role: true,
      solves: true,
    }
  })

  if (!userData) return {
    props: {},
    notFound: true,
  }

  return {
    props: {
      userData: userData
    }, // will be passed to the page component as props
  }
}

/*
    Home Page
*/
export default function Home({ userData, notFound, authError }) {
  return (
    <Box h='100vh'>
      <Box>
        <Navbar />
      </Box>
      <HomePageContent userData={userData} />
    </Box>
  )
}

// Content, will be loaded and then rendered
const HomePageContent = ({ userData }) => {
  const { colorMode } = useColorMode();

  return (
    <Flex minH='100%'>
      <Box m={6} w='full'>
        <Box>
          <Flex w='full'>
            <Heading>Welcome home, {userData.name || "Anon"} </Heading>
            <Spacer />
            <Box>
              <Badge
                variant='subtle'
                colorScheme={userData.role === 'ADMIN' ? 'green' : 'blue'}
              >
                {userData.role}
              </Badge>
            </Box>
          </Flex>
          <Divider />
        </Box>
        <Flex mt={6} w='full' minH='60%' justifyContent='center'>
          <Box
            minW='65%'
            p={4}
            border='1px'
            borderColor={colorMode === 'light' ? 'gray.200' : 'gray.700'}
            boxShadow='xl'
            borderRadius={6}
            minH={12}
          >
            <Flex>
              <HomePageProfileStats userData={userData} />
            </Flex>
          </Box>
        </Flex>
      </Box>
    </Flex>
  )
};

const HomePageProfileStats = ({ userData }) => {
  return (
    <Image
      src={userData.image.replace('.gif', '')}
      borderRadius="full"
    />
  )
}

