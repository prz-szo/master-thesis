import { HeroSection } from '@common/components';
import fetcher from '@common/utils/fetcher';
import {
  Product,
  ProductsListResponse,
  RecommendationsList,
} from '@modules/product';
import Head from 'next/head';

export async function getStaticProps() {
  const randomLimit = Math.floor(Math.random() * 100) + 1;
  const randomSkip = Math.floor(Math.random() * 100) + 1;
  const products = await fetcher
    .get<ProductsListResponse>({
      url: `/products?limit=${randomLimit}&skip=${randomSkip}`,
    })
    .then((res) => res[0]?.products ?? []);

  return {
    props: {
      featuredProducts: products,
    },
  };
}

export default function Home({
  featuredProducts,
}: {
  featuredProducts: Product[];
}) {
  return (
    <>
      <Head>
        <title>Artisan pottery</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <HeroSection />
      <RecommendationsList items={featuredProducts} />
    </>
  );
}
