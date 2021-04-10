import { Flex, Box, Heading, FormErrorMessage, Divider, Text, useColorMode, HStack, Icon, Spacer, Stack, Button, Input, FormControl, FormLabel, InputGroup, InputLeftElement, InputRightElement } from '@chakra-ui/react'
import Navbar from '../../components/navbar'

import { getSession } from 'next-auth/client';
import prisma from "../../lib/prisma";
/* import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient(); */
import Router from 'next/router'
import { FiDroplet, FiUser, FiFlag } from 'react-icons/fi';
import Link from 'next/link';

import { useForm } from "react-hook-form";

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

  const boxData = await prisma.box.findUnique({
    where: {
      id: id,
    },
    include: {
      solves: {
        include: {
          user: {
            select: {
              name: true,
              id: true
            }
          }
        }
      }
    }
  })

  if (!boxData) return {
    props: {
      session: session
    },
    notFound: true,
  }

  boxData.flag = "Fitb{xxx}";
  boxData.createdAt = boxData.createdAt.toString();
  boxData.solves.map(solve => { solve.createdAt = solve.createdAt.toString() });

  return {
    props: {
      boxData: boxData,
      session: session,
    }, // will be passed to the page component as props
  }
}

const BoxPage = ({ boxData, session }) => {
  const { colorMode } = useColorMode();

  return (
    <Box>
      <Navbar />
      <Flex minH='100%'>
        <Box m={6} w='full'>
          <Heading fontSize={{ xl: '9xl', lg: '6xl' }}>{boxData.name}</Heading>
          <Text pl='2rem' fontSize='xl' color={colorMode == 'light' ? 'gray.700' : 'gray.400'}>{boxData.description}</Text>

          <Stack direction={['column', 'row']} p={6} w='100%'>
            <Box w='full' shadow='lg' p={2} borderColor='gray' border='1px' borderRadius={6} overflow='hidden'>

              <Heading fontSize='xl'>Files and Submit</Heading>
              <Divider />

              <Link href={'/uploads/' + boxData.id + ".zip"}>
                <Button mt={2} mb={2} colorScheme='blue'>Get Challenge Files</Button>
              </Link>

              <FlagSubmitForm box={boxData} solved={boxData.solves.filter(s => s.user.name === session.user.name).length != 0} />
            </Box>
            <Box minW='30%' shadow='lg' p={2} borderColor='gray' border='1px' borderRadius={6} overflow='hidden'>
              <Heading fontSize='xl'>Solves</Heading>
              <Divider />
              {boxData.solves.length > 0 ? boxData.solves.map(s => <UserItem solve={s} />) : <Text color={colorMode == 'light' ? 'gray.500' : 'gray.400'}>Sadly no solves yet</Text>}
            </Box>
          </Stack>
        </Box>
      </Flex>
    </Box>
  )
}

const UserItem = ({ solve }) => {
  const { colorMode } = useColorMode();

  return (
    <Box borderBottom='1px' borderColor={colorMode == 'light' ? 'gray.100' : 'gray.700'}>
      <Flex m={2}>
        <HStack>
          <Icon color={solve.isBlood ? 'red' : null} as={solve.isBlood ? FiDroplet : FiUser} />
          <Text fontWeight='bold'>{solve.user.name}</Text>
          {/* <Text colorScheme='gray' maxW='sm' noOfLines={1} textOverflow='ellipsis'>{box.description}</Text> */}
        </HStack>
        <Spacer />
        <HStack>
        </HStack>
      </Flex>
    </Box>
  )
}

const FlagSubmitForm = ({ box, solved }) => {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();
  const onSubmit = async (data) =>{
    console.log(data);
    if (!data.flag) return console.error("Flag has not been provided");
    const res = await fetch(
      '/api/flagSubmit',
      {
        credentials: 'same-origin',
        body: JSON.stringify({
          boxId: box.id,
          flag: data.flag,
        }),
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST'
      }
    );
    const result = await res.json();
    
    //if (result.status === "SUCCESS") return Router.reload(window.location.pathname);
    
    console.error(result);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack>
        <FormControl isInvalid={errors.flag} isRequired>
          <FormLabel htmlFor="flag">Flag goes here</FormLabel>
          <InputGroup>
            <InputLeftElement
              pointerEvents="none"
              children={<Icon as={FiFlag} />}
            />
            <Input
              name="flag"
              ref={register({required: true, pattern: /FitB\{[A-Za-z0-9_]+\}/i})}
              variant={solved ? 'filled' : 'outline'}
              isInvalid={errors.flag}
              isDisabled={solved}
              minW="40%"
              placeholder={solved ? "Solved: {FitB{xxx}}" : "Flags should look like this : FitB{xxx}"}
              borderColor={solved ? 'green' : null}/>
          </InputGroup>
          <FormErrorMessage>
            {errors.flag && errors.flag.message}
          </FormErrorMessage>
        </FormControl>
        <Button isDisabled={solved} isLoading={isSubmitting} type="submit" colorScheme="blue">Submit</Button>
      </Stack>
    </form>
  )
}

export default BoxPage
