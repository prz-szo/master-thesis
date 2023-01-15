import Link from 'next/link';
import ArrowIcon from '../assets/ArrowIcon';

type Props = {
  children: string;
  onClick?: () => void;
};

type ArrowProps = {
  url: string;
  children: string;
};

export const OutlineBtn = ({ children, onClick }: Props) => {
  return (
    <button
      onClick={onClick}
      className="outline-amber rounded-sm bg-transparent px-3 py-1 text-amber-400 outline outline-2 transition-all duration-300 hover:bg-amber-400/20"
    >
      {children}
    </button>
  );
};

export const ArrowBtn = ({ children, onClick }: Props) => {
  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-2 rounded-lg bg-amber-400 py-2 px-6 text-xl font-bold text-neutral-800 transition-all duration-300 hover:bg-neutral-800 hover:text-amber-500 md:text-2xl"
    >
      {children}
      <div className="w-7">
        <ArrowIcon className="fill-neutral-800 transition-all duration-300 group-hover:fill-amber-500" />
      </div>
    </button>
  );
};

export const ArrowLinkBtn = ({ url, children }: ArrowProps) => {
  return (
    <Link href={url} className="group">
      <ArrowBtn>{children}</ArrowBtn>
    </Link>
  );
};
