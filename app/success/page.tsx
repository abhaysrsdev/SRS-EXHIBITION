'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { downloadVCF } from '@/lib/vcf';
import ContactModal from '@/components/ContactModal';

function SuccessInner() {
  const params = useSearchParams();
  const name = params.get('name') || 'Customer';
  const [contactType, setContactType] = useState<'shree' | 'radhika' | null>(null);

  const waMessage = encodeURIComponent(
    `Jai Shree Shyam 🙏\n\nI have successfully registered through the Shree Radha Studio Exhibition Registration page.\n\nPlease share your latest wholesale catalogue, exhibition details and new collection.`
  );
  
  const whatsappUrl = `https://wa.me/919811798507?text=${waMessage}`;

  return (
    <main className="page-shell" style={{ padding: '32px 16px' }}>
      <div className="card-wrap" style={{ position: 'relative', zIndex: 2 }}>

        {/* ── Welcome Message ── */}
        <div className="anim-1" style={{ textAlign: 'center', marginBottom: 24 }}>
          <h1 className="page-heading" style={{ fontSize: 24, marginBottom: 16 }}>
            <span className="text-gold-gradient">🙏 Jai Shree Shyam</span>
          </h1>
          <div className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
            <p style={{ fontSize: 16, color: 'var(--text-primary)', marginBottom: 12 }}>
              Dear <strong>{name}</strong>,
            </p>
            <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.6 }}>
              We are glad to have you onboard the SRS Family.
            </p>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6, marginTop: 12 }}>
              Please save our contact details below to receive our latest product catalogue, exhibition updates and wholesale collections.
            </p>
          </div>
        </div>

        {/* ── Save Contact Section ── */}
        <div className="anim-2" style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
          
          {/* Button 1: SRS */}
          <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ textAlign: 'center', marginBottom: 8 }}>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--text-primary)' }}>Shree Radha Studio Sales</div>
              <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Mobile: 9811798507</div>
            </div>
            
            <button
              onClick={(e) => { e.preventDefault(); setContactType('shree'); }}
              className="btn-outline"
            >
              SAVE SHREE RADHA STUDIO CONTACT
            </button>
            
            <div style={{ marginTop: 8, fontSize: 13, color: 'var(--text-muted)', textAlign: 'center' }}>
              <p>📍 New Post Office, 9/1112 Matke Wali Gali, Opposite Gandhi Nagar, Block 9, Delhi 110031</p>
              <a href="https://maps.google.com/?q=Shree+Radha+Studio,+New+post+office,+9/1112,+Matke+Wali+Gali,+opposite+Gandhi+Nagar,+Block+9,+Police+station,+Delhi,+110031" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold)', textDecoration: 'underline' }}>View on Google Maps</a>
            </div>
          </div>

          {/* Button 2: Radhika */}
          <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ textAlign: 'center', marginBottom: 8 }}>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--text-primary)' }}>Radhika Collection Pvt Ltd</div>
              <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Mobile: 9811798507</div>
            </div>
            
            <button
              onClick={(e) => { e.preventDefault(); setContactType('radhika'); }}
              className="btn-outline"
            >
              SAVE RADHIKA COLLECTION CONTACT
            </button>
            
            <div style={{ marginTop: 8, fontSize: 13, color: 'var(--text-muted)', textAlign: 'center' }}>
              <p>📍 4337/38, Bhairon Wali Gali, Jogiwada, Nai Sarak, Chandni Chowk, New Delhi, Delhi 110006</p>
              <a href="https://maps.google.com/?q=4337/38,+Bhairon+Wali+Gali,+Jogiwada,+Nai+Sarak,+Chandni+Chowk,+New+Delhi" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold)', textDecoration: 'underline' }}>View on Google Maps</a>
            </div>
          </div>

        </div>

        <div className="gold-divider-full anim-3" />

        {/* ── WhatsApp Section ── */}
        <div className="anim-4">
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-whatsapp" style={{ padding: '20px 24px', fontSize: 16 }}>
            MESSAGE US ON WHATSAPP
          </a>
        </div>

        <ContactModal type={contactType} onClose={() => setContactType(null)} />
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense>
      <SuccessInner />
    </Suspense>
  );
}
