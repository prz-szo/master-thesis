import {
  ChakraProvider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCallback, useEffect } from 'react';
import { CartIcon } from '../assets';
import { useCart } from '../hooks';
import { formatCurrency } from '../utils';
import { ArrowBtn, OutlineBtn } from './Buttons';
import { CartItemCard } from './CartItem';

const queryClient = new QueryClient();

// Augment the global window object with a custom event.
// As for now lib.dom.d.ts doesn't have a possibility to add event listeners for custom events.
const AddToCartCustomEventName = 'cart:item_added';
interface AddToCartCustomEventPayload {
  id: number;
  quantity?: number;
}
interface AddToCartCustomEvent
  extends CustomEvent<AddToCartCustomEventPayload> {
  name: typeof AddToCartCustomEventName;
}
declare global {
  interface WindowEventMap {
    [AddToCartCustomEventName]: AddToCartCustomEvent;
  }
}

const CartDrawer = () => {
  const toast = useToast();
  const { isOpen, onToggle, onClose } = useDisclosure();

  const { cart, clearCart } = useCart();

  const clearCartHandler = useCallback(() => {
    clearCart();
  }, [clearCart]);

  useEffect(() => {
    const listener = (event: AddToCartCustomEvent) => {
      console.log(event);
    };

    window.addEventListener('cart:item_added', listener);

    return () => {
      window.removeEventListener('cart:item_added', listener);
    };
  }, []);

  return (
    <>
      <div className="relative h-7 w-7">
        <button disabled={!cart} onClick={onToggle}>
          <div className="h-7 w-7">
            <CartIcon className="fill-amber-500 transition-all duration-300 hover:fill-amber-400" />
          </div>
        </button>

        <span className="items absolute -bottom-2 -right-3 box-content flex h-5 w-5 items-center justify-center rounded-full border-2 border-amber-500 bg-slate-50 text-slate-900">
          <span className="text-xs transition-all duration-300">
            {cart?.totalQuantity ?? 0}
          </span>
        </span>
      </div>

      <Drawer isOpen={isOpen} placement="right" size="lg" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader fontSize={'xx-large'}>Your shopping cart</DrawerHeader>
          <DrawerCloseButton />

          <DrawerBody>
            <div className="flex h-full flex-col gap-6">
              <div className="flex flex-none items-center justify-between gap-8">
                <div className="flex items-center gap-2">
                  <h4 className="text-2xl font-medium">My Basket</h4>
                  <p>{`(${cart?.totalQuantity ?? 0} items)`}</p>
                </div>
                <div className="flex items-center gap-4">
                  <OutlineBtn onClick={clearCartHandler}>Clear</OutlineBtn>
                </div>
              </div>

              <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-2">
                {cart?.products.length ? (
                  cart.products.map((el) => (
                    <CartItemCard key={el.id} {...el} />
                  ))
                ) : (
                  <span className="my-auto text-center text-2xl">
                    Your cart is empty
                  </span>
                )}
              </div>
            </div>
          </DrawerBody>

          <DrawerFooter borderTopWidth="1px">
            <div className="flex w-full justify-between justify-self-end py-4 px-4 md:px-8 md:py-6">
              {cart && (
                <div className="flex flex-col gap-2">
                  <h6 className="font-medium">Subtotal Amount:</h6>
                  <span className="text-2xl font-semibold">
                    {formatCurrency(cart.discountedTotal)}
                  </span>
                </div>
              )}

              <ArrowBtn
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
                Checkout
              </ArrowBtn>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

const CartDrawerParent = () => (
  <QueryClientProvider client={queryClient}>
    <ChakraProvider>
      <CartDrawer />
    </ChakraProvider>
  </QueryClientProvider>
);

export { CartDrawerParent as CartDrawer };
