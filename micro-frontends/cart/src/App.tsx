import React, { useEffect } from 'react';
import { AddToCartButton } from './components';

function App() {
  // Adding event listener to the window object
  // for testing purposes only.
  useEffect(() => {
    const listener = (event: any) => {
      console.log(event);
    };

    window.addEventListener('cart-old:item_added', listener);

    return () => {
      window.removeEventListener('cart-old:item_added', listener);
    };
  }, []);

  return (
    <>
      <h1 className="relative text-center text-5xl font-bold after:absolute after:left-0 after:-bottom-3 after:h-px after:w-full after:border-b-2 after:border-dashed after:border-teal-700 after:content-['']">
        Cart components
      </h1>
      <div className="m-auto flex max-w-xl flex-col justify-center gap-6 p-6">
        <AddToCartButton id={1} quantity={2} />
        <AddToCartButton id={1} quantity={2} />
        <AddToCartButton id={1} quantity={2} />
        <AddToCartButton id={1} quantity={2} />
      </div>
    </>
  );
}

export default App;
