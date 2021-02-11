import Navbar from "../components/navbar";
import { Box, Container, Heading, Stack, Text, useColorMode } from "@chakra-ui/react";

export default function About() {
    const {colorMode} = useColorMode();

    return (
        <Box w='full'>
            <Stack spacing={8}>
                <Navbar />
                <Container centerContent>
                    <Box padding="4" bg={colorMode === 'light' ? "gray.100" : "gray.700"} maxW="3xl" borderRadius={6} overflow='hidden'>
                        <Heading color='gray.600'># WhatTheFox</Heading>
                        <Text>
                            This project started out as an idea to make challenges simpler and more organized
                        </Text>
                    </Box>
                </Container>
            </Stack>
        </Box>
    );
}