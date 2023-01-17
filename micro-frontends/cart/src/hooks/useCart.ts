import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { Cart, CartItem, Product } from '../types';

const roundUp = (num: number, precision = 2) => {
  const factor = 10 ** precision;
  return Math.ceil(num * factor) / factor;
};

interface AddToCartPayload {
  newProduct: Product;
  quantity: number;
}

interface UpdateProductQuantityPayload {
  productId: Product['id'];
  quantity: number;
}

const recalculateProductTotals = (existingProduct: CartItem) => {
  existingProduct.total = existingProduct.quantity * existingProduct.price;

  const discountedPricePercentage =
    1 - existingProduct.discountPercentage * 0.01;

  existingProduct.discountedPrice = roundUp(
    existingProduct.total * discountedPricePercentage
  );
};

const recalculateCartTotals = (cart: Cart) => {
  cart.total = cart.products.reduce((acc, item) => acc + item.total, 0);
  cart.discountedTotal = roundUp(
    cart.products.reduce((acc, item) => acc + item.discountedPrice, 0)
  );
  cart.totalProducts = cart.products.length;
  cart.totalQuantity = roundUp(
    cart.products.reduce((acc, item) => acc + item.quantity, 0)
  );
};

export const useCart = () => {
  const qClient = useQueryClient();
  const [persistedCart, persistCart] = useLocalStorage<Cart>('cart', {
    id: 1,
    userId: Math.floor(Math.random() * 20) + 1,
    total: 0,
    discountedTotal: 0,
    totalProducts: 0,
    totalQuantity: 0,
    products: [],
  });

  const updateCartValue = useCallback(
    (value: Cart) => {
      qClient.setQueryData<Cart>(['cart'], {
        ...value,
      });
      persistCart(value);
    },
    [persistCart, qClient]
  );

  const { data: cart } = useQuery<Cart>({
    queryKey: ['cart'],
    notifyOnChangeProps: ['data'],
    queryFn: () => {
      const currentCart = qClient.getQueryData<Cart>(['cart']);

      if (persistedCart && (!currentCart || !currentCart.products.length)) {
        return persistedCart;
      }

      return currentCart!;
    },
    staleTime: Infinity,
  });

  const { mutate: addToCart } = useMutation({
    mutationFn: async ({ newProduct, quantity }: AddToCartPayload) => {
      if (!cart) {
        return;
      }

      const existingProduct = cart.products.find(
        (item) => item.id === newProduct.id
      );

      if (existingProduct) {
        existingProduct.quantity += quantity;
        recalculateProductTotals(existingProduct);
      } else {
        const discountedPricePercentage =
          1 - newProduct.discountPercentage / 100;

        const newCartItem: CartItem = {
          ...newProduct,
          quantity,
          total: newProduct.price * quantity,
          discountedPrice: roundUp(
            newProduct.price * quantity * discountedPricePercentage
          ),
        };

        cart.products.push(newCartItem);
      }

      recalculateCartTotals(cart);

      updateCartValue(cart);
    },
    onSuccess: () => qClient.invalidateQueries(['cart']),
  });

  const { mutate: updateProductQuantity } = useMutation({
    mutationFn: async ({
      productId,
      quantity,
    }: UpdateProductQuantityPayload) => {
      if (!cart) {
        return;
      }

      const product = cart.products.find((item) => item.id === productId);
      if (!product) {
        return;
      }

      if (quantity === 0) {
        cart.products = cart.products.filter((item) => item.id !== productId);
      } else {
        product.quantity = quantity;

        recalculateProductTotals(product);
      }

      recalculateCartTotals(cart);

      updateCartValue(cart);
    },
    onSuccess: () => qClient.invalidateQueries(['cart']),
  });

  const { mutate: removeFromCart } = useMutation({
    mutationFn: async (productId: number) => {
      if (!cart) {
        return;
      }

      if (!cart.products.map((p) => p.id).includes(productId)) {
        return;
      }

      cart.products = [
        ...cart.products.filter((item) => item.id !== productId),
      ];

      recalculateCartTotals(cart);

      updateCartValue(cart);
    },
    onSuccess: () => qClient.invalidateQueries(['cart']),
  });

  const { mutate: clearCart } = useMutation({
    mutationFn: async () => {
      if (!cart) {
        return;
      }

      cart.products.length = 0;

      recalculateCartTotals(cart);

      updateCartValue(cart);
    },
    onSuccess: () => qClient.invalidateQueries(['cart']),
  });

  return useMemo(
    () => ({
      cart,

      addToCart,
      updateProductQuantity,

      removeFromCart,
      clearCart,
    }),
    [addToCart, cart, clearCart, removeFromCart, updateProductQuantity]
  );
};
