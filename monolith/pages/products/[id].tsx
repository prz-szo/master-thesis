import { MinusIcon, PlusIcon } from '@common/assets';
import { BigButton } from '@common/components';
import fetcher from '@common/utils/fetcher';
import { RecommendationsList } from '@modules/product';
import { useQuery } from '@tanstack/react-query';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Product } from './index';

const ProductsQueryKey = 'product';

const SingleProductPage = () => {
  const router = useRouter();
  const featured = { data: [] };

  const [quantityCounter, setQuantity] = useState(1);

  const { data: product } = useQuery({
    queryKey: [ProductsQueryKey, router.query.id],
    enabled: !!router.query.id,
    queryFn: () =>
      fetcher
        .get<Product>({ url: `/products/${router.query.id}` })
        .then((res) => res[0]),
  });

  console.log(product);

  if (!product) {
    return <div>Loading...</div>;
  }

  const { title, thumbnail, price } = product;

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <section className="mt-32 flex h-fit flex-col gap-24 py-4 px-4 md:px-8">
        <div className=" flex w-full flex-col items-center justify-between gap-20 md:flex-row md:items-start">
          <div className="b- border- relative h-72 w-72 rounded-lg border-8 border-amber-400 object-cover">
            <Image src={thumbnail} alt={title} fill />
          </div>

          <div className="flex w-full flex-col gap-8 text-center md:w-[80%] md:text-left">
            <h2 className="max-w-sm  text-4xl font-semibold ">{title}</h2>
            <p>
              Lorem ipsum dolor sit amet consectetur. Tortor consequat commodo
              facilisis quam dictumst ut magna pharetra. Turpis malesuada enim
              sit non dui suspendisse lectus. Vehicula ut consectetur proin
              justo non metus. Mauris egestas euismod turpis arcu at bibendum
              risus aliquam. Ornare pulvinar pretium nunc ante. Sed faucibus
              pretium et id.
            </p>

            <div className="flex flex-col justify-between gap-6 md:flex-row">
              <div className="flex flex-col items-center gap-1">
                <span>Price</span>
                <span className="text-2xl font-bold">${price}</span>
              </div>

              <div className=" relative flex flex-col  items-center gap-1">
                <span>Quantity</span>

                <div className="flex items-center gap-2">
                  <button
                    className="h-5 w-5"
                    onClick={() => setQuantity((prev) => (prev -= 1))}
                  >
                    <MinusIcon className="fill-amber-400 hover:fill-violet-400 " />
                  </button>

                  <input
                    type="text"
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    value={quantityCounter}
                    className="relative w-10 rounded-md border-0 bg-violet-800 px-2 py-1 text-center text-xl font-bold"
                  />
                  <button
                    className="h-5 w-5"
                    onClick={() => setQuantity((prev) => (prev += 1))}
                  >
                    <PlusIcon className="fill-amber-400 hover:fill-violet-400 " />
                  </button>
                </div>
              </div>

              <BigButton onClick={() => console.log(product, quantityCounter)}>
                Add to Cart
              </BigButton>
            </div>
          </div>
        </div>
        <RecommendationsList items={featured.data} />
      </section>
    </>
  );
};

export default SingleProductPage;
