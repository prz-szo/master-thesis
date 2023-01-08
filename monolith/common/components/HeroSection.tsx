import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { ArrowLinkBtn } from './Buttons';

export const HeroSection = () => {
  const router = useRouter();
  const { status } = router.query;

  useEffect(() => {
    if ((status && status === 'cancel') || status === 'success') {
      // paymentNotification(status);
    }
  }, [status]);

  return (
    <section className=" mt-16 flex flex-col items-center py-11">
      <div className="relative flex h-fit  w-full flex-col gap-10 bg-center p-10">
        <div className="flex flex-col gap-4">
          <h1 className="text-5xl font-extrabold">Welcome to Art-Pot shop</h1>
          <p className="text-2xl font-medium">Demo ecommerce app.</p>
        </div>
        <ArrowLinkBtn url="/products">Shop now</ArrowLinkBtn>
      </div>
    </section>
  );
};
