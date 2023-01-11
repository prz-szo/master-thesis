import { capitalize } from '@common/utils';
import {
  categoriesFetcher,
  CategoriesQueryKey,
  categoryProductsFetcher,
  useCategoryProducts,
} from '@modules/category';
import { ProductCard } from '@modules/product';
import { QueryClient } from '@tanstack/query-core';
import { dehydrate } from '@tanstack/react-query';
import { GetStaticPropsContext } from 'next';
import Head from 'next/head';

export async function getStaticProps(context: GetStaticPropsContext) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(
    [CategoriesQueryKey, context.params?.id],
    categoryProductsFetcher
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

export async function getStaticPaths() {
  const categories = await categoriesFetcher();
  return {
    paths: categories.map((category) => ({ params: { id: category } })),
    fallback: true,
  };
}

const SingleCategoryPage = () => {
  const { categoryProducts, category } = useCategoryProducts();

  const categoryName = capitalize(category);

  return (
    <>
      <Head>
        <title>{categoryName}</title>
      </Head>

      <section className="mt-20 h-fit w-full">
        <h2 className="mb-8 text-3xl font-bold">{categoryName}</h2>

        <div className="flex grid-cols-5 flex-col gap-4 lg:grid">
          {categoryProducts.map((el) => (
            <ProductCard product={el} key={el.id} />
          ))}
        </div>
      </section>
    </>
  );
};
export default SingleCategoryPage;
