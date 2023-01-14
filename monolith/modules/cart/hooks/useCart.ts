import { fetcher } from '@common/utils';
import { Cart, CartItem } from '@modules/cart';
import { Product } from '@modules/product';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const cartId = Math.floor(Math.random() * 20) + 1;

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

function recalculateProductTotals(existingProduct: CartItem) {
  existingProduct.total = existingProduct.quantity * existingProduct.price;

  const discountedPricePercentage =
    1 - existingProduct.discountPercentage * 0.01;

  existingProduct.discountedPrice = roundUp(
    existingProduct.total * discountedPricePercentage
  );
}

function recalculateCartTotals(cart: Cart) {
  cart.total = cart.products.reduce((acc, item) => acc + item.total, 0);
  cart.discountedTotal = roundUp(
    cart.products.reduce((acc, item) => acc + item.discountedPrice, 0)
  );
  cart.totalProducts = cart.products.length;
  cart.totalQuantity = roundUp(
    cart.products.reduce((acc, item) => acc + item.quantity, 0)
  );
}

export const useCart = () => {
  const qClient = useQueryClient();

  const { data: cart } = useQuery<Cart | null>({
    queryKey: ['cart', cartId],
    enabled: !!cartId,
    queryFn: async () => {
      const currentCart = qClient.getQueryData<Cart | null>(['cart', cartId]);

      if (currentCart) {
        return currentCart;
      }

      // return {
      //   id: cartId,
      //   userId: 1,
      //   total: 0,
      //   discountedTotal: 0,
      //   totalProducts: 0,
      //   totalQuantity: 0,
      //   products: [],
      // };

      return fetcher
        .get<Cart>({ url: `/carts/${cartId}` })
        .then((res) => res[0] ?? null);
    },
    staleTime: Infinity,
  });

  const { mutate: addToCart } = useMutation({
    mutationFn: async ({ newProduct, quantity }: AddToCartPayload) => {
      const currentCart = qClient.getQueryData<Cart | null>(['cart', cartId]);
      if (!currentCart) {
        return;
      }

      const existingProduct = currentCart.products.find(
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

        currentCart.products.push(newCartItem);
      }

      recalculateCartTotals(currentCart);

      qClient.setQueryData<Cart | null>(['cart', cartId], { ...currentCart });
    },
    onSuccess: () => qClient.invalidateQueries(['cart', cartId]),
  });

  const { mutate: updateProductQuantity } = useMutation({
    mutationFn: async ({
      productId,
      quantity,
    }: UpdateProductQuantityPayload) => {
      const currentCart = qClient.getQueryData<Cart | null>(['cart', cartId]);
      if (!currentCart) {
        return;
      }

      const product = currentCart.products.find(
        (item) => item.id === productId
      );
      if (!product) {
        return;
      }

      if (quantity === 0) {
        currentCart.products = currentCart.products.filter(
          (item) => item.id !== productId
        );
      } else {
        product.quantity = quantity;

        recalculateProductTotals(product);
      }

      recalculateCartTotals(currentCart);

      qClient.setQueryData<Cart | null>(['cart', cartId], { ...currentCart });
    },
    onSuccess: () => qClient.invalidateQueries(['cart', cartId]),
  });

  const { mutate: removeFromCart } = useMutation({
    mutationFn: async (productId: number) => {
      const currentCart = qClient.getQueryData<Cart | null>(['cart', cartId]);
      if (!currentCart) {
        return;
      }

      if (!currentCart.products.map((p) => p.id).includes(productId)) {
        return;
      }

      currentCart.products = [
        ...currentCart.products.filter((item) => item.id !== productId),
      ];

      recalculateCartTotals(currentCart);

      qClient.setQueryData<Cart | null>(['cart', cartId], { ...currentCart });
    },
    onSuccess: () => qClient.invalidateQueries(['cart', cartId]),
  });

  return {
    cart,

    addToCart,
    updateProductQuantity,
    removeFromCart,
  };
};
