import { Flex, Box, Heading } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import Navbar from '../../components/navbar'

import { getSession } from 'next-auth/client';
import { PrismaClient } from '@prisma/client';

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

  const prisma = new PrismaClient();

  const boxData = await prisma.challenge.findUnique({
    where: {
      id: Number(context.params.id),
    },
  })

  if (!boxData) return {
    props: {},
    notFound: true,
  }

  return {
    props: {
      boxData: boxData
    }, // will be passed to the page component as props
  }
}

const CompetitionPage = () => {
  const router = useRouter()
  const { id } = router.query

  return (
    <Box>
      <Navbar />
      <Flex minH='100%'>
        <Box m={6} w='full'>
          <Heading>Competition #{id}</Heading>

        </Box>
      </Flex>
    </Box>
  )
}

export default CompetitionPage
