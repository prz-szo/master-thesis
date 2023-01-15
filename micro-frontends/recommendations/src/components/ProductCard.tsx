import { Component } from 'solid-js';
import { Product } from '../types';
import { formatCurrency } from '../utils';

export const PriceBox = ({
  price,
  discountPercentage,
}: Pick<Product, 'price' | 'discountPercentage'>) => {
  const priceElementClasses = 'font-bold text-xl';
  return (
    <div class="flex-col">
      {discountPercentage ? (
        <>
          <span class="relative text-base before:absolute before:top-1/2 before:h-px before:w-full before:-rotate-6 before:bg-red-600 before:content-['']">
            Was {formatCurrency(price)}
          </span>
          <div class={priceElementClasses}>
            Now {formatCurrency(price - price * (discountPercentage / 100))}
          </div>
        </>
      ) : (
        <div class={priceElementClasses}>{formatCurrency(price)}</div>
      )}

      {discountPercentage ? (
        <div class="text-xs">
          You save {formatCurrency(price * (discountPercentage / 100))}
        </div>
      ) : null}
    </div>
  );
};

export const ProductCard: Component<Product> = (props) => {
  return (
    <div class="flex min-h-[420px] w-full min-w-[15rem] snap-center flex-col justify-between rounded-lg bg-slate-50 text-neutral-900 shadow-lg md:w-60 lg:transition lg:duration-300 lg:ease-in-out lg:hover:scale-105">
      {/* TODO: Change to emit CustomEvent */}
      <a href={`/products/${props.id}`}>
        <div class="relative h-40 w-full">
          <img
            sizes={'(min-width: 768px) 15rem, 100vw'}
            src={props.thumbnail}
            alt={props.title}
            class="absolute left-0 top-0 right-0 bottom-0 h-full w-full rounded-lg object-cover"
          />
        </div>
      </a>

      <div class="flex flex-1 flex-col items-center justify-between gap-4 px-3 py-3">
        {/* TODO: Change to emit CustomEvent */}
        <a
          href={`/products/${props.id}`}
          class="flex w-full flex-1 flex-col items-center gap-2 self-start"
        >
          <h4 class="text-center text-xl font-medium hover:text-amber-400 ">
            {props.title}
          </h4>

          <PriceBox
            price={props.price}
            discountPercentage={props.discountPercentage}
          />
        </a>

        <div class="flex items-center justify-center space-x-2">
          <div
            class="Stars text-base"
            style={{ '--rating': props.rating, '--star-size': '22px' }}
            aria-label="Rating of this product is 2.3 out of 5."
          />
        </div>

        <div class="w-full">
          <button
            class="h-12 w-full rounded-lg bg-teal-600 font-bold text-white transition-colors duration-300 hover:bg-teal-700 active:bg-teal-800"
            // onClick={() => addToCart({ newProduct: product, quantity: 1 })}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};
