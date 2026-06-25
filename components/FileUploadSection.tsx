'use client';

import { useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import { Upload, X, FileText, ImageIcon, Shield } from 'lucide-react';
import { validateImageFile, formatFileSize } from '@/lib/utils';

export interface CategorizedFile {
  file: File;
  preview: string | null;
  category: 'visiting_card' | 'shop_photo' | 'gst_certificate';
  id: string;
}

interface FileUploadSectionProps {
  files: CategorizedFile[];
  onChange: (files: CategorizedFile[]) => void;
}

const CATEGORIES = [
  {
    key: 'visiting_card' as const,
    label: 'Visiting Card',
    icon: FileText,
    hint: 'Business / Visiting Card',
  },
  {
    key: 'shop_photo' as const,
    label: 'Shop Photo',
    icon: ImageIcon,
    hint: 'Photo of your shop or showroom',
  },
  {
    key: 'gst_certificate' as const,
    label: 'GST Certificate',
    icon: Shield,
    hint: 'GST registration document',
  },
];

export default function FileUploadSection({ files, onChange }: FileUploadSectionProps) {
  const [dragCategory, setDragCategory] = useState<string | null>(null);
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const addFiles = useCallback(
    (newFiles: FileList | null, category: CategorizedFile['category']) => {
      if (!newFiles) return;
      const added: CategorizedFile[] = [];

      Array.from(newFiles).forEach((file) => {
        const err = validateImageFile(file);
        if (err) {
          alert(err);
          return;
        }
        const isImage = file.type.startsWith('image/');
        added.push({
          file,
          preview: isImage ? URL.createObjectURL(file) : null,
          category,
          id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        });
      });

      onChange([...files, ...added]);
    },
    [files, onChange]
  );

  const removeFile = (id: string) => {
    const removed = files.find((f) => f.id === id);
    if (removed?.preview) URL.revokeObjectURL(removed.preview);
    onChange(files.filter((f) => f.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {CATEGORIES.map(({ key, label, icon: Icon, hint }) => (
          <div key={key} className="flex flex-col gap-3">
            <div
              className={`upload-zone ${dragCategory === key ? 'dragover' : ''}`}
              onClick={() => inputRefs.current[key]?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragCategory(key);
              }}
              onDragLeave={() => setDragCategory(null)}
              onDrop={(e) => {
                e.preventDefault();
                setDragCategory(null);
                addFiles(e.dataTransfer.files, key);
              }}
            >
              <Icon
                className="mx-auto mb-2"
                style={{ color: 'var(--gold)', opacity: 0.8 }}
                size={28}
              />
              <p className="text-sm font-semibold" style={{ color: 'var(--gold)' }}>
                {label}
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                {hint}
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                Click or drag to upload
              </p>
              <input
                ref={(el) => { inputRefs.current[key] = el; }}
                type="file"
                multiple
                accept="image/*,application/pdf"
                className="hidden"
                id={`file-upload-${key}`}
                onChange={(e) => addFiles(e.target.files, key)}
              />
            </div>

            {/* Previews for this category */}
            {files
              .filter((f) => f.category === key)
              .map((f) => (
                <div
                  key={f.id}
                  className="relative rounded-xl overflow-hidden border"
                  style={{ borderColor: 'rgba(201,169,110,0.2)', background: 'rgba(10,6,8,0.6)' }}
                >
                  {f.preview ? (
                    <div className="relative h-28 w-full">
                      <Image
                        src={f.preview}
                        alt={f.file.name}
                        fill
                        className="object-cover"
                        sizes="200px"
                      />
                    </div>
                  ) : (
                    <div
                      className="h-28 flex items-center justify-center"
                      style={{ background: 'rgba(201,169,110,0.05)' }}
                    >
                      <FileText size={36} style={{ color: 'var(--gold)', opacity: 0.6 }} />
                    </div>
                  )}
                  <div className="p-2">
                    <p
                      className="text-xs truncate font-medium"
                      style={{ color: 'var(--text-cream)' }}
                    >
                      {f.file.name}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {formatFileSize(f.file.size)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(f.id)}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-600 flex items-center justify-center hover:bg-red-500 transition-colors"
                    aria-label="Remove file"
                  >
                    <X size={12} color="white" />
                  </button>
                </div>
              ))}
          </div>
        ))}
      </div>

      {files.length > 0 && (
        <div
          className="flex items-center gap-2 text-sm rounded-lg px-4 py-3"
          style={{
            background: 'rgba(201,169,110,0.08)',
            border: '1px solid rgba(201,169,110,0.2)',
          }}
        >
          <Upload size={16} style={{ color: 'var(--gold)' }} />
          <span style={{ color: 'var(--gold)' }}>
            {files.length} file{files.length !== 1 ? 's' : ''} ready to upload
          </span>
        </div>
      )}
    </div>
  );
}
