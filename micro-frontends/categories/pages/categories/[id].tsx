import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Spinner,
} from '@chakra-ui/react';
import { capitalize } from '@common/utils';
import {
  categoriesFetcher,
  CategoriesQueryKey,
  categoryProductsFetcher,
  useCategoryProducts,
} from '@modules/category';
import { QueryClient } from '@tanstack/query-core';
import { dehydrate } from '@tanstack/react-query';
import { GetStaticPropsContext } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Script from 'next/script';
import { Fragment } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

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

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const ProductCard = dynamic(() => import('@mfe/products/ProductCard'), {
  ssr: false,
  loading: () => (
    <Box
      width="250px"
      height="420px"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" size="xl" />
    </Box>
  ),
});

export async function getStaticPaths() {
  const categories = await categoriesFetcher();
  return {
    paths: categories.map((category) => ({ params: { id: category } })),
    fallback: true,
  };
}

const errorFallback = (
  <Alert
    status="error"
    variant="subtle"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    textAlign="center"
  >
    <AlertIcon boxSize="40px" mr={0} />
    <AlertTitle mt={4} mb={1} fontSize="lg">
      Error: Script failed to load due to infrastructure error.
    </AlertTitle>
    <AlertDescription maxWidth="sm">
      Please try again later or contact support for assistance.
    </AlertDescription>
  </Alert>
);

const SingleCategoryPage = () => {
  const router = useRouter();
  const { id = '' } = router.query as { id: string };

  const { categoryProducts, category, areProductsLoading } =
    useCategoryProducts(id);

  const categoryName = capitalize(category);

  return (
    <>
      <Head>
        <title>{categoryName}</title>
      </Head>

      <section className="mt-20 h-fit">
        <div className="flex flex-col items-center justify-center">
          <h2 className="mb-8 text-3xl font-bold">{categoryName}</h2>

          <ErrorBoundary fallback={errorFallback}>
            <div className="grid min-h-[420px] auto-cols-max grid-cols-1 gap-6 border-4 border-dotted border-amber-700 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {categoryProducts.map((product) => (
                <Fragment key={product.id}>
                  {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                  {/* @ts-ignore */}
                  <ProductCard product={product} className="h-40" />
                </Fragment>
              ))}
            </div>
          </ErrorBoundary>

          {areProductsLoading ? <Spinner /> : null}
        </div>
      </section>

      <div className="flex hidden min-h-[420px] w-full min-w-[15rem] flex-1 snap-center flex-col flex-col items-center justify-between justify-between gap-4 rounded-lg bg-slate-50 px-3 py-3 text-neutral-900 shadow-lg md:w-60 lg:transition lg:duration-300 lg:ease-in-out lg:hover:scale-105"></div>

      <Script src={`${process.env.NEXT_PUBLIC_CART_URL}`} type="module" />
    </>
  );
};
export default SingleCategoryPage;
