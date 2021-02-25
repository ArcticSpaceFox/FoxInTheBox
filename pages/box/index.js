import { Stack, Code, Flex } from "@chakra-ui/react";
import Navbar from "../../components/navbar";

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

  const boxesData = await prisma.challenge.findMany({
    where: {
      public: true
    }
  });

  if (!boxesData) return {
    props: {},
    notFound: true,
  }

  return {
    props: {
      boxesData: boxesData
    }, // will be passed to the page component as props
  }
}

export default function ShowPage({ boxesData }) {
  console.dir(boxesData);
  return (
    <Stack h='100vh'>
      <Navbar />
      <Flex h='100%'>
        <Code>{boxesData || "LOADING"}</Code>
      </Flex>
    </Stack>
  )
}