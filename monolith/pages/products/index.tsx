import { LoadingSpinner } from '@common/components';
import fetcher from '@common/utils/fetcher';
import { ProductCard } from '@modules/product';
import { useQuery } from '@tanstack/react-query';
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

const AllProductsPage = () => {
  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    initialData: [],
    queryFn: () =>
      fetcher
        .get<ProductsListResponse>({ url: '/products' })
        .then((res) => res[0]?.products ?? []),
  });

  console.log(products);

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
          {isLoading ? <LoadingSpinner /> : null}
        </div>
      </section>
    </>
  );
};

export default AllProductsPage;
