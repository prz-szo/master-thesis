import Link from 'next/link';
import { useRouter } from 'next/router';

export const NavMain = () => {
  const router = useRouter();
  return (
    <ul className="hidden items-center gap-10 md:flex">
      <li>
        <Link
          href="/categories"
          className={`
      transition-all duration-300 hover:text-amber-500 active:text-amber-300 ${
        router.pathname == '/categories'
          ? 'font-semibold text-amber-400'
          : 'text-slate-50'
      }`}
        >
          Categories
        </Link>
      </li>
      <li>
        <Link
          href="/products"
          className={`
      transition-all duration-300 hover:text-amber-500 active:text-amber-300 ${
        router.pathname == '/products'
          ? 'font-semibold text-amber-400'
          : 'text-slate-50'
      }`}
        >
          All Products
        </Link>
      </li>
    </ul>
  );
};
