import { ButtonRegular } from '@common/components/Buttons';
import { RatingStyles } from '@modules/product/components/RatingStyles';
import { Rating } from '@smastrom/react-rating';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '../../../pages/products';

type Props = {
  product: Product;
};

export const ProductCard = ({ product }: Props) => {
  const { title, price, thumbnail, id, rating } = product;
  // const { addToCartHandler } = useCartActions();
  const priceFinal = Math.round(Number(price));
  // const avgRating = getAvgRating(product.Ratings);

  return (
    <div className="mb-2 flex w-full min-w-[15rem] snap-center flex-col justify-between rounded-lg bg-violet-600 drop-shadow-md md:w-60">
      <Link href={`/products/${id}`}>
        <div className="relative h-40 w-full  object-cover ">
          <Image src={thumbnail} alt={title} fill className="rounded-lg" />
        </div>
      </Link>
      <div className="flex w-full flex-col items-center justify-end gap-4 px-3 py-4 ">
        <Link
          href={`/products/${id}`}
          className="flex w-full flex-col items-center justify-end gap-2"
        >
          <h4 className=" text-center text-xl font-medium hover:text-amber-400 ">
            {title}
          </h4>

          <h4 className="text-xl font-bold">${priceFinal}</h4>
        </Link>

        <div className="w-28">
          <Rating value={rating} itemStyles={RatingStyles} readOnly />
        </div>

        <div className="w-full">
          <ButtonRegular onClick={() => console.log(product, 1)}>
            Add to Cart
          </ButtonRegular>
        </div>
      </div>
    </div>
  );
};
