import { setRequestLocale } from 'next-intl/server';
import { Hero } from '@/components/home/Hero';
import { Areas } from '@/components/home/Areas';
import { Portfolio } from '@/components/home/Portfolio';
import { About } from '@/components/home/About';
import { Ecosystem } from '@/components/home/Ecosystem';
import { Partners } from '@/components/home/Partners';

export default function Home({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);

  return (
    <>
      <Hero />
      <Areas />
      <Portfolio />
      <About />
      <Ecosystem />
      <Partners />
    </>
  );
}
