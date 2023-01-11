import { Footer } from '@common/components/Footer';
import { Header } from '@common/components/Header';
import { type ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export function Layout({ children }: Props) {
  return (
    <div className="flex h-full min-h-screen flex-col">
      <Header />
      <main className="max-width-layout mx-auto flex h-auto w-full grow flex-col p-6">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
