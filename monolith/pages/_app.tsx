import { ChakraProvider } from '@chakra-ui/react';
import Layout from '@common/components/layout';
import '@smastrom/react-rating/style.css';
import { QueryClient } from '@tanstack/query-core';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AppProps } from 'next/app';

import '../styles/globals.css';

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <ChakraProvider>
          <Component {...pageProps} />
        </ChakraProvider>
      </Layout>

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
