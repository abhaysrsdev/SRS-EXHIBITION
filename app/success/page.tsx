import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle2, Download, MessageCircle, Sparkles } from 'lucide-react';
import { getWhatsAppUrl } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Thank You — Shree Radha Studio',
  description: 'Thank you for registering at Shree Radha Studio exhibition. Your catalogue is ready.',
};

export default function SuccessPage() {
  const whatsappUrl = getWhatsAppUrl();

  return (
    <main className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(139,26,74,0.15) 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 70% 20%, rgba(201,169,110,0.08) 0%, transparent 60%)',
        }}
      />

      <div className="relative max-w-lg w-full">
        {/* Success card */}
        <div className="glass-card p-8 sm:p-12 text-center animate-fade-in-up">
          {/* Animated check icon */}
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 animate-float"
            style={{
              background: 'linear-gradient(135deg, rgba(201,169,110,0.15), rgba(139,26,74,0.1))',
              border: '2px solid rgba(201,169,110,0.3)',
            }}
          >
            <CheckCircle2 size={52} style={{ color: 'var(--gold)' }} strokeWidth={1.5} />
          </div>

          {/* Title */}
          <div className="mb-2">
            <span
              className="inline-block text-xs font-semibold tracking-[0.25em] uppercase mb-3"
              style={{ color: 'var(--crimson-light)' }}
            >
              ✦ Registration Complete ✦
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-3">
            <span className="text-gold-gradient">Thank You</span>
            <br />
            <span style={{ color: 'var(--text-cream)' }}>for Visiting</span>
          </h1>
          <p className="text-xl font-semibold mb-1" style={{ color: 'var(--gold)' }}>
            Shree Radha Studio
          </p>

          <div className="gold-divider my-6" />

          <p className="text-base leading-relaxed mb-2" style={{ color: 'var(--text-cream)' }}>
            Your registration has been completed successfully.
          </p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Your catalogue download should have started automatically. If not, use the button below.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4 mt-8">
            <a
              id="download-catalogue-btn"
              href="/catalogue.pdf"
              download="Shree-Radha-Studio-Catalogue.pdf"
              className="btn-primary w-full justify-center text-base py-4"
            >
              <Download size={20} />
              Download Catalogue
            </a>

            <a
              id="whatsapp-success-btn"
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp w-full justify-center text-base py-4"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              Chat on WhatsApp
            </a>

            <Link
              href="/"
              className="btn-secondary w-full justify-center text-sm py-3"
              id="register-another-btn"
            >
              <Sparkles size={16} />
              Register Another Visitor
            </Link>
          </div>

          {/* Footer note */}
          <p className="text-xs mt-6" style={{ color: 'var(--text-muted)' }}>
            Our team will get in touch with you shortly
          </p>
        </div>
      </div>
    </main>
  );
}
