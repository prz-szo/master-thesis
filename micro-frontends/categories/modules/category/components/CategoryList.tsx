import { CategoryItem } from './CategoryItem';

export const CategoryList = ({ categories }: { categories: string[] }) => {
  return (
    <div
      className="flex w-full grid-cols-1 flex-col gap-4 md:grid-cols-2
      lg:grid [&>*:nth-child(1)]:col-span-2"
    >
      {categories.map((category) => (
        <CategoryItem name={category} id={category} key={category} />
      ))}
    </div>
  );
};
