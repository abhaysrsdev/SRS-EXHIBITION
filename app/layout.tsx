import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import WhatsAppButton from '@/components/WhatsAppButton';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Shree Radha Studio — Exhibition Registration | Luxury Bridal Collection',
  description:
    'Register at Shree Radha Studio\'s exclusive exhibition. Discover our luxury bridal lehenga collection. Scan QR & register to download our catalogue.',
  keywords:
    'Shree Radha Studio, bridal lehenga, luxury bridal wear, exhibition, wholesale lehenga, bridal collection',
  openGraph: {
    title: 'Shree Radha Studio — Exclusive Exhibition',
    description:
      'Register at our exclusive exhibition and get instant access to our latest bridal collection catalogue.',
    type: 'website',
    locale: 'en_IN',
    siteName: 'Shree Radha Studio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shree Radha Studio — Exhibition Registration',
    description: 'Luxury bridal lehenga collection. Register now to download our catalogue.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-[#0a0608] text-white antialiased">
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1a0f14',
              color: '#f5e6d3',
              border: '1px solid #8b1a4a',
              borderRadius: '12px',
              padding: '12px 20px',
              fontFamily: 'var(--font-inter)',
            },
            success: { iconTheme: { primary: '#c9a96e', secondary: '#0a0608' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#0a0608' } },
          }}
        />
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}
