import { HeroSection } from '@common/components';
import { Product } from '@modules/category';
import Head from 'next/head';
import Script from 'next/script';

export async function getServerSideProps() {
  return {
    props: {
      randomProductId: Math.floor(Math.random() * 100) + 1,
    },
  };
}

export default function Home({
  randomProductId,
}: {
  randomProductId: Product['id'];
}) {
  return (
    <>
      <Head>
        <title>Artisan pottery</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <HeroSection />

      <div className="w-full border-4 border-dotted border-teal-700">
        <recommendations-list
          product-id={randomProductId}
        ></recommendations-list>
      </div>

      <Script src={`${process.env.NEXT_PUBLIC_RECOS_URL}`} type="module" />
    </>
  );
}
