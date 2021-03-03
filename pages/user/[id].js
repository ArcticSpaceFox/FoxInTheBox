import { Flex, Box, Heading, Code, Image } from '@chakra-ui/react'
import Navbar from '../../components/navbar'

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
      destination: '/',
    }
  }

  const id = Number(context.params.id);
  if (!id) return {
    notFound: true,
  }

  const userData = await prisma.user.findUnique({
    where: {
      id: id,
    },
    select: {
      name: true,
      image: true,
      email: true,
      challenges: true,
      bloods: true,
    }
  })

  console.log(userData);

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

const UserPage = ({userData}) => {
  return (
    <Box>
      <Navbar />
      <Flex minH='100%'>
        <Box m={6} w='full'>
          <Heading>{userData.name}</Heading>
          <Image src={userData.image.replace('.gif','')}/>
          <Code>{JSON.stringify(userData, null, 2)}</Code>
        </Box>
      </Flex>
    </Box>
  )
}

export default UserPage
