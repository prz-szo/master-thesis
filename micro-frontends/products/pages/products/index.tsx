import { Spinner } from '@chakra-ui/react';
import {
  getProducts,
  ProductCard,
  ProductsQueryKey,
  useProducts,
} from '@modules/product';
import { QueryClient } from '@tanstack/query-core';
import { dehydrate } from '@tanstack/react-query';
import Head from 'next/head';
import Script from 'next/script';

export async function getStaticProps() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery([ProductsQueryKey], getProducts);
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

const AllProductsPage = () => {
  const { products, isLoading } = useProducts();

  return (
    <>
      <Head>
        <title>All Products</title>
      </Head>

      <section className="mt-20 h-fit">
        <div className="flex flex-col items-center justify-center">
          <h2 className="mb-8 text-3xl font-bold">All Products</h2>

          <div className="grid auto-cols-max grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {isLoading ? <Spinner /> : null}
        </div>
      </section>

      <Script src={`${process.env.NEXT_PUBLIC_CART_URL}`} type="module" />
    </>
  );
};

export default AllProductsPage;
