import fetcher from '@common/utils/fetcher';
import { CategoryList } from '@modules/category/components/CategoryList';
import { useQuery } from '@tanstack/react-query';
import Head from 'next/head';

const CategoriesPage = () => {
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    initialData: [],
    queryFn: () =>
      fetcher
        .get<string[]>({ url: '/products/categories' })
        .then((res) => res[0] ?? []),
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
