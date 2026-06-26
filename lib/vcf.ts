export function downloadVCF(name: string, mobile: string, company?: string) {
  const vcfContent = `BEGIN:VCARD
VERSION:3.0
FN:${name}
${company ? `ORG:${company}` : ''}
TEL;TYPE=CELL:${mobile}
END:VCARD`;

  const blob = new Blob([vcfContent], { type: 'text/vcard' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `${name.replace(/\s+/g, '_')}.vcf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
