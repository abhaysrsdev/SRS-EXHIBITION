import type { Metadata } from 'next';
import LeadForm from '@/components/LeadForm';
import { CheckCircle2, Star, Truck, Award, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Shree Radha Studio — Exhibition Registration | Luxury Bridal Collection',
  description:
    "Register at Shree Radha Studio's exclusive exhibition. Discover our luxury bridal lehenga collection. Scan QR & register to download our catalogue.",
  keywords:
    'Shree Radha Studio, bridal lehenga, luxury bridal wear, exhibition, wholesale lehenga',
  openGraph: {
    title: 'Shree Radha Studio — Exclusive Exhibition',
    description:
      'Register at our exclusive exhibition and get instant access to our latest bridal collection catalogue.',
    type: 'website',
    locale: 'en_IN',
    siteName: 'Shree Radha Studio',
  },
};

const BENEFITS = [
  { icon: Star, text: 'Exclusive bridal & lehenga designs' },
  { icon: Award, text: 'Premium fabric & craftsmanship' },
  { icon: Truck, text: 'Pan India wholesale delivery' },
  { icon: CheckCircle2, text: 'Instant catalogue on registration' },
];

export default function HomePage() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* ── Background ─────────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 20% 50%, rgba(139,26,74,0.18) 0%, transparent 65%),' +
            'radial-gradient(ellipse 60% 50% at 90% 20%, rgba(201,169,110,0.1) 0%, transparent 60%),' +
            'radial-gradient(ellipse 40% 40% at 60% 90%, rgba(139,26,74,0.07) 0%, transparent 60%)',
        }}
      />

      {/* ── Max-width wrapper ────────────────────────────────────────── */}
      <div className="page-wrapper">
        {/* ── Top badge bar ───────────────────────────────────────────── */}
        <div className="top-badge-bar animate-fade-in-up">
          <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg,transparent,rgba(201,169,110,0.4))' }} />
          <span className="badge badge-gold whitespace-nowrap">✦ Exclusive Exhibition 2026 ✦</span>
          <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg,rgba(201,169,110,0.4),transparent)' }} />
        </div>

        {/* ── Two-Column Layout ───────────────────────────────────────── */}
        <div className="two-col-grid">

          {/* ══ LEFT COLUMN — Branding ════════════════════════════════ */}
          <div className="left-col animate-fade-in-up">

            {/* Brand name */}
            <div className="brand-block">
              <span className="brand-est">✦ Est. 2010 ✦</span>
              <h1 className="brand-name">
                <span className="text-shimmer">Shree Radha</span>
                <br />
                <span className="brand-studio">Studio</span>
              </h1>
              <div className="gold-divider" style={{ margin: '20px 0' }} />
              <p className="brand-tagline">Latest Collection</p>
              <p className="brand-subtitle">Exhibition Registration 2026</p>
            </div>

            {/* Exhibition banner card */}
            <div className="expo-banner animate-fade-in-up-delay-1">
              <div className="expo-banner-inner">
                <Sparkles size={20} style={{ color: 'var(--gold)' }} />
                <div>
                  <p className="expo-banner-title">Luxury Bridal &amp; Lehenga</p>
                  <p className="expo-banner-desc">
                    Explore our exclusive 2026 collection — handcrafted designer lehengas,
                    bridal sets &amp; embroidered sarees.
                  </p>
                </div>
              </div>
            </div>

            {/* Benefits list */}
            <ul className="benefits-list animate-fade-in-up-delay-2">
              {BENEFITS.map(({ icon: Icon, text }) => (
                <li key={text} className="benefit-item">
                  <div className="benefit-icon">
                    <Icon size={16} style={{ color: 'var(--gold)' }} />
                  </div>
                  <span>{text}</span>
                </li>
              ))}
            </ul>

            {/* Decorative bottom */}
            <div className="left-footer animate-fade-in-up-delay-3">
              <div className="ornament-line">
                <span style={{ color: 'var(--gold)', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                  Register &amp; Download Catalogue
                </span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 8, textAlign: 'center' }}>
                Fill the form on the right to get your free catalogue instantly
              </p>
            </div>
          </div>

          {/* ══ RIGHT COLUMN — Form ═══════════════════════════════════ */}
          <div className="right-col animate-fade-in-up-delay-1">
            <div className="form-card glass-card">
              <div className="form-card-header">
                <h2 className="form-card-title">Complete Registration</h2>
                <p className="form-card-desc">
                  Fill your details below — catalogue downloads instantly on submit
                </p>
                <div className="gold-divider" style={{ marginTop: 16 }} />
              </div>

              <LeadForm />
            </div>

            <p className="form-footer-note">
              🔒 Your information is secure and never shared with third parties
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
