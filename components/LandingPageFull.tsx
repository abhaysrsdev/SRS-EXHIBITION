'use client';

import { useState } from 'react';
import LeadForm from '@/components/LeadForm';
import { downloadVCF } from '@/lib/vcf';

export default function LandingPageFull() {
  const [showGST, setShowGST] = useState(false);

  const waMessage = encodeURIComponent(
    `Jai Shree Shyam 🙏\n\nI have successfully registered through the Shree Radha Studio Exhibition Registration page.\n\nPlease share your latest wholesale catalogue and exhibition details.`
  );
  const whatsappUrl = `https://wa.me/919811798507?text=${waMessage}`;

  return (
    <main className="page-shell">
      <div className="card-wrap" style={{ position: 'relative', zIndex: 2 }}>
        
        {/* ==================================================
            1. HEADER
            ================================================== */}
        <header className="page-header anim-1">
          <div className="page-logo">SHREE RADHA STUDIO</div>
          <h1 className="page-heading">
            <span className="text-gold-gradient">Exhibition Visitor Registration</span>
          </h1>
          <p className="page-subheading" style={{ marginBottom: 24 }}>
            Register your details to connect with our sales team and receive our latest wholesale catalogue, exhibition updates and new launches.
          </p>
        </header>

        {/* ==================================================
            2. RADHIKA CONTACT
            ================================================== */}
        <div className="glass-card anim-2" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: 16 }}>
          <div style={{ textAlign: 'center', marginBottom: 8 }}>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--text-primary)' }}>Radhika Collection Pvt Ltd</div>
            <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Mobile: 9811798507</div>
          </div>
          
          <button onClick={() => downloadVCF('Radhika Collection Pvt Ltd', '9811798507')} className="btn-outline">
            SAVE RADHIKA COLLECTION CONTACT
          </button>
          
          <div style={{ marginTop: 8, fontSize: 13, color: 'var(--text-muted)', textAlign: 'center' }}>
            <p>📍 Business Address: Nai Sarak, Chandni Chowk, Delhi</p>
            <a href="https://maps.google.com/?q=Radhika+Collection+Pvt+Ltd,+Nai+Sarak,+Chandni+Chowk,+Delhi" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold)', textDecoration: 'underline' }}>Google Maps Location</a>
          </div>
        </div>

        {/* ==================================================
            3. SRS CONTACT
            ================================================== */}
        <div className="glass-card anim-2" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: 16 }}>
          <div style={{ textAlign: 'center', marginBottom: 8 }}>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--text-primary)' }}>Shree Radha Studio Sales</div>
            <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Mobile: 9811798507</div>
          </div>
          
          <button onClick={() => downloadVCF('Shree Radha Studio Sales', '9811798507')} className="btn-outline">
            SAVE SHREE RADHA STUDIO CONTACT
          </button>
          
          <div style={{ marginTop: 8, fontSize: 13, color: 'var(--text-muted)', textAlign: 'center' }}>
            <p>📍 Business Address: Gandhi Nagar, New Delhi</p>
            <a href="https://maps.google.com/?q=Gandhi+Nagar,+New+Delhi" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold)', textDecoration: 'underline' }}>Google Maps Location</a>
          </div>
        </div>

        {/* ==================================================
            4. WELCOME MESSAGE
            ================================================== */}
        <div className="glass-card anim-3" style={{ padding: '24px', textAlign: 'center', marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, color: 'var(--gold)', marginBottom: 12 }}>🙏 Jai Shree Shyam</h2>
          <div style={{ color: 'var(--text-primary)', lineHeight: 1.6 }}>
            <p>We are glad to have you onboard the SRS Family.</p>
            <p style={{ marginTop: 8 }}>
              Please save our contact details to receive our latest product catalogue, exhibition updates and wholesale collections.
            </p>
          </div>
        </div>

        <div className="gold-divider-full anim-3" style={{ margin: '24px 0' }} />

        {/* ==================================================
            5. VISITING CARD & REGISTRATION FORM
            ================================================== */}
        <div className="reg-card glass-card anim-4" style={{ marginBottom: 24 }}>
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

      </div>
    </main>
  );
}
