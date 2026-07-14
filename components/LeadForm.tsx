'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Loader2, Upload, MapPin, X, Image as ImageIcon } from 'lucide-react';
import { z } from 'zod';
import { uploadFile, insertLead } from '@/lib/supabase';
import { generateLeadId, validateImageFile } from '@/lib/utils';
import type { UploadedFile } from '@/types';

// ─── Indian Cities ────────────────────────────────────────────────────────────

const INDIAN_CITIES = [
  'Agra','Ahmedabad','Ajmer','Aligarh','Allahabad','Amritsar','Aurangabad',
  'Bareilly','Bengaluru','Bhopal','Bhubaneswar','Chandigarh','Chennai',
  'Coimbatore','Cuttack','Dehradun','Delhi','Durgapur','Faridabad',
  'Ghaziabad','Gurgaon','Guwahati','Gwalior','Hyderabad','Indore',
  'Jabalpur','Jaipur','Jalandhar','Jammu','Jodhpur','Kanpur','Kochi',
  'Kolkata','Kota','Kozhikode','Lucknow','Ludhiana','Madurai','Mangaluru',
  'Meerut','Mumbai','Mysuru','Nagpur','Nashik','Navi Mumbai','Noida',
  'Patna','Pune','Raipur','Rajkot','Ranchi','Salem','Siliguri',
  'Srinagar','Surat','Thane','Thiruvananthapuram','Tiruchirappalli',
  'Udaipur','Vadodara','Varanasi','Vijayawada','Visakhapatnam',
];

// ─── Zod Schema ───────────────────────────────────────────────────────────────

const schema = z.object({
  name:      z.string().min(2, 'Name must be at least 2 characters').max(100),
  mobile:    z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
  shop_name: z.string().min(2, 'Business / Boutique name is required').max(200),
  city:      z.string().min(2, 'City is required').max(100),
  gst_number: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

// ─── City Dropdown ────────────────────────────────────────────────────────────

function CityDropdown({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  const [query, setQuery] = useState(value || '');
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(-1);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = query.length < 1
    ? INDIAN_CITIES.slice(0, 40)
    : INDIAN_CITIES.filter((c) => c.toLowerCase().includes(query.toLowerCase())).slice(0, 20);

  const showCustom =
    query.length >= 2 && !INDIAN_CITIES.some((c) => c.toLowerCase() === query.toLowerCase());

  const select = (city: string) => {
    setQuery(city);
    onChange(city);
    setOpen(false);
    setFocused(-1);
  };

  useEffect(() => {
    if (value && value !== query) { setQuery(value); }
  }, [value]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const allOptions = [
    ...filtered,
    ...(showCustom ? [`Use "${query}"`] : []),
  ];

  const handleKey = (e: React.KeyboardEvent) => {
    if (!open) { if (e.key === 'ArrowDown') setOpen(true); return; }
    if (e.key === 'ArrowDown') setFocused((p) => Math.min(p + 1, allOptions.length - 1));
    else if (e.key === 'ArrowUp') setFocused((p) => Math.max(p - 1, 0));
    else if (e.key === 'Enter') {
      e.preventDefault();
      if (focused >= 0 && allOptions[focused]) {
        const opt = allOptions[focused];
        select(opt.startsWith('Use "') ? query : opt);
      }
    } else if (e.key === 'Escape') setOpen(false);
  };

  return (
    <div className="city-wrap" ref={wrapRef}>
      <div style={{ position: 'relative' }}>
        <input
          ref={inputRef}
          id="city"
          type="text"
          autoComplete="off"
          placeholder="Select City"
          value={query}
          className={`form-input ${error ? 'error' : ''}`}
          style={{ paddingRight: 40 }}
          onChange={(e) => {
            setQuery(e.target.value);
            onChange(e.target.value);
            setOpen(true);
            setFocused(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKey}
        />
        <MapPin
          size={16}
          style={{
            position: 'absolute', right: 14, top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--gold)', pointerEvents: 'none',
          }}
        />
      </div>
      {open && (
        <div className="city-dropdown">
          {allOptions.length === 0 && (
            <div className="city-option" style={{ cursor: 'default', color: 'var(--text-muted)' }}>
              No cities found
            </div>
          )}
          {filtered.map((city, i) => (
            <div
              key={city}
              className={`city-option ${i === focused ? 'focused' : ''}`}
              onMouseDown={() => select(city)}
              onMouseEnter={() => setFocused(i)}
            >
              {city}
            </div>
          ))}
          {showCustom && (
            <div
              className={`city-option custom ${allOptions.length - 1 === focused ? 'focused' : ''}`}
              onMouseDown={() => select(query)}
              onMouseEnter={() => setFocused(allOptions.length - 1)}
            >
              Other / Enter Manually: "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Form ────────────────────────────────────────────────────────────────

export default function LeadForm({ onSuccess }: { onSuccess?: (name: string, city: string) => void } = {}) {
  const [frontCard, setFrontCard] = useState<File | null>(null);
  const [backCard, setBackCard] = useState<File | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const validateAndSetFile = (file: File, setter: React.Dispatch<React.SetStateAction<File | null>>) => {
    const err = validateImageFile(file);
    if (err) { toast.error(err); return; }
    // 5MB limit check
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5 MB');
      return;
    }
    setter(file);
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    const toastId = toast.loading('Registering details…');
    try {
      let uploadedFiles: UploadedFile[] = [];
      const leadId = generateLeadId();

      if (frontCard) {
        try {
          const uf = await uploadFile(frontCard, 'visiting_card', leadId + '_front');
          uf.category = 'front_card'; // Force category to match new enum
          uploadedFiles.push(uf);
        } catch (err) {
          console.error('Front file upload failed:', err);
          toast.error('Front file upload failed, but saving details...', { id: toastId });
        }
      }

      if (backCard) {
        try {
          const uf = await uploadFile(backCard, 'visiting_card', leadId + '_back');
          uf.category = 'back_card'; // Force category to match new enum
          uploadedFiles.push(uf);
        } catch (err) {
          console.error('Back file upload failed:', err);
          toast.error('Back file upload failed, but saving details...', { id: toastId });
        }
      }

      // Trigger combined Supabase + Google Sheets sync
      const res = await fetch('/api/leads/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timestamp: new Date().toLocaleString(),
          name: data.name,
          mobile: data.mobile,
          city: data.city,
          shop_name: data.shop_name,
          gst_number: data.gst_number || '',
          uploaded_files: uploadedFiles.length > 0 ? uploadedFiles : null,
          lead_source: 'Website Registration',
          lead_status: 'New Lead'
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || errData.error || 'Sync failed with status ' + res.status);
      }

      toast.success('Registration successful!', { id: toastId });
      setIsRegistered(true);
      setIsSubmitting(false);
      
      if (onSuccess) {
        onSuccess(data.name, data.city);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Something went wrong. Please try again.', { id: toastId });
      setIsSubmitting(false);
    }
  };

  if (isRegistered) {
    return (
      <div style={{ textAlign: 'center', padding: '24px 16px', color: 'var(--success-green)' }}>
        <h3 style={{ fontSize: 20, marginBottom: 8 }}>✅ Registration Successful!</h3>
        <p style={{ color: 'var(--text-muted)' }}>Thank you for sharing your details.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="lead-form" noValidate>
      
      {/* ── VISITING CARD UPLOAD SECTION ── */}
      <div className="field-group" style={{ marginBottom: 8 }}>
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <h2 style={{ fontSize: 18, color: 'var(--gold-dark)', fontWeight: 600 }}>📇 Upload Visiting Card</h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
            Please upload clear photos of your visiting card.<br />
            These images will be securely stored for future reference.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
          
          {/* Front Card Upload */}
          <UploadCard 
            title="📷 FRONT SIDE"
            buttonText="Upload Front Side"
            file={frontCard}
            onFileSelect={(f) => validateAndSetFile(f, setFrontCard)}
            onRemove={() => setFrontCard(null)}
          />

          {/* Back Card Upload */}
          <UploadCard 
            title="📷 BACK SIDE (OPTIONAL)"
            buttonText="Upload Back Side"
            file={backCard}
            onFileSelect={(f) => validateAndSetFile(f, setBackCard)}
            onRemove={() => setBackCard(null)}
          />
          
        </div>
      </div>

      <div className="gold-divider-full" style={{ margin: '8px 0 8px 0' }} />

      {/* ── REQUIRED FIELDS ── */}
      <div className="field-group">
        <label htmlFor="shop_name" className="form-label">Business / Boutique Name</label>
        <input
          id="shop_name" type="text"
          className={`form-input ${errors.shop_name ? 'error' : ''}`}
          {...register('shop_name')}
        />
        {errors.shop_name && <p className="form-error">{errors.shop_name.message}</p>}
      </div>

      <div className="field-group">
        <label htmlFor="mobile" className="form-label">Mobile Number</label>
        <input
          id="mobile" type="tel" maxLength={10} inputMode="numeric"
          className={`form-input ${errors.mobile ? 'error' : ''}`}
          {...register('mobile')}
        />
        {errors.mobile && <p className="form-error">{errors.mobile.message}</p>}
      </div>

      <div className="field-group">
        <label htmlFor="city" className="form-label">City</label>
        <Controller
          name="city"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <CityDropdown
              value={field.value}
              onChange={field.onChange}
              error={errors.city?.message}
            />
          )}
        />
        {errors.city && <p className="form-error">{errors.city.message}</p>}
      </div>

      <div className="field-group">
        <label htmlFor="name" className="form-label">Your Name</label>
        <input
          id="name" type="text"
          className={`form-input ${errors.name ? 'error' : ''}`}
          {...register('name')}
        />
        {errors.name && <p className="form-error">{errors.name.message}</p>}
      </div>

      <div className="field-group">
        <label htmlFor="gst_number" className="form-label">GST Number (Optional)</label>
        <input
          id="gst_number" type="text"
          className={`form-input ${errors.gst_number ? 'error' : ''}`}
          {...register('gst_number')}
          style={{ textTransform: 'uppercase' }}
        />
        {errors.gst_number && <p className="form-error">{errors.gst_number.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary"
        style={{ marginTop: 12 }}
      >
        {isSubmitting ? (
          <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Processing…</>
        ) : (
          'REGISTER NOW'
        )}
      </button>

    </form>
  );
}

// ─── Upload Card Component ────────────────────────────────────────────────────

function UploadCard({
  title,
  buttonText,
  file,
  onFileSelect,
  onRemove
}: {
  title: string;
  buttonText: string;
  file: File | null;
  onFileSelect: (f: File) => void;
  onRemove: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  
  // Create object URL for preview if file is an image
  const [preview, setPreview] = useState<string | null>(null);
  useEffect(() => {
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreview(null);
  }, [file]);

  return (
    <div style={{ background: '#FAF7F2', borderRadius: '12px', border: '1px solid var(--border-gold)', padding: '16px' }}>
      <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)', marginBottom: 12 }}>{title}</div>
      
      {!file ? (
        <div
          className={`upload-zone ${isDragOver ? 'dragover' : ''}`}
          style={{ padding: '20px 12px', background: '#FFF' }}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragOver(false); if (e.dataTransfer.files?.length) onFileSelect(e.dataTransfer.files[0]); }}
        >
          <Upload size={20} style={{ margin: '0 auto 8px', color: 'var(--gold)' }} />
          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--gold-dark)' }}>{buttonText}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>JPG, JPEG, PNG, PDF (Max 5MB)</div>
        </div>
      ) : (
        <div style={{ background: '#FFF', borderRadius: '8px', border: '1px solid var(--border-gold)', padding: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 6, background: '#F5F5F5', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {preview ? (
                <img src={preview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <ImageIcon size={20} color="var(--text-muted)" />
              )}
            </div>
            
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {file.name}
              </div>
              <div style={{ fontSize: 11, color: 'var(--success-green)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                ✅ Uploaded
              </div>
            </div>
            
            <button type="button" onClick={onRemove} style={{ padding: 4, background: 'transparent', border: 'none', color: 'var(--error-red)', cursor: 'pointer', flexShrink: 0 }} aria-label="Remove image">
              <X size={18} />
            </button>
          </div>
          
          <div style={{ marginTop: 12, textAlign: 'center' }}>
            <button type="button" onClick={() => fileInputRef.current?.click()} style={{ fontSize: 12, color: 'var(--gold-dark)', background: 'transparent', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
              Replace Image
            </button>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
        style={{ display: 'none' }}
        onChange={(e) => { if (e.target.files?.length) onFileSelect(e.target.files[0]); }}
      />
    </div>
  );
}
