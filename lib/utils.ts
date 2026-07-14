export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function generateLeadId(): string {
  return `lead_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function downloadCatalogue(): void {
  const link = document.createElement('a');
  link.href = '/catalogue.pdf';
  link.download = 'Shree-Radha-Studio-Catalogue.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function getWhatsAppUrl(firm: 'shree' | 'radhika' = 'shree'): string {
  if (firm === 'radhika') {
    const number = process.env.NEXT_PUBLIC_RADHIKA_WHATSAPP_NUMBER ?? '919811798281';
    const message =
      process.env.NEXT_PUBLIC_RADHIKA_WHATSAPP_MESSAGE ??
      'Hi%20I%20visited%20your%20Radhika%20Collection%20exhibition';
    return `https://wa.me/${number}?text=${message}`;
  }
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '919811798414';
  const message =
    process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE ??
    'Hi%20I%20visited%20your%20Shree%20Radha%20Studio%20exhibition';
  return `https://wa.me/${number}?text=${message}`;
}

export function validateImageFile(file: File): string | null {
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/heic',
    'application/pdf',
  ];
  const maxSize = 10 * 1024 * 1024; // 10 MB

  if (!allowedTypes.includes(file.type)) {
    return 'Only JPG, PNG, WEBP, HEIC, or PDF files are allowed';
  }
  if (file.size > maxSize) {
    return `File "${file.name}" exceeds 10 MB limit`;
  }
  return null;
}

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
