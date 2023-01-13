import CrossIcon from '@common/assets/CrossIcon';
import MinusIcon from '@common/assets/MinusIcon';
import PlusIcon from '@common/assets/PlusIcon';
import { CartItem } from '@modules/cart';

type Props = {
  item: CartItem;
};

export const CartItemCard = ({ item }: Props) => {
  const { quantity } = item;
  const { title, price } = item;
  // const { removeItem, addToCartHandler, deleteOne } = useCartActions();
  const finalPrice = Math.round(Number(price));

  return (
    <div className="flex min-h-[8rem] w-full items-center justify-between gap-6 rounded-md border border-neutral-400 p-4">
      <h6 className="flex-1 text-center text-lg font-medium">{title}</h6>

      <div className="flex items-center gap-4">
        <div className="flex flex-col gap-1 text-center">
          <p className="text-xl">${finalPrice}</p>

          <div className="text-sm">
            Quantity:
            <span className="font-medium text-amber-400">{quantity}</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <button
            className="h-7 w-7"
            // onClick={() => addToCartHandler(item.product, 1)}
          >
            <PlusIcon className="fill-amber-500 transition-all duration-300 hover:fill-amber-700" />
          </button>

          <button className="h-7 w-7">
            <MinusIcon className="fill-amber-500 transition-all duration-300 hover:fill-amber-700" />
          </button>
        </div>

        {/*<div className="relative h-24 w-24 object-cover object-center md:h-full md:w-28">*/}
        {/*  <Image src={image} alt={title} fill />*/}
        {/*</div>*/}
      </div>

      <button className="flex h-7 w-7 flex-none items-center justify-center rounded-sm bg-slate-400 transition-all duration-300 hover:bg-amber-500">
        <CrossIcon className="fill-slate-50 transition-all duration-300" />
      </button>
    </div>
  );
};
