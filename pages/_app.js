import { ChakraProvider } from "@chakra-ui/react";
import { Provider } from 'next-auth/client';
import Head from 'next/head';


function MyApp({ Component, pageProps }) {
  return (
    <Provider session={pageProps.session}>
      <ChakraProvider>
	<Head>
	  <title>FoxInTheBox</title>
	  <link rel="shortcut icon" href="/static/favicon.ico" />
	</Head>
        <Component {...pageProps} />
      </ChakraProvider>
    </Provider>
  );
}

export default MyApp
