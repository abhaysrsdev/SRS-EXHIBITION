'use client';

import { useState } from 'react';
import LeadForm from '@/components/LeadForm';
import { downloadVCF } from '@/lib/vcf';
import ContactModal from '@/components/ContactModal';

export default function LandingPageFull() {
  const [showGST, setShowGST] = useState(false);
  const [contactType, setContactType] = useState<'shree' | 'radhika' | null>(null);

  const waMessage = encodeURIComponent(
    `Jai Shree Shyam 🙏\n\nI have successfully registered through the Shree Radha Studio Exhibition Registration page.\n\nPlease share your latest wholesale catalogue and exhibition details.`
  );
  const whatsappUrl = `https://wa.me/919811798414?text=${waMessage}`;

  return (
    <main className="page-shell">
      <div className="card-wrap" style={{ position: 'relative', zIndex: 2 }}>
        
        {/* ==================================================
            1. HEADER
            ================================================== */}
        <header className="page-header anim-1" style={{ marginBottom: 12 }}>
          <div style={{
            width: '180px',
            height: '90px',
            margin: '0 auto 10px auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            borderRadius: '8px'
          }}>
            <img 
              src="/logo.jpg" 
              alt="Shree Radha Studio Logo" 
              style={{ 
                width: '180px',
                height: '180px',
                objectFit: 'contain'
              }} 
            />
          </div>
          <h1 
            className="page-heading"
            style={{
              fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif",
              fontWeight: 700,
              fontSize: '32px',
              letterSpacing: '-0.3px',
              lineHeight: 1.2,
              color: '#D4AF37',
              textAlign: 'center',
              marginBottom: '4px'
            }}
          >
            Customer Registration
          </h1>
        </header>

        {/* ==================================================
            WELCOME MESSAGE
            ================================================== */}
        <div className="glass-card anim-2" style={{ padding: '10px 12px', textAlign: 'center', marginBottom: 10 }}>
          <h2 style={{ fontSize: 18, fontWeight: 'bold', color: 'var(--gold)', marginBottom: 4 }}>🙏 Jai Shree Shyam</h2>
          <div style={{ color: 'var(--text-primary)', lineHeight: 1.45, fontSize: 14, margin: '0 auto' }}>
            <p style={{ marginBottom: 4 }}>Welcome to the SRS Family.</p>
            <p>Please save our contact details to receive our latest wholesale catalogues and exhibition updates.</p>
          </div>
        </div>

        {/* ==================================================
            2. SRS CONTACT
            ================================================== */}
        <div className="glass-card anim-2" style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: 10 }}>
          <div style={{ textAlign: 'center', marginBottom: 2 }}>
            <div style={{ fontSize: '15px', fontWeight: 'bold', color: 'var(--text-primary)' }}>Shree Radha Studio</div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Mobile: 9811798414</div>
          </div>
          
          <button onClick={(e) => { e.preventDefault(); setContactType('shree'); }} className="btn-outline" style={{ padding: '6px 12px', fontSize: '11px' }}>
            SAVE CONTACT
          </button>
          
          <div style={{ marginTop: 2, fontSize: 12, color: 'var(--text-muted)', textAlign: 'center' }}>
            <a href="https://maps.google.com/?q=4337/38,+Bhairon+Wali+Gali,+Jogiwada,+Nai+Sarak,+Chandni+Chowk,+New+Delhi" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold)', textDecoration: 'underline' }}>📍 View on Google Maps</a>
          </div>
        </div>

        {/* ==================================================
            3. RADHIKA CONTACT
            ================================================== */}
        <div className="glass-card anim-2" style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: 10 }}>
          <div style={{ textAlign: 'center', marginBottom: 2 }}>
            <div style={{ fontSize: '15px', fontWeight: 'bold', color: 'var(--text-primary)' }}>Radhika Collection Pvt Ltd</div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Mobile: 9811798414</div>
          </div>
          
          <button onClick={(e) => { e.preventDefault(); setContactType('radhika'); }} className="btn-outline" style={{ padding: '6px 12px', fontSize: '11px' }}>
            SAVE CONTACT
          </button>
          
          <div style={{ marginTop: 2, fontSize: 12, color: 'var(--text-muted)', textAlign: 'center' }}>
            <a href="https://maps.google.com/?q=Radhika+Collection+Pvt+Ltd,+Nai+Sarak,+Chandni+Chowk,+Delhi" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold)', textDecoration: 'underline' }}>📍 View on Google Maps</a>
          </div>
        </div>

        {/* ==================================================
            REGISTRATION FORM
            ================================================== */}
        <div className="reg-card glass-card anim-4" style={{ marginBottom: 16, marginTop: 0 }}>
          <LeadForm />
        </div>


        {/* ==================================================
            6. ALL OTHER INFORMATION (WhatsApp)
            ================================================== */}
        <div className="anim-5" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-whatsapp" style={{ padding: '20px 24px', fontSize: 16 }}>
            MESSAGE US ON WHATSAPP
          </a>

        </div>

        <ContactModal type={contactType} onClose={() => setContactType(null)} />
      </div>
    </main>
  );
}
