import { formatCurrency } from '@common/utils';
import { Product, RatingStyles } from '@modules/product';
import { AddToCartButton } from '@modules/product/components/AddToCartButton';
import { Rating } from '@smastrom/react-rating';
import Image from 'next/image';
import Link from 'next/link';

export const PriceBox = ({
  price,
  discountPercentage,
}: Pick<Product, 'price' | 'discountPercentage'>) => {
  const priceElementClasses = 'font-bold text-xl';
  return (
    <div className="flex-col">
      {discountPercentage ? (
        <>
          <span className="relative text-base before:absolute before:top-1/2 before:h-px before:w-full before:-rotate-6 before:bg-red-600 before:content-['']">
            Was {formatCurrency(price)}
          </span>
          <div className={priceElementClasses}>
            Now {formatCurrency(price - price * (discountPercentage / 100))}
          </div>
        </>
      ) : (
        <div className={priceElementClasses}>{formatCurrency(price)}</div>
      )}

      {discountPercentage ? (
        <div className="text-xs">
          You save {formatCurrency(price * (discountPercentage / 100))}
        </div>
      ) : null}
    </div>
  );
};

export const ProductCard = ({ product }: { product: Product }) => {
  const { title, price, thumbnail, id, rating, discountPercentage } = product;

  return (
    <div className="flex min-h-[420px] w-full min-w-[15rem] snap-center flex-col justify-between rounded-lg bg-slate-50 text-neutral-900 shadow-lg md:w-60 lg:transition lg:duration-300 lg:ease-in-out lg:hover:scale-105">
      <Link href={`/products/${id}`}>
        <div className="relative h-40 w-full">
          <Image
            sizes={'(min-width: 768px) 15rem, 100vw'}
            src={thumbnail}
            alt={title}
            fill
            className="rounded-lg object-cover"
          />
        </div>
      </Link>

      <div className="flex flex-1 flex-col items-center justify-between gap-4 px-3 py-3">
        <Link
          href={`/products/${id}`}
          className="flex w-full flex-1 flex-col items-center gap-2 self-start"
        >
          <h4 className="text-center text-xl font-medium hover:text-amber-400 ">
            {title}
          </h4>

          <PriceBox price={price} discountPercentage={discountPercentage} />
        </Link>

        <div className="w-28">
          <Rating value={rating} itemStyles={RatingStyles} readOnly />
        </div>

        {/* TODO: Should be replace with the add-to-cart-button Web Component */}
        <AddToCartButton id={product.id} />
      </div>
    </div>
  );
};
