import {
  categoriesFetcher,
  CategoriesQueryKey,
  CategoryList,
  useCategories,
} from '@modules/category';
import { QueryClient } from '@tanstack/query-core';
import { dehydrate } from '@tanstack/react-query';
import Head from 'next/head';

export async function getStaticProps() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery([CategoriesQueryKey], categoriesFetcher);
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

const CategoriesPage = () => {
  const { categories } = useCategories();

  return (
    <>
      <Head>
        <title>Categories</title>
      </Head>

      <section className="h-fit w-full pt-20">
        <h2 className="mb-8 text-center text-3xl font-bold lg:text-7xl">
          All Categories
        </h2>

        <CategoryList categories={categories} />
      </section>
    </>
  );
};

export default CategoriesPage;
