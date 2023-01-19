import { ChakraProvider } from '@chakra-ui/react';
import CartDrawer from '@common/components/CartDrawer';
import { QueryClient } from '@tanstack/query-core';
import { QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export const CartDrawerWrapped = () => {
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
      <ChakraProvider>
        <CartDrawer />
      </ChakraProvider>
    </QueryClientProvider>
  );
};

export default CartDrawerWrapped;
