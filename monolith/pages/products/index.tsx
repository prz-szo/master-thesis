import Head from 'next/head';

const AllPoductsPage = () => {
  return (
    <>
      <Head>
        <title>All Products</title>
      </Head>
      <section className="mt-32 h-fit py-4 px-4 md:px-8">
        <div className="flex flex-col items-center justify-center">
          <h2 className="mb-8 text-3xl font-bold ">All Products</h2>
          <div className="grid auto-cols-max grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {/*{data?.pages.map((page) => (*/}
            {/*  <Fragment key={page.nextCursor}>*/}
            {/*    {page.items.map((item) => (*/}
            {/*      <ProductCard key={item.id} product={item} />*/}
            {/*    ))}*/}
            {/*  </Fragment>*/}
            {/*))}*/}
          </div>
          {/*{isFetchingNextPage ? <LoadingSpinner /> : null}*/}
        </div>
      </section>
    </>
  );
};

export default AllPoductsPage;
