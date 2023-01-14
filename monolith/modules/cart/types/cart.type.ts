import { Product } from '@modules/product';

export interface CartItem extends Product {
  quantity: number;
  total: number;
  discountedPrice: number;
}

export interface Cart {
  id: number;
  products: CartItem[];
  total: number;
  discountedTotal: number;
  userId: number;
  totalProducts: number;
  totalQuantity: number;
}
