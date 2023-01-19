import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from '@chakra-ui/react';
import { CrossIcon } from '../assets';
import { useCart } from '../hooks';
import { CartItem } from '../types';
import { formatCurrency } from '../utils';

export const CartItemCard = ({
  quantity,
  title,
  price,
  discountedPrice,
  discountPercentage,
  thumbnail,
  id,
}: CartItem) => {
  const { updateProductQuantity, removeFromCart } = useCart();

  return (
    <div className="flex min-h-[8rem] w-full items-center justify-between gap-6 rounded-lg p-4 shadow-md">
      <div className="relative h-24 w-24 flex-none">
        <img
          sizes={'(min-width: 768px) 15rem, 100vw'}
          src={
            thumbnail ??
            `https://i.dummyjson.com/data/products/${id}/thumbnail.jpg`
          }
          className="absolute left-0 top-0 right-0 bottom-0 h-full w-full rounded-lg border border-neutral-400/50 object-cover"
          alt={title}
        />
      </div>

      <div className="flex flex-1 flex-col gap-1 text-center">
        <h6 className="flex-1 text-center text-lg font-medium">{title}</h6>

        <div className="text-sm">
          Price per unit:{' '}
          <span className="font-medium">
            {formatCurrency(price - price * discountPercentage * 0.01)}
          </span>
        </div>
      </div>

      <div className="flex flex-none items-center gap-6">
        <div className="flex flex-none items-center gap-2">
          <NumberInput
            maxWidth={'20'}
            defaultValue={quantity}
            min={0}
            max={10}
            onChange={(_, qty) =>
              updateProductQuantity({
                productId: id,
                quantity: qty,
              })
            }
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>

          <div className="flex flex-col gap-1 text-center">
            <p className="text-xl">{formatCurrency(discountedPrice)}</p>
          </div>
        </div>

        <button
          onClick={() => removeFromCart(id)}
          className="flex h-7 w-7 flex-none rounded-sm bg-slate-400 transition-all duration-300 hover:bg-amber-500"
        >
          <CrossIcon className="fill-slate-50 transition-all duration-300" />
        </button>
      </div>
    </div>
  );
};
