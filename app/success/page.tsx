'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

// ─── VCF Generator ────────────────────────────────────────────────────────────

function downloadVCF(name: string, mobile: string, filename: string) {
  const vcf = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${name}`,
    `N:${name};;;;`,
    `TEL;TYPE=CELL:+${mobile}`,
    `ORG:${name}`,
    'END:VCARD',
  ].join('\r\n');

  const blob = new Blob([vcf], { type: 'text/vcard;charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ─── Inner (uses useSearchParams) ─────────────────────────────────────────────

function SuccessInner() {
  const params = useSearchParams();
  const name = params.get('name') || 'Customer';

  const waMessage = encodeURIComponent(
    `Jai Shree Shyam\n\nI have registered through the Shree Radha Studio Exhibition Registration page.\n\nPlease share your latest catalogue and collection.`
  );
  
  const radhikaWa = `https://wa.me/919811798507?text=${waMessage}`;
  const srsWa = `https://wa.me/919811798507?text=${waMessage}`;

  return (
    <main className="page-shell" style={{ padding: '32px 16px' }}>
      <div className="card-wrap" style={{ position: 'relative', zIndex: 2 }}>

        {/* ── Heading ── */}
        <div className="anim-1" style={{ textAlign: 'center', marginBottom: 24 }}>
          <h1 className="page-heading">
            <span className="text-gold-gradient">🙏 Jai Shree Shyam</span>
          </h1>
          <div className="glass-card" style={{ padding: '24px', marginTop: 16, textAlign: 'left' }}>
            <p style={{ fontSize: 15, color: 'var(--text-primary)', marginBottom: 12 }}>
              Dear <strong>{name}</strong>,
            </p>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>
              We are glad to have you on board the SRS Family.
            </p>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6, marginTop: 8 }}>
              Please save our contacts below to receive our latest product catalogue, exhibition updates, launches and wholesale collections.
            </p>
          </div>
        </div>

        {/* ── Save Contact Section ── */}
        <div className="anim-2">
          <h2 className="section-heading">Save Contact</h2>
          
          <div className="contact-card">
            <div className="contact-info">
              <div className="contact-name">Radhika Collection Pvt Ltd</div>
              <div className="contact-num">9811798507</div>
            </div>
            <button 
              className="contact-btn"
              onClick={() => downloadVCF('Radhika Collection Pvt Ltd', '919811798507', 'Radhika-Collection.vcf')}
            >
              SAVE RADHIKA CONTACT
            </button>
          </div>

          <div className="contact-card">
            <div className="contact-info">
              <div className="contact-name">Shree Radha Studio Sales</div>
              <div className="contact-num">9811798507</div>
            </div>
            <button 
              className="contact-btn"
              onClick={() => downloadVCF('Shree Radha Studio Sales', '919811798507', 'Shree-Radha-Studio-Sales.vcf')}
            >
              SAVE SRS CONTACT
            </button>
          </div>
        </div>

        <div className="gold-divider-full anim-3" />

        {/* ── WhatsApp Section ── */}
        <div className="anim-3">
          <h2 className="section-heading">Connect Instantly On WhatsApp</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <a href={radhikaWa} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
              MESSAGE RADHIKA COLLECTION
            </a>
            <a href={srsWa} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
              MESSAGE SHREE RADHA STUDIO
            </a>
          </div>
        </div>

        <div className="gold-divider-full anim-4" />

        {/* ── Information Section ── */}
        <div className="anim-4">
          <div className="info-grid">
            <a href="/catalogue.pdf" download="Shree-Radha-Catalogue.pdf" className="btn-outline">
              LATEST PRODUCT CATALOGUE
            </a>
            <button className="btn-outline">
              EXHIBITION DETAILS
            </button>
            <button className="btn-outline">
              REQUEST SALES CALL
            </button>
            <a href={srsWa} target="_blank" rel="noopener noreferrer" className="btn-outline">
              WHATSAPP SUPPORT
            </a>
          </div>
        </div>

      </div>
    </main>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────

export default function SuccessPage() {
  return (
    <Suspense>
      <SuccessInner />
    </Suspense>
  );
}
