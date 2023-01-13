import { capitalize } from '@common/utils';
import Image from 'next/image';
import Link from 'next/link';

export const CategoryItem = ({ id, name }: { id: string; name: string }) => {
  const capitalizedName = capitalize(name);
  return (
    <Link
      href={`/categories/${id}`}
      className="group relative h-64 w-full overflow-hidden"
    >
      <div className="absolute z-10 h-full w-full bg-neutral-200 object-cover opacity-50 bg-blend-overlay transition duration-500 group-hover:bg-opacity-0"></div>

      <Image
        alt={capitalizedName}
        src={`https://loremflickr.com/960/720/${name}`}
        sizes={'(max-width: 640px) 640px, 960px'}
        className="scale-100 object-cover transition duration-500 group-hover:scale-110"
        fill
      />

      <h4 className="absolute top-1/2 left-1/2 z-[12] -translate-y-1/2 -translate-x-1/2 text-center text-3xl font-semibold text-slate-50 lg:text-5xl">
        {capitalizedName}
      </h4>
    </Link>
  );
};
