import { Flex, Box, Heading } from '@chakra-ui/react'
import { useRouter } from 'next/router'
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

  const compData = await prisma.challenge.findUnique({
    where: {
      id: id,
    },
  })

  if (!compData) return {
    props: {},
    notFound: true,
  }

  return {
    props: {
      compData: compData
    }, // will be passed to the page component as props
  }
}

const CompetitionPage = ({compData}) => {
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
