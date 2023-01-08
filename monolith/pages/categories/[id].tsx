import fetcher from '@common/utils/fetcher';
import { ProductCard } from '@modules/product';
import { useQuery } from '@tanstack/react-query';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ProductsListResponse } from '../products';

const SingleCategoryPage = () => {
  const router = useRouter();
  const { id } = router.query as { id: string };

  const { data: products } = useQuery({
    queryKey: ['categories', id],
    initialData: [],
    enabled: !!id,
    queryFn: () =>
      fetcher
        .get<ProductsListResponse>({ url: `/products/category/${id}` })
        .then((res) => res[0]?.products ?? []),
  });

  console.log(products);

  const categoryName = id ? id.charAt(0).toUpperCase() + id.slice(1) : '';

  return (
    <>
      <Head>
        <title>{categoryName}</title>
      </Head>

      <section className="mt-32 h-fit py-4 px-8">
        <h2 className="mb-8 text-3xl font-bold">{categoryName}</h2>

        <div className="grid grid-cols-5 gap-4">
          {products.map((el) => (
            <ProductCard product={el} key={el.id} />
          ))}
        </div>
      </section>
    </>
  );
};
export default SingleCategoryPage;
