import { HeroSection } from '@common/components';
import fetcher from '@common/utils/fetcher';
import { Product } from '@modules/category';
import Head from 'next/head';

export async function getServerSideProps() {
  const randomSkip = Math.floor(Math.random() * 100) + 1;
  const products = await fetcher
    .get<{ products: Product[] }>({
      url: `/products?limit=18&skip=${randomSkip}`,
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
      {/* TODO: Add Recommendations WC list */}
      {/*<RecommendationsList items={featuredProducts} />*/}
    </>
  );
}
