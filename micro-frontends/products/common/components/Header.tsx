import { Alert, AlertIcon, Button, Spinner, useToast } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ErrorBoundary } from 'react-error-boundary';
import { NavMain } from './NavMain';

const CartDrawer = dynamic(
  () =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    import('@mfe/cart/CartDrawer'),
  {
    ssr: false,
    loading: () => <Spinner size="md" />,
  }
);

const errorFallback = (
  <Alert status="error" p={1} alignItems="center" justifyContent="center">
    <AlertIcon mr={0} w={5} h={5} />
  </Alert>
);

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
          <li className="relative border-2 border-dotted border-amber-700 p-2">
            <ErrorBoundary fallback={errorFallback}>
              <CartDrawer />
              <span className="absolute relative -bottom-2 -right-3 bottom-0 left-0 right-0 top-0 box-content flex hidden h-24 h-5 h-7 h-full min-h-[8rem] w-24 w-5 w-7 w-full flex-1 flex-none flex-col items-center justify-center justify-between gap-1 gap-2 gap-6 rounded-full rounded-lg rounded-sm border border-2 border-amber-500 border-neutral-400/50 bg-slate-400 bg-slate-50 fill-amber-500 fill-slate-50 object-cover p-4 text-center text-slate-900 shadow-md transition-all duration-300 hover:bg-amber-500 hover:fill-amber-400"></span>
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
