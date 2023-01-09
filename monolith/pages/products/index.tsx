import { Spinner } from '@chakra-ui/react';
import fetcher from '@common/utils/fetcher';
import { ProductCard } from '@modules/product';
import { QueryClient } from '@tanstack/query-core';
import { dehydrate, useQuery } from '@tanstack/react-query';
import Head from 'next/head';

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

interface Paging {
  total: number;
  skip: number;
  limit: number;
}

export interface ProductsListResponse extends Paging {
  products: Product[];
}

export const ProductsQueryKey = 'products';
const getProducts = () =>
  fetcher
    .get<ProductsListResponse>({ url: '/products' })
    .then((res) => res[0]?.products ?? []);

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
  // TODO: Add pagination
  const { data: products, isLoading } = useQuery({
    queryKey: [ProductsQueryKey],
    initialData: [],
    queryFn: getProducts,
  });

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
