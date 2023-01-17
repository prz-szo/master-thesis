import { createQuery, QueryFunction } from '@tanstack/solid-query';
import { Component, For } from 'solid-js';
import { Slider, SliderButton, SliderProvider } from 'solid-slider';

import 'solid-slider/slider.css';
import { ArrowCarouselIcon } from '../assets';
import { Product } from '../types';
import { fetcher } from '../utils';
import { breakpoints } from './breakpoints';
import { ProductCard } from './ProductCard';

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
    <div
      style={{
        width: '100%',
        'max-width': '2200px',
        display: 'flex',
        'flex-direction': 'column',
        gap: '1.5rem',
        'align-self': 'center',
      }}
    >
      <h4
        style={{
          'font-size': '1.875rem',
          'line-height': '2.25rem',
          'margin-left': '1rem',
          'border-radius': '0.375rem',
          width: 'fit-content',
          padding: '0.25rem 1rem',
          'font-weight': '600',
        }}
      >
        Featured Products
      </h4>

      <SliderProvider>
        <div
          style={{
            position: 'relative',
            height: 'auto',
          }}
        >
          <Slider options={{ breakpoints, slides: { perView: 1, spacing: 5 } }}>
            <For each={query.data}>
              {(item) => (
                <div style={{ padding: '2rem' }}>
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
  );
};
