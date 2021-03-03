import { Stack, Code, Flex } from "@chakra-ui/react";
import Navbar from "../../components/navbar";

import { getSession } from 'next-auth/client';
import prisma from "../../lib/prisma";

import NothinHereToSee from '../../components/nothinheretosee';

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

  const compData = await prisma.box.findMany({});

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

export default function ShowPage({ compData }) {
  console.dir(compData);
  return (
    <Stack h='100vh'>
      <Navbar />
      <Flex h='100%' align='center' justifyContent='center'>
        {compData.length == 0 ? <NothinHereToSee text={"No competitions available"} /> : <Text>cool competitions</Text>}
      </Flex>
    </Stack>
  )
}