import { Button, HStack, Input, useNumberInput } from '@chakra-ui/react';
import { formatCurrency } from '@common/utils';
import {
  CategoriesQueryKey,
  categoryProductsFetcher,
  useCategoryProducts,
} from '@modules/category';
import {
  Product,
  productFetcher,
  ProductsQueryKey,
  RecommendationsList,
  useSingleProduct,
} from '@modules/product';
import { QueryClient } from '@tanstack/query-core';
import { dehydrate } from '@tanstack/react-query';
import { GetStaticPropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useState } from 'react';

export async function getStaticProps(context: GetStaticPropsContext) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(
    [ProductsQueryKey, context.params?.id],
    productFetcher
  );

  const category = queryClient.getQueryData<Product>([
    ProductsQueryKey,
    context.params?.id,
  ])?.category;
  await queryClient.prefetchQuery(
    [CategoriesQueryKey, category],
    categoryProductsFetcher
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

export async function getStaticPaths() {
  return {
    paths: [
      { params: { id: '1' } },
      { params: { id: '2' } },
      { params: { id: '3' } },
      { params: { id: '4' } },
      { params: { id: '5' } },
    ],
    fallback: true,
  };
}

export const QuantityInput = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (val: number) => void;
}) => {
  const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
    useNumberInput({
      step: 1,
      value,
      onChange: (val) => onChange(Number(val)),
      min: 1,
      max: 10,
    });

  const inc = getIncrementButtonProps();
  const dec = getDecrementButtonProps();
  const input = getInputProps();

  return (
    <HStack>
      <Button {...dec}>-</Button>

      <Input {...input} />

      <Button {...inc}>+</Button>
    </HStack>
  );
};

const SingleProductPage = () => {
  // TODO: Check if that product is currently in the cart
  const [quantityCounter, setQuantity] = useState(1);

  const { product } = useSingleProduct();

  const { categoryProducts } = useCategoryProducts(product?.category);

  if (!product) {
    return <div>Loading...</div>;
  }

  const { title, thumbnail, price, discountPercentage } = product;

  // TODO: Add to cart
  // TODO: Change quantity
  // TODO: Remove from cart
  const addToCart = () => {
    console.log(product, quantityCounter);
  };

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <section className="mt-32 flex h-fit flex-col gap-24 py-4 px-4 md:px-8">
        <div className=" flex w-full flex-col items-center justify-between gap-20 md:flex-row md:items-start">
          <div className="relative h-72 w-96 rounded-lg border-0 object-cover">
            <Image
              src={thumbnail}
              alt={title}
              fill
              className="rounded-lg object-cover"
            />
          </div>

          <div className="flex w-full flex-col gap-8 text-center md:w-[80%] md:text-left">
            <h2 className="max-w-sm text-4xl font-semibold">{title}</h2>
            <p>
              Lorem ipsum dolor sit amet consectetur. Tortor consequat commodo
              facilisis quam dictumst ut magna pharetra. Turpis malesuada enim
              sit non dui suspendisse lectus. Vehicula ut consectetur proin
              justo non metus. Mauris egestas euismod turpis arcu at bibendum
              risus aliquam. Ornare pulvinar pretium nunc ante. Sed faucibus
              pretium et id.
            </p>

            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
              <div className="flex flex-col items-center gap-1">
                <span>Price</span>
                <span className="text-2xl font-bold">
                  {discountPercentage
                    ? formatCurrency(price - price * (discountPercentage / 100))
                    : formatCurrency(price)}
                </span>
                {discountPercentage ? (
                  <div className="text-xs">
                    You save{' '}
                    {formatCurrency(price * (discountPercentage / 100))}
                  </div>
                ) : null}
              </div>

              <div className=" relative flex flex-col  items-center gap-1">
                <span>Quantity</span>

                <QuantityInput value={quantityCounter} onChange={setQuantity} />
              </div>

              <Button size="lg" onClick={addToCart}>
                Add to Cart
              </Button>
            </div>
          </div>
        </div>

        <RecommendationsList items={categoryProducts} />
      </section>
    </>
  );
};

export default SingleProductPage;
