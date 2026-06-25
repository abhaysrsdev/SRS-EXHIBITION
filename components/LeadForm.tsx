'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Loader2, Send, Upload, X, CreditCard } from 'lucide-react';
import { z } from 'zod';
import { uploadFile, insertLead } from '@/lib/supabase';
import { downloadCatalogue, generateLeadId, validateImageFile, formatFileSize } from '@/lib/utils';
import type { UploadedFile } from '@/types';

// ─── Simplified schema (customer-facing) ─────────────────────────────────────

const simpleSchema = z.object({
  name: z.string().min(2, 'Full name must be at least 2 characters').max(100),
  mobile: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
  city: z.string().min(2, 'City is required').max(100),
  shop_name: z.string().min(2, 'Shop / Boutique name is required').max(200),
});

type SimpleFormData = z.infer<typeof simpleSchema>;

interface CardFile {
  file: File;
  preview: string | null;
  id: string;
}

export default function LeadForm() {
  const router = useRouter();
  const [cards, setCards] = useState<CardFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SimpleFormData>({ resolver: zodResolver(simpleSchema) });

  // ── File handling ───────────────────────────────────────────────────────

  const addFiles = useCallback((fileList: FileList | null) => {
    if (!fileList) return;
    const added: CardFile[] = [];
    Array.from(fileList).forEach((file) => {
      const err = validateImageFile(file);
      if (err) { toast.error(err); return; }
      added.push({
        file,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
        id: `${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      });
    });
    setCards((prev) => [...prev, ...added]);
  }, []);

  const removeCard = (id: string) => {
    setCards((prev) => {
      const f = prev.find((c) => c.id === id);
      if (f?.preview) URL.revokeObjectURL(f.preview);
      return prev.filter((c) => c.id !== id);
    });
  };

  // ── Submit ──────────────────────────────────────────────────────────────

  const onSubmit = async (data: SimpleFormData) => {
    setIsSubmitting(true);
    const toastId = toast.loading('Saving your registration…');

    try {
      const leadId = generateLeadId();
      let uploadedFiles: UploadedFile[] = [];

      if (cards.length > 0) {
        toast.loading(`Uploading ${cards.length} file(s)…`, { id: toastId });
        uploadedFiles = await Promise.all(
          cards.map((c) => uploadFile(c.file, 'visiting_card', leadId))
        );
      }

      toast.loading('Saving your details…', { id: toastId });
      await insertLead({
        name: data.name,
        mobile: data.mobile,
        city: data.city,
        state: null,
        shop_name: data.shop_name,
        business_type: null,
        product_code: null,
        sales_order_code: null,
        remarks: null,
        uploaded_files: uploadedFiles.length > 0 ? uploadedFiles : null,
      });

      toast.success('Registered! Downloading catalogue…', { id: toastId });
      setTimeout(() => downloadCatalogue(), 500);
      setTimeout(() => router.push('/success'), 1000);
    } catch (err) {
      console.error(err);
      toast.error(
        err instanceof Error ? err.message : 'Something went wrong. Please try again.',
        { id: toastId }
      );
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="lead-form" noValidate>

      {/* ── Full Name ───────────────────────────────────────────────── */}
      <div className="field-group">
        <label htmlFor="name" className="form-label">Full Name *</label>
        <input
          id="name"
          type="text"
          autoComplete="name"
          placeholder="Your full name"
          className={`form-input ${errors.name ? 'error' : ''}`}
          {...register('name')}
        />
        {errors.name && <p className="form-error">{errors.name.message}</p>}
      </div>

      {/* ── Mobile ──────────────────────────────────────────────────── */}
      <div className="field-group">
        <label htmlFor="mobile" className="form-label">Mobile Number *</label>
        <input
          id="mobile"
          type="tel"
          autoComplete="tel"
          placeholder="10-digit mobile number"
          maxLength={10}
          className={`form-input ${errors.mobile ? 'error' : ''}`}
          {...register('mobile')}
        />
        {errors.mobile && <p className="form-error">{errors.mobile.message}</p>}
      </div>

      {/* ── City ────────────────────────────────────────────────────── */}
      <div className="field-group">
        <label htmlFor="city" className="form-label">City *</label>
        <input
          id="city"
          type="text"
          placeholder="Your city"
          className={`form-input ${errors.city ? 'error' : ''}`}
          {...register('city')}
        />
        {errors.city && <p className="form-error">{errors.city.message}</p>}
      </div>

      {/* ── Shop Name ───────────────────────────────────────────────── */}
      <div className="field-group">
        <label htmlFor="shop_name" className="form-label">Shop / Boutique Name *</label>
        <input
          id="shop_name"
          type="text"
          placeholder="Your shop or boutique name"
          className={`form-input ${errors.shop_name ? 'error' : ''}`}
          {...register('shop_name')}
        />
        {errors.shop_name && <p className="form-error">{errors.shop_name.message}</p>}
      </div>

      {/* ── Visiting Card Upload ─────────────────────────────────────── */}
      <div className="field-group">
        <label className="form-label">
          <CreditCard size={13} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
          Visiting Card
          <span style={{ color: 'var(--text-muted)', fontWeight: 400, marginLeft: 6, textTransform: 'none', letterSpacing: 0 }}>
            (optional)
          </span>
        </label>

        {/* Drop zone */}
        <div
          className={`upload-zone ${isDragOver ? 'dragover' : ''}`}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragOver(false); addFiles(e.dataTransfer.files); }}
        >
          <Upload size={22} style={{ color: 'var(--gold)', opacity: 0.8, margin: '0 auto 8px' }} />
          <p style={{ color: 'var(--gold)', fontSize: 13, fontWeight: 600 }}>
            Click or drag to upload
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: 11, marginTop: 4 }}>
            JPG, PNG, PDF — max 10 MB
          </p>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/*,application/pdf"
            className="hidden"
            id="visiting-card-upload"
            onChange={(e) => addFiles(e.target.files)}
          />
        </div>

        {/* Previews */}
        {cards.length > 0 && (
          <div className="card-previews">
            {cards.map((c) => (
              <div key={c.id} className="card-preview-item">
                {c.preview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.preview} alt={c.file.name} className="card-preview-img" />
                ) : (
                  <div className="card-preview-pdf">
                    <CreditCard size={22} style={{ color: 'var(--gold)', opacity: 0.7 }} />
                  </div>
                )}
                <div className="card-preview-info">
                  <span className="card-preview-name">{c.file.name}</span>
                  <span className="card-preview-size">{formatFileSize(c.file.size)}</span>
                </div>
                <button
                  type="button"
                  className="card-preview-remove"
                  onClick={() => removeCard(c.id)}
                  aria-label="Remove file"
                >
                  <X size={11} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Submit ──────────────────────────────────────────────────── */}
      <button
        id="submit-registration-btn"
        type="submit"
        disabled={isSubmitting}
        className="btn-primary w-full"
        style={{ padding: '15px 24px', fontSize: 16, marginTop: 8 }}
      >
        {isSubmitting ? (
          <><Loader2 size={19} className="animate-spin" /> Processing…</>
        ) : (
          <><Send size={19} /> Register &amp; Get Free Catalogue</>
        )}
      </button>

      <p style={{ textAlign: 'center', fontSize: 11, marginTop: 10, color: 'var(--text-muted)' }}>
        By registering you agree to receive updates from Shree Radha Studio
      </p>
    </form>
  );
}
