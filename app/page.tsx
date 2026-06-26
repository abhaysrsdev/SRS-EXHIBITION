import type { Metadata } from 'next';
import LandingPageFull from '@/components/LandingPageFull';

export const metadata: Metadata = {
  title: 'Exhibition Registration 2026 | Shree Radha Studio',
  description: 'Register and connect directly with our sales team.',
};

export default function HomePage() {
  return <LandingPageFull />;
}
