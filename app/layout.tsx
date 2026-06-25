import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Exhibition Visitor Registration — Shree Radha Studio',
  description:
    "Register for the Shree Radha Studio Exhibition. Connect with our sales team for exclusive bridal collections, catalogues and new launches.",
  keywords:
    'Shree Radha Studio, exhibition registration, bridal lehenga, luxury bridal wear, wholesale lehenga',
  openGraph: {
    title: 'Exhibition Visitor Registration — Shree Radha Studio',
    description:
      'Register now and connect with our sales team for product catalogues, exhibition updates and new launches.',
    type: 'website',
    locale: 'en_IN',
    siteName: 'Shree Radha Studio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Exhibition Visitor Registration — Shree Radha Studio',
    description: 'Register for the Shree Radha Studio Exhibition.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body style={{ background: '#000000' }}>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#111',
              color: '#E8D5B5',
              border: '1px solid rgba(201,165,90,0.3)',
              borderRadius: '12px',
              padding: '12px 20px',
              fontFamily: 'var(--font-inter), system-ui, sans-serif',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#C9A55A', secondary: '#000' } },
            error:   { iconTheme: { primary: '#ef4444', secondary: '#000' } },
          }}
        />
        {children}
      </body>
    </html>
  );
}
