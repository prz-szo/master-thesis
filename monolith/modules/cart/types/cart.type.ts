import { Product } from '@modules/product';

export type CartItem = Pick<
  Product,
  'id' | 'title' | 'discountPercentage' | 'price'
> & {
  quantity: number;
  total: number;
  discountedPrice: number;
};

export interface Cart {
  id: number;
  products: CartItem[];
  total: number;
  discountedTotal: number;
  userId: number;
  totalProducts: number;
  totalQuantity: number;
}
