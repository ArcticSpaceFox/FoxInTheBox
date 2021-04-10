import { Stack, Text, Flex, Box, Heading, Divider, useColorMode, HStack, Icon, Spacer, Badge } from "@chakra-ui/react";
import Navbar from "../../components/navbar";
import { FiCoffee, FiAward, FiChevronRight } from "react-icons/fi";

import Link from "next/link";

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

  const compData = await prisma.competition.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      prizes: true,
      challenges: {
        select: {
          id: true,
          name: true,
          description: true
        },
      },
    }
  });

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
  return (
    <Stack h='100vh'>
      <Navbar />
      <Flex h='100%' align='center' justifyContent='center'>
        {compData.length == 0 ? <NothinHereToSee text={"No competitions available"} /> : <BoxTableView  competitions={compData} />}
      </Flex>
    </Stack>
  )
}

const BoxTableView = ({ competitions }) => {
  return (
    <Box minW='4xl' shadow='lg' p={2} borderColor='gray' border='1px' borderRadius={6} overflow='hidden'>
      <Box m={2}>
        <Heading>All current Competitions</Heading>
      </Box>
      <Divider />
      {
        competitions.map(box => (<BoxItemView key={box.id} box={box} />))
      }
    </Box>
  )
}

const BoxItemView = ({ box }) => {
  const { colorMode } = useColorMode();

  return (
    <Link href={`/competition/${box.id}`}>
      <Box _hover={{ backgroundColor: colorMode === 'dark' ? 'gray.700' : 'gray.200' }}>
        <Flex m={2}>
          <HStack>
            <Icon as={FiAward} />
            <Text fontWeight='bold'>{box.name}</Text>
            <Text colorScheme='gray' maxW='sm' noOfLines={1} textOverflow='ellipsis'>{box.description}</Text>
          </HStack>
          <Spacer />
          <HStack>
            <Badge colorScheme="yellow">{box.prizes} Prizes</Badge>
            <Badge
              colorScheme="cyan"
            >
              {box.challenges.length} Boxes
            </Badge>
            <Icon as={FiChevronRight} />
          </HStack>
        </Flex>
      </Box>
    </Link>
  )
}