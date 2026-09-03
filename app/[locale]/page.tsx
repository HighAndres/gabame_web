import { setRequestLocale } from 'next-intl/server';
import { Hero } from '@/components/home/Hero';
import { Pharmacies } from '@/components/home/Pharmacies';
import { Areas } from '@/components/home/Areas';
import { HealthyEyes } from '@/components/home/HealthyEyes';
import { About } from '@/components/home/About';
import { Ecosystem } from '@/components/home/Ecosystem';

export default function Home({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);

  return (
    <>
      <Hero />
      <Pharmacies />
      <Areas />
      <HealthyEyes />
      <About />
      <Ecosystem />
    </>
  );
}
