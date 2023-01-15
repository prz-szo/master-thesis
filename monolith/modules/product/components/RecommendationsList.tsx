import { ArrowCarouselIcon } from '@common/assets';
import { Product, ProductCard } from '@modules/product';
import { useKeenSlider } from 'keen-slider/react';
import { MouseEventHandler, useCallback, useState } from 'react';

const breakpoints = {
  '(min-width: 400px)': {
    slides: { perView: 1.25 },
  },
  '(min-width: 450px)': {
    slides: { perView: 1.5 },
  },
  '(min-width: 500px)': {
    slides: { perView: 1.75 },
  },
  '(min-width: 550px)': {
    slides: { perView: 2 },
  },
  '(min-width: 650px)': {
    slides: { perView: 2.25 },
  },
  '(min-width: 700px)': {
    slides: { perView: 2.4 },
  },
  '(min-width: 750px)': {
    slides: { perView: 2.55 },
  },
  '(min-width: 800px)': {
    slides: { perView: 2.75 },
  },
  '(min-width: 875px)': {
    slides: { perView: 3 },
  },
  '(min-width: 950px)': {
    slides: { perView: 3.25 },
  },
  '(min-width: 1000px)': {
    slides: { perView: 3.5 },
  },
  '(min-width: 1100px)': {
    slides: { perView: 3.75 },
  },
  '(min-width: 1200px)': {
    slides: { perView: 4 },
  },
  '(min-width: 1250px)': {
    slides: { perView: 4.5 },
  },
  '(min-width: 1350px)': {
    slides: { perView: 4.75 },
  },
  '(min-width: 1400px)': {
    slides: { perView: 5 },
  },
  '(min-width: 1500px)': {
    slides: { perView: 5.5 },
  },
  '(min-width: 1600px)': {
    slides: { perView: 5.75 },
  },
  '(min-width: 1700px)': {
    slides: { perView: 6 },
  },
  '(min-width: 1800px)': {
    slides: { perView: 6.5 },
  },
  '(min-width: 1900px)': {
    slides: { perView: 7 },
  },
  '(min-width: 2000px)': {
    slides: { perView: 7.5 },
  },
  '(min-width: 2150px)': {
    slides: { perView: 8 },
  },
};

export const RecommendationsList = ({ items }: { items: Product[] }) => {
  const [loaded, setLoaded] = useState(false);
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    breakpoints,
    // loop: true,
    slides: { perView: 1, spacing: 5 },
    created() {
      setLoaded(true);
    },
  });

  const movePrev: MouseEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      event.stopPropagation();
      instanceRef.current?.prev();
    },
    [instanceRef]
  );

  const moveNext: MouseEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      event.stopPropagation();
      instanceRef.current?.next();
    },
    [instanceRef]
  );

  const navigationAvailable = instanceRef.current
    ? !!(
        instanceRef.current?.track.details.maxIdx -
        instanceRef.current?.track.details.minIdx
      )
    : false;

  return (
    <div className="flex w-full max-w-[2200px] flex-col gap-6 self-center">
      <h4 className="ml-4 w-fit rounded-md px-4 py-1 text-3xl font-semibold drop-shadow-sm">
        Featured Products
      </h4>

      <div className="relative h-auto">
        <div className="relative w-full">
          <div ref={sliderRef} className="keen-slider">
            {items.map((el) => (
              <div key={el.id} className="keen-slider__slide p-8">
                <ProductCard product={el} />
              </div>
            ))}
          </div>

          {loaded && instanceRef.current && navigationAvailable && (
            <>
              <div className="absolute top-0 hidden h-full items-center md:flex">
                <button
                  className="group relative z-10 h-12 w-12 rotate-180 rounded-full bg-amber-400 p-2 transition-all duration-300 hover:bg-slate-800"
                  onClick={movePrev}
                >
                  <ArrowCarouselIcon className="fill-slate-800 transition-all duration-300 hover:fill-amber-400 group-hover:fill-amber-400" />
                </button>
              </div>

              <div className="absolute top-0 right-0 hidden h-full items-center md:flex">
                <button
                  className="group relative z-10 h-12 w-12 rounded-full bg-amber-400 p-2 transition-all duration-300 hover:bg-slate-800"
                  onClick={moveNext}
                >
                  <ArrowCarouselIcon className="fill-slate-800 transition-all duration-300 hover:fill-amber-400 group-hover:fill-amber-400" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
