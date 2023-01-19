import React from 'react';
import { AddToCartButton, CartDrawerParent } from './components';

function App() {
  return (
    <>
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
          <CartDrawerParent />
        </div>
      </div>
    </>
  );
}

export default App;
