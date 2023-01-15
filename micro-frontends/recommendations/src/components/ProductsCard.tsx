import { Component } from "solid-js";
import { Product } from "../types";
import { formatCurrency } from "../utils";

export const PriceBox = ({
  price,
  discountPercentage,
}: Pick<Product, "price" | "discountPercentage">) => {
  const priceElementClasses = "font-bold text-xl";
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
      <div class="flex flex-1 flex-col items-center justify-between gap-4 px-3 py-3">
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

        <div class="w-28">
          {props.rating}
          {/*<Rating value={rating} itemStyles={RatingStyles} readOnly />*/}
        </div>

        <div class="w-full">
          <button
            class="w-full"
            // onClick={() => addToCart({ newProduct: product, quantity: 1 })}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};
