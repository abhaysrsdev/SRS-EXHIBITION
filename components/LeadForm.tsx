     'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Loader2, Upload, MapPin, ScanLine, Sparkles, X } from 'lucide-react';
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
  highlighted,
}: {
  value: string;
  onChange: (v: string) => void;
  error?: string;
  highlighted?: boolean;
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
          className={`form-input ${error ? 'error' : ''} ${highlighted ? 'highlighted-field' : ''}`}
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

import { downloadVCF } from '@/lib/vcf';

export default function LeadForm({ onSuccess }: { onSuccess?: (name: string, city: string) => void } = {}) {
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [ocrStatus, setOcrStatus] = useState<'idle' | 'scanning' | 'done' | 'failed'>('idle');
  const [ocrFields, setOcrFields] = useState<Record<string, boolean>>({});
  const [ocrConfidence, setOcrConfidence] = useState<'high' | 'low' | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  // ── OCR ───────────────────────────────────────────────────────────────────
  const runOCR = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') return;
    setOcrStatus('scanning');
    setOcrFields({});
    setOcrConfidence(null);
    try {
      let base64Image = '';
      
      try {
        // Fast Client-side Compression
        const img = await createImageBitmap(file);
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 1500;
        let width = img.width;
        let height = img.height;
        if (width > height && width > MAX_SIZE) {
          height *= MAX_SIZE / width;
          width = MAX_SIZE;
        } else if (height > MAX_SIZE) {
          width *= MAX_SIZE / height;
          height = MAX_SIZE;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas not supported');
        
        ctx.filter = 'grayscale(100%) contrast(1.2)';
        ctx.drawImage(img, 0, 0, width, height);
        
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        base64Image = dataUrl.split(',')[1];
      } catch (imgErr) {
        // Fallback: If it's a PDF or createImageBitmap fails, just read it directly
        console.warn('Canvas compression failed, sending raw file', imgErr);
        base64Image = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            resolve(result.split(',')[1]);
          };
          reader.onerror = () => reject(new Error('File reading failed'));
          reader.readAsDataURL(file);
        });
      }
      
      const mimeType = file.type || 'image/jpeg';
      
      const res = await fetch('/api/ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64Image, mimeType })
      });
      
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `API Error: ${res.status}`);
      }
      const { data } = await res.json();
      
      const newFields: Record<string, boolean> = {};
      
      if (data.shop_name || data.business_name) {
        setValue('shop_name', data.shop_name || data.business_name, { shouldValidate: true });
        newFields.shop_name = true;
      }
      if (data.mobile) {
        setValue('mobile', data.mobile, { shouldValidate: true });
        newFields.mobile = true;
      }
      if (data.city) {
        setValue('city', data.city, { shouldValidate: true });
        newFields.city = true;
      }
      if (data.name || data.contact_person) {
        setValue('name', data.name || data.contact_person, { shouldValidate: true });
        newFields.name = true;
      }
      if (data.gst_number) {
        setValue('gst_number', data.gst_number, { shouldValidate: true });
        newFields.gst_number = true;
      }
      
      setOcrFields(newFields);
      setOcrConfidence(data.confidence_score);
      setOcrStatus('done');
      
      if (data.confidence_score === 'low') {
        toast('Please verify the highlighted fields.', { icon: '⚠️' });
      } else {
        toast.success('Card scanned successfully!');
      }
    } catch (err: any) {
      console.error(err);
      setOcrStatus('failed');
      toast.error(err.message || 'Could not read card automatically');
    }
  }, [setValue]);

  const handleFile = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const err = validateImageFile(file);
    if (err) { toast.error(err); return; }
    
    setFileToUpload(file);
    runOCR(file);
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    const toastId = toast.loading('Registering details…');
    try {
      let uploadedFiles: UploadedFile[] = [];
      if (fileToUpload) {
        try {
          const leadId = generateLeadId();
          const uf = await uploadFile(fileToUpload, 'visiting_card', leadId);
          uploadedFiles.push(uf);
        } catch (err) {
          console.error('File upload failed:', err);
          toast.error('File upload failed, but saving details...', { id: toastId });
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
          file_url: uploadedFiles.length > 0 ? uploadedFiles[0].url : '',
          uploaded_files: uploadedFiles.length > 0 ? uploadedFiles : null,
          lead_source: 'Website Registration',
          lead_status: 'New Lead'
        })
      });

      if (!res.ok) {
        throw new Error('Sync failed with status ' + res.status);
      }

      toast.success('Registration successful!', { id: toastId });
      setIsRegistered(true);
      setIsSubmitting(false);
      
      if (onSuccess) {
        onSuccess(data.name, data.city);
      }
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong. Please try again.', { id: toastId });
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
      
      {/* ── VISITING CARD UPLOAD ── */}
      <div className="field-group" style={{ marginBottom: 8 }}>
        <div
          className={`upload-zone ${isDragOver ? 'dragover' : ''}`}
          style={{ padding: '12px 8px' }}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragOver(false); handleFile(e.dataTransfer.files); }}
        >
          {ocrStatus === 'scanning' ? (
            <Loader2 size={24} style={{ margin: '0 auto 8px', color: 'var(--gold)', animation: 'spin 1s linear infinite' }} />
          ) : (
            <Upload size={24} style={{ margin: '0 auto 8px', color: 'var(--gold)' }} />
          )}
          <h3 className="upload-zone-title" style={{ fontSize: 14, marginBottom: 2 }}>📇 Upload Visiting Card (Optional)</h3>
          <p className="upload-zone-desc" style={{ fontSize: 12 }}>
            {ocrStatus === 'scanning' ? 'Reading Visiting Card...' : 'Upload for Quick Auto Fill'}
          </p>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
            Supported: JPG, PNG, JPEG, PDF
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,application/pdf"
            className="hidden"
            onChange={(e) => handleFile(e.target.files)}
          />
        </div>
        
        {fileToUpload && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(201,165,90,0.1)', padding: '10px 14px', borderRadius: 8, marginTop: 12, border: '1px solid rgba(201,165,90,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {ocrStatus === 'done' ? <Sparkles size={16} color="var(--gold)" /> : <ScanLine size={16} color="var(--gold)" />}
              <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>{fileToUpload.name}</span>
            </div>
            <button type="button" onClick={(e) => { e.stopPropagation(); setFileToUpload(null); setOcrStatus('idle'); }} style={{ background: 'transparent', border: 'none', color: 'var(--error-red)', cursor: 'pointer' }}>
              <X size={16} />
            </button>
          </div>
        )}
      </div>

      <div className="gold-divider-full" style={{ margin: '8px 0 8px 0' }} />

      {/* ── REQUIRED FIELDS ── */}
      <div className="field-group">
        <label htmlFor="shop_name" className="form-label">Business / Boutique Name</label>
        <input
          id="shop_name" type="text"
          className={`form-input ${errors.shop_name ? 'error' : ''} ${ocrFields.shop_name ? 'highlighted-field' : ''}`}
          {...register('shop_name')}
        />
        {errors.shop_name && <p className="form-error">{errors.shop_name.message}</p>}
      </div>

      <div className="field-group">
        <label htmlFor="mobile" className="form-label">Mobile Number</label>
        <input
          id="mobile" type="tel" maxLength={10} inputMode="numeric"
          className={`form-input ${errors.mobile ? 'error' : ''} ${ocrFields.mobile ? 'highlighted-field' : ''}`}
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
              highlighted={ocrFields.city}
            />
          )}
        />
        {errors.city && <p className="form-error">{errors.city.message}</p>}
      </div>

      <div className="field-group">
        <label htmlFor="name" className="form-label">Your Name</label>
        <input
          id="name" type="text"
          className={`form-input ${errors.name ? 'error' : ''} ${ocrFields.name ? 'highlighted-field' : ''}`}
          {...register('name')}
        />
        {errors.name && <p className="form-error">{errors.name.message}</p>}
      </div>

      <div className="field-group">
        <label htmlFor="gst_number" className="form-label">GST Number (Optional)</label>
        <input
          id="gst_number" type="text"
          className={`form-input ${errors.gst_number ? 'error' : ''} ${ocrFields.gst_number ? 'highlighted-field' : ''}`}
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
