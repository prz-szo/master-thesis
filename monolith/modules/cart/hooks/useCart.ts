import { fetcher } from '@common/utils';
import { Cart } from '@modules/cart';
import { useQuery } from '@tanstack/react-query';

const userId = Math.floor(Math.random() * 20) + 1;

export const useCart = () => {
  const { data: cart } = useQuery<Cart | null>({
    queryKey: ['cart', userId],
    enabled: !!userId,
    queryFn: () =>
      fetcher
        .get<Cart>({ url: `/carts/${userId}` })
        .then((res) => res[0] ?? null),
    staleTime: Infinity,
  });

  console.log('cart', cart);

  return {
    cart,
  };
};
