import { CategoryItem } from './CategoryItem';

export const CategoryList = () => {
  const categories: any[] = []; // trpc.category.getAllCategories.useQuery(undefined, {
  //   staleTime: Infinity,
  // });

  return (
    <div
      className="grid w-full grid-cols-1 gap-4
      md:grid-cols-2 [&>*:nth-child(1)]:col-span-2"
    >
      {categories.map((item) => (
        <CategoryItem name={item.name} id={item.id} key={item.id} />
      ))}
    </div>
  );
};
