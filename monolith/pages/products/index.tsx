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

      <section className="mt-20 h-fit py-4 px-4 md:px-8">
        <div className="flex flex-col items-center justify-center">
          <h2 className="mb-8 text-3xl font-bold ">All Products</h2>

          <div className="grid auto-cols-max grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {isLoading ? <Spinner /> : null}
        </div>
      </section>
    </>
  );
};

export default AllProductsPage;
