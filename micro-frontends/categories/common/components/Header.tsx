import { Button, useToast } from '@chakra-ui/react';
import { CartDrawer, useCart } from '@modules/cart';
import Link from 'next/link';
import { NavMain } from './NavMain';

export const Header = () => {
  const toast = useToast();
  const { cart } = useCart();

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
            <CartDrawer />

            <span className="items absolute -bottom-2 -right-3 box-content flex h-5 w-5 items-center justify-center rounded-full border-2 border-amber-500 bg-slate-50 text-slate-900">
              <span className="text-xs transition-all duration-300">
                {cart?.totalQuantity ?? 0}
              </span>
            </span>
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
