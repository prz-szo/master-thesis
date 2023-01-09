import { HeroSection } from '@common/components';
import { RecommendationsList } from '@modules/product';
import Head from 'next/head';

export default function Home() {
  // TODO: Add real data
  const featuredProd = { data: [] };

  return (
    <>
      <Head>
        <title>Artisan pottery</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <HeroSection />
      <div className="px-4">
        <RecommendationsList items={featuredProd.data} />
      </div>
    </>
  );
}
