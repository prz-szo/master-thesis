import { createQuery, QueryFunction } from '@tanstack/solid-query';
import { Component, For } from 'solid-js';
import { Slider, SliderButton, SliderProvider } from 'solid-slider';

import 'solid-slider/slider.css';
import { ArrowCarouselIcon } from '../assets';
import { Product } from '../types';
import { fetcher } from '../utils';
import { breakpoints } from './breakpoints';
import { ProductCard } from './ProductCard';
import { globalStyles } from './Styles';

export const recosFetcher: QueryFunction<Product[]> = ({ queryKey }) =>
  fetcher
    .get<Pick<Product, 'id' | 'category'>>({
      url: `/products/${queryKey[1]}?select=id,category`,
    })
    .then((res) => res[0] ?? { category: '' })
    .then(({ category }) =>
      fetcher.get<{ products: Product[] }>({
        url: `/products/category/${category}`,
      })
    )
    .then((res) => res[0]?.products ?? []);

export const RecommendationsList: Component<{ productId: Product['id'] }> = (
  props
) => {
  const query = createQuery(
    () => ['recommendations', props.productId],
    recosFetcher,
    {
      staleTime: Infinity,
      enabled: !!props.productId,
    }
  );

  return (
    <>
      <div
        class="flex w-full flex-col gap-6 self-center"
        style={{ 'max-width': '2000px', ...globalStyles }}
      >
        <h4 class="ml-4 w-fit rounded-md px-4 py-1 text-3xl font-semibold drop-shadow-sm">
          Featured Products
        </h4>

        <SliderProvider>
          <div class="relative h-auto">
            <Slider
              options={{ breakpoints, slides: { perView: 1, spacing: 5 } }}
            >
              <For each={query.data}>
                {(item) => (
                  <div class="p-8">
                    <ProductCard {...item} />
                  </div>
                )}
              </For>
            </Slider>

            <div class="absolute top-0 hidden h-full items-center md:flex">
              <SliderButton
                class="group relative z-10 h-12 w-12 rotate-180 rounded-full bg-amber-400 p-2 transition-all duration-300 hover:bg-slate-800"
                prev
              >
                <ArrowCarouselIcon class="fill-slate-800 transition-all duration-300 hover:fill-amber-400 group-hover:fill-amber-400" />
              </SliderButton>
            </div>

            <div class="absolute top-0 right-0 hidden h-full items-center md:flex">
              <SliderButton
                class="group relative z-10 h-12 w-12 rounded-full bg-amber-400 p-2 transition-all duration-300 hover:bg-slate-800"
                next
              >
                <ArrowCarouselIcon class="fill-slate-800 transition-all duration-300 hover:fill-amber-400 group-hover:fill-amber-400" />
              </SliderButton>
            </div>
          </div>
        </SliderProvider>
      </div>
    </>
  );
};
