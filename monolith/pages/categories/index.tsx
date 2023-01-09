import fetcher from '@common/utils/fetcher';
import { CategoryList } from '@modules/category/components/CategoryList';
import { QueryClient } from '@tanstack/query-core';
import { dehydrate, useQuery } from '@tanstack/react-query';
import Head from 'next/head';

export const CategoriesQueryKey = 'categories';
const getCategories = () =>
  fetcher
    .get<string[]>({ url: '/products/categories' })
    .then((res) => res[0] ?? []);

export async function getStaticProps() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery([CategoriesQueryKey], getCategories);
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

const CategoriesPage = () => {
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    initialData: [],
    queryFn: getCategories,
  });

  return (
    <>
      <Head>
        <title>Categories</title>
      </Head>

      <section className="mt-32 h-fit py-4 px-8">
        <h2 className="mb-8 text-3xl font-bold ">All Categories</h2>

        <CategoryList categories={categories} />
      </section>
    </>
  );
};

export default CategoriesPage;
