import { Button, useToast } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ErrorBoundary } from 'react-error-boundary';
import { NavMain } from './NavMain';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const CartDrawer = dynamic(() => import('@mfe/cart/CartDrawer'), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});

export const Header = () => {
  const toast = useToast();

  return (
    <header className="drop-shadow-header fixed top-0 left-0 right-0 z-20 flex items-center justify-between gap-10 bg-neutral-800 py-4 px-10 font-medium text-slate-50 backdrop-blur  md:justify-start">
      <Link href="/">
        <h3 className="whitespace-nowrap text-2xl font-bold text-amber-500 transition-all duration-300 hover:text-amber-100">
          Art－Pot Shop
        </h3>
      </Link>

      <nav className="flex items-center justify-between md:w-full">
        <NavMain />

        <ul className="flex items-center gap-8">
          <li className="relative">
            <ErrorBoundary fallback={<h2>Failed to CartDrawer</h2>}>
              <CartDrawer />
            </ErrorBoundary>
          </li>

          <li>
            <Button
              variant="outline"
              className="hover:text-amber-500"
              onClick={() =>
                toast({
                  title: "We're sorry. This feature is not available yet.",
                  description:
                    "We're doing our best to implement it as soon as possible. Please check back later.",
                  status: 'info',
                  duration: 5000,
                  position: 'top',
                  isClosable: true,
                })
              }
            >
              Sign in
            </Button>
          </li>
        </ul>
      </nav>
    </header>
  );
};
