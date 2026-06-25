import type { Metadata } from 'next';
import LeadForm from '@/components/LeadForm';

export const metadata: Metadata = {
  title: 'Exhibition Registration 2026 | Shree Radha Studio',
  description: 'Register and connect directly with our sales team.',
};

export default function HomePage() {
  return (
    <main className="page-shell">
      {/* ── Content ──────────────────────────────────────────────────────── */}
      <div className="card-wrap" style={{ position: 'relative', zIndex: 2 }}>
        
        {/* Header */}
        <header className="page-header anim-1">
          <div className="page-logo">
            SHREE RADHA STUDIO
          </div>
          <h1 className="page-heading">
            <span className="text-gold-gradient">Exhibition Registration 2026</span>
          </h1>
          <p className="page-subheading">
            Register and connect directly with our sales team.
          </p>
        </header>

        {/* Form Card */}
        <div className="reg-card glass-card anim-2">
          <LeadForm />
        </div>
        
      </div>
    </main>
  );
}
