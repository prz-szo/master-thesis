import { ChakraProvider } from '@chakra-ui/react';
import Layout from '@common/components/layout';
import '@smastrom/react-rating/style.css';
import { QueryClient } from '@tanstack/query-core';
import { Hydrate, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AppProps } from 'next/app';
import { useState } from 'react';

import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <Layout>
          <ChakraProvider>
            <Component {...pageProps} />
          </ChakraProvider>
        </Layout>
      </Hydrate>

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
