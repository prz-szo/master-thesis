/* eslint-disable @typescript-eslint/ban-ts-comment */
import Head from 'next/head';
import { AddToCartButton, CartDrawer } from '../common/components';

export default function Home() {
  return (
    <>
      <Head>
        <title>Artisan pottery</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className="relative text-center text-5xl font-bold after:absolute after:left-0 after:-bottom-3 after:h-px after:w-full after:border-b-2 after:border-dashed after:border-teal-700 after:content-['']">
        Cart components
      </h1>
      <div className="m-auto flex max-w-xl flex-col justify-center gap-6 p-6">
        <div>
          <label>Add to Cart button</label>
          <AddToCartButton productId={89} quantity={2} />
        </div>

        <div className="w-full border-4 border-dotted border-teal-700">
          <label>Add to Cart button (Web Component)</label>
          {/* @ts-ignore */}
          <add-to-cart-btn product-id="1" quantity="5"></add-to-cart-btn>
        </div>

        <div>
          <label>Cart Drawer</label>
          <CartDrawer />
        </div>
      </div>
    </>
  );
}
