import { Stack, Icon, Text, Flex, Box, HStack, Spacer, Divider, Badge, Heading, useColorMode } from "@chakra-ui/react";
import Navbar from "../../components/navbar";

import { FiCoffee, FiBox, FiChevronRight } from "react-icons/fi";

import { getSession } from 'next-auth/client';
import prisma from "../../lib/prisma";
import Link from "next/link";
import NothinHereToSee from "../../components/nothinheretosee";

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

  const boxesData = await prisma.box.findMany({
    where: {
      reviewed: true,
      public: true,
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
  return (
    <Stack h='100vh'>
      <Navbar />
      <Flex h='100%' align='center' justifyContent='center'>
        <BoxTableView boxes={
          boxesData
        } />
      </Flex>
    </Stack>
  )
}

const BoxTableView = ({ boxes }) => {
  if (boxes.length == 0) {
    return <NothinHereToSee text={"No boxes available yet"}/>;
  }

  return (
    <Box minW='4xl' shadow='lg' p={2} borderColor='gray' border='1px' borderRadius={6} overflow='hidden'>
      <Box m={2}>
        <Heading>All boxes</Heading>
      </Box>
      <Divider />
      {
        boxes.map(box => (<BoxItemView key={box.id} box={box} />))
      }
    </Box>
  )
}

const BoxItemView = ({ box }) => {
  const { colorMode } = useColorMode();

  return (
    <Link href={`/box/${box.id}`}>
      <Box _hover={{ backgroundColor: colorMode === 'dark' ? 'gray.700' : 'gray.200' }}>
        <Flex m={2}>
          <HStack>
            <Icon as={FiBox} />
            <Text fontWeight='bold'>{box.name}</Text>
            <Text colorScheme='gray' maxW='sm' noOfLines={1} textOverflow='ellipsis'>{box.description}</Text>
          </HStack>
          <Spacer />
          <HStack>
            <Badge colorScheme={
              {
                "CRYPTO": "yellow",
                "MISC": "linkedin",
                "REVERSING": "pink",
                "FORENSICS": "blue",
                "PWNING": "green",
                "WEB": "cyan",
                "CODING": "gray",
                "MYSTERY": "purple"
              }[box.category]
            }>{box.category}</Badge>
            <Badge
              colorScheme={
                {
                  "EASY": "green",
                  "MEDIOCRE": "orange",
                  "EXPERT": "red"
                }[box.difficulty]}
            >
              {box.difficulty}
            </Badge>
            <Icon as={FiChevronRight} />
          </HStack>
        </Flex>
      </Box>
    </Link>
  )
}
