/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ChakraProvider } from '@chakra-ui/react';
import { Layout } from '@common/components';
import '@smastrom/react-rating/style.css';
import { QueryClient } from '@tanstack/query-core';
import { Hydrate, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AppProps, NextWebVitalsMetric } from 'next/app';
import { useState } from 'react';

import '../styles/globals.css';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'recommendations-list': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      'add-to-cart-btn': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}

export function reportWebVitals(metric: NextWebVitalsMetric) {
  const prefix =
    metric.label === 'web-vital'
      ? ['%cWeb Vital', 'background-color:#166534;color:white;padding:6px;']
      : [
          '%cCustom Next.js metric',
          'background-color:#4c1d95;color:white;padding:6px;',
        ];

  // @ts-ignore
  delete metric.id;
  // @ts-ignore
  delete metric.label;

  console.group(...prefix);

  for (const key in metric) {
    // @ts-ignore
    console.log(`${key}: ${metric[key]}`);
  }

  console.groupEnd();
}

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000, // in milliseconds
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <ChakraProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ChakraProvider>
      </Hydrate>

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
