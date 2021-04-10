import {
  Flex, Box, Heading, FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Spinner,
  InputGroup,
  InputLeftElement,
  Icon,
  Code,
  Divider,
  Stack,
  Select,
  Text,
  Button,
  Spacer,
  useColorMode,
} from '@chakra-ui/react'
import { FiFolder, FiHash, FiFile, FiFlag, FiAward, FiX, FiCheckCircle } from "react-icons/fi";
import Navbar from '../../../components/navbar'
import FileUpload from "../../../components/fileupload";

import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { getSession, useSession } from 'next-auth/client';
import prisma from "../../../lib/prisma";
import { useEffect } from "react";

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
    select: {
      id: true,
      name: true,
      editors: {
        select: {
          id: true,
        }
      },
    }
  })

  if (!compData) return {
    props: {},
    notFound: true,
  }

  if (!compData.editors.map(e=>e.id).includes(id)) {
    return {
      props: {
        notEditor: true,
      },
    }
  }

  return {
    props: {
      compData: compData
    }, // will be passed to the page component as props
  }
}

const BoxPage = ({ compData, notEditor }) => {
  const [session, loading] = useSession();
  const { colorMode } = useColorMode();

  if (!loading && !session) return signIn();

  if (loading) return (
    <Box>
      <Navbar />
      <Flex minH='80vh' align='center' justifyContent='center'>
        <Spinner size='lg' />
      </Flex>
    </Box>
  );

  if (notEditor) return (
    <Box>
      <Navbar />
      <Flex minH='80vh' align='center' justifyContent='center'>
        <Text fontSize='2xl'>Not an editor for this competition</Text>
      </Flex>
    </Box>
  );

  return (
    <Box>
      <Navbar />
      <Flex minH='100%' align='center' justifyContent='center'>
        <Box m={6} w='xl' shadow='2xl' border='1px' borderColor={colorMode === 'light' ? 'gray.200' : 'gray.700'} p={6} borderRadius={6}>
          <Heading>Create a new Box</Heading>
          <Divider mt={4} mb={4} />
          <BoxCreateForm comp={compData} />
        </Box>
      </Flex>
    </Box>
  )
}

const BoxCreateForm = ({ comp }) => {
  const { register, handleSubmit, control, getValues, formState, setValue, reset, errors, watch } = useForm();
  const Router = useRouter();

  useEffect(() => {
    setValue('competition', comp.name);
  }, [])

  function onSubmit(values) {
    return new Promise(resolve => {
      setTimeout(() => {
        alert(JSON.stringify(values, null, 2));
        console.log(values);
        reset();
        Router.push('/user')
        resolve();
      }, 3000);
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>

      <Stack spacing={3}>

        <FormControl isInvalid={errors.name} isRequired>
          <FormLabel htmlFor="name">Box name</FormLabel>
          <InputGroup>
            <InputLeftElement
              pointerEvents="none"
              children={<Icon as={FiHash} />}
            />
            <Input
              name="name"
              placeholder="My cool box name..."
              ref={register({})}
            />
          </InputGroup>
          <FormErrorMessage>
            {errors.name && errors.name.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={errors.flag} isRequired>
          <FormLabel htmlFor="flag">Winner flag</FormLabel>
          <InputGroup>
            <InputLeftElement
              pointerEvents="none"
              children={<Icon as={FiFlag} />}
            />
            <Input
              name="flag"
              placeholder="FIB{<your flag name goes here>}"
              ref={register({})}
            />
          </InputGroup>
          <FormErrorMessage>
            {errors.flag && errors.flag.message}
          </FormErrorMessage>
        </FormControl>

        <FileUpload name="compFiles" label="Your competition files..." acceptedFileTypes=".zip" control={control}>
          The files for the box in a <Code>.zip</Code> format
        </FileUpload>

        <FileUpload name="writeUpFile" label="Your writeup ..." acceptedFileTypes=".md" control={control}>
          A detailed writeup in the <Code>.md</Code> format
        </FileUpload>

        <FormControl isInvalid={errors.category}>
          <FormLabel htmlFor="category">The category of your challenge</FormLabel>
          <Select name="category" placeholder="Select category..." ref={register({})}>
            <option value="CRYPTO">Crypto</option>
            <option value="MISC">Misc</option>
            <option value="REVERSING">Reversing</option>
            <option value="FORENSICS">Forensics</option>
            <option value="PWNING">Pwning</option>
            <option value="WEB">Web</option>
            <option value="CODING">Coding</option>
            <option value="MYSTERY">Mystery (doesn't fit in any category)</option>
          </Select>
          <FormErrorMessage>
            {errors.category && errors.category.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={errors.difficulty} isRequired>
          <FormLabel htmlFor="difficulty">Who is this challenge best fit for?</FormLabel>
          <Select name="difficulty" placeholder="Select difficulty..." ref={register({})}>
            <option value="BEGINNER">Beginners</option>
            <option value="MEDIOCRE">Intermediates</option>
            <option value="EXPERT">Experts</option>
          </Select>
          <FormErrorMessage>
            {errors.difficulty && errors.difficulty.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={errors.competition}>
          <FormLabel htmlFor="competition">Does this challenge belong to a certain competition?</FormLabel>
          <InputGroup>
            <InputLeftElement
              pointerEvents="none"
              children={<Icon as={FiAward} />}
            />
            <Input
              name="competition"
              placeholder="What competition should we link this to?"
              disabled={true}
              ref={register({})}
            />
          </InputGroup>
          <FormErrorMessage>
            {errors.competition && errors.competition.message}
          </FormErrorMessage>
        </FormControl>
      </Stack>

      <Divider mt={2} mb={2} />

      <Flex w='full'>
        <Button onClick={() => Router.push('/user')} colorScheme='gray' leftIcon={<Icon as={FiX} />} disabled={formState.isSubmitting}>
          Cancel
        </Button>
        <Spacer />
        <Button type='submit' fontWeight='bold' colorScheme='blue' leftIcon={<Icon as={FiCheckCircle} />} isLoading={formState.isSubmitting}>
          Submit for review
        </Button>
      </Flex>

    </form>
  );
}



export default BoxPage;
