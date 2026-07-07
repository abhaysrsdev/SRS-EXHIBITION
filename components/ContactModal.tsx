import React from 'react';
import { downloadVCF } from '@/lib/vcf';

export default function ContactModal({ type, onClose }: { type: 'shree' | 'radhika' | null; onClose: () => void }) {
  if (!type) return null;

  const isRadhika = type === 'radhika';

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.7)', zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="glass-card" style={{ 
        width: '100%', maxWidth: '400px',
        padding: '24px', borderRadius: '20px', position: 'relative'
      }}>
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '20px', cursor: 'pointer' }}
        >
          ×
        </button>
        
        <h3 style={{ color: 'var(--gold)', fontSize: '18px', marginBottom: '16px', textAlign: 'center', fontWeight: 'bold' }}>
          Contact Preview
        </h3>
        
        <div style={{ color: 'var(--text-primary)', fontSize: '14px', lineHeight: '1.6', marginBottom: '24px', background: 'var(--black-deep)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-gold)' }}>
          <p><strong>Company:</strong> {isRadhika ? 'Radhika Collection Pvt Ltd' : 'Shree Radha Studio'}</p>
          <p><strong>Sales & Orders:</strong> 9811798414, 9811798826</p>
          <p><strong>Accounts:</strong> 9811798243, 9811798802</p>
          <p><strong>WhatsApp:</strong> 9811798414</p>
          <p><strong>Email:</strong> shreeradhastudio@gmail.com</p>
          <p><strong>Address:</strong> {isRadhika 
            ? '4337/38, Bhairon Wali Gali, Jogiwada, Nai Sarak, Chandni Chowk, New Delhi, Delhi 110006' 
            : 'New Post Office, 9/1112 Matke Wali Gali, Opposite Gandhi Nagar, Block 9, Delhi 110031'}
          </p>
        </div>

        <button 
          onClick={() => {
            downloadVCF(isRadhika ? 'Radhika Collection' : 'Shree Radha Studio', '9811798414');
            onClose();
          }} 
          className="btn-primary" 
          style={{ width: '100%' }}
        >
          SAVE TO CONTACTS
        </button>
      </div>
    </div>
  );
}
