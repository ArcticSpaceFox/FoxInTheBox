import { Flex, Box, Heading, Divider, HStack, Badge, Text, Icon, useColorMode, Spacer } from '@chakra-ui/react'
import Navbar from '../../components/navbar'
import Link from "next/link";
import NothinHereToSee from "../../components/nothinheretosee";
import { FiCoffee, FiBox, FiChevronRight } from "react-icons/fi";

import { getSession } from 'next-auth/client';
import prisma from "../../lib/prisma";
/* import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient(); */

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

  const compData = await prisma.competition.findUnique({
    where: {
      id: id,
    },
    include: {
      challenges: true
    }
  })

  if (!compData) return {
    props: {},
    notFound: true,
  }

  compData.startTime = compData.startTime.toString();
  compData.endTime = compData.endTime.toString();
  compData.createdAt = compData.createdAt.toString();

  compData.challenges = compData.challenges.map(challenge => {challenge.createdAt = challenge.createdAt.toString(); return challenge;})

  return {
    props: {
      compData: compData
    }, // will be passed to the page component as props
  }
}

const CompetitionPage = ({ compData }) => {
  //console.log(compData);
  return (
    <Box>
      <Navbar />
      <Flex minH='100%' p={8}>
        <Box m={6} h='100%' w='full'>
          <HStack spacing={20}>
            <Heading pb={4}>{compData.name}</Heading>
            <Text fontSize='xl'>{compData.description}</Text>
          </HStack>
          <Divider />
          {new Date(compData.startTime) > new Date() ? (<Flex h='70vh' p={8} align='center' justifyContent='center'><NothinHereToSee text={"Challenge hasnt started yet"} /></Flex>) : <BoxTableView boxes={compData.challenges} />}
        </Box>
      </Flex>
    </Box>
  )
}

const BoxTableView = ({ boxes }) => {
  if (boxes.length == 0) {
    return <Flex h='70vh' p={8} align='center' justifyContent='center'>
      <NothinHereToSee text={"No boxes available yet"} />
    </Flex>;
  }

  //console.log(boxes);

  return (
    <Box minW='4xl' shadow='lg' p={2} borderColor='gray' border='1px' borderRadius={6} overflow='hidden'>
      <Box m={2}>
        <Heading fontSize='lg'>All boxes</Heading>
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


export default CompetitionPage
