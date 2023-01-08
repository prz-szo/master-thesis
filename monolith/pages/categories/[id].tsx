import { ProductCard } from '@modules/product';
import Head from 'next/head';
import { useRouter } from 'next/router';

const SingleCategory = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data } = { data: { name: 'Category Name', products: [] as any[] } };

  return (
    <>
      <Head>
        <title>{data?.name}</title>
      </Head>
      <section className="mt-32 h-fit py-4 px-8">
        <h2 className="mb-8 text-3xl font-bold">{data?.name}</h2>
        <div className="grid grid-cols-5 gap-4">
          {data?.products?.map((el) => (
            <ProductCard product={el} key={el.id} />
          ))}
        </div>
      </section>
    </>
  );
};
export default SingleCategory;
