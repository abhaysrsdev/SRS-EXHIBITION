export function downloadVCF(name: string, mobile: string, company?: string) {
  // Use the current URL dynamically so we don't hardcode a domain
  const websiteUrl = typeof window !== 'undefined' ? window.location.origin : '';

  let vcfContent = '';

  if (name === 'Radhika Collection') {
    vcfContent = `BEGIN:VCARD
VERSION:3.0
FN:Radhika Collection Pvt Ltd
ORG:Radhika Collection Pvt Ltd
item1.TEL:+919811798414
item1.X-ABLabel:Sales & Orders
item2.TEL:+919811798826
item2.X-ABLabel:Sales & Orders
item3.TEL:+919811798243
item3.X-ABLabel:Accounts
item4.TEL:+919811798802
item4.X-ABLabel:Accounts
item5.TEL:+919811798414
item5.X-ABLabel:WhatsApp
EMAIL;TYPE=WORK:shreeradhastudio@gmail.com
URL:${websiteUrl}
ADR;TYPE=WORK:;;4337/38\\, Bhairon Wali Gali\\, Jogiwada\\, Nai Sarak\\, Chandni Chowk;New Delhi;Delhi;110006;India
END:VCARD`;
  } else {
    vcfContent = `BEGIN:VCARD
VERSION:3.0
FN:Shree Radha Studio
ORG:Shree Radha Studio
item1.TEL:+919811798414
item1.X-ABLabel:Sales & Orders
item2.TEL:+919811798826
item2.X-ABLabel:Sales & Orders
item3.TEL:+919811798243
item3.X-ABLabel:Accounts
item4.TEL:+919811798802
item4.X-ABLabel:Accounts
item5.TEL:+919811798414
item5.X-ABLabel:WhatsApp
EMAIL;TYPE=WORK:shreeradhastudio@gmail.com
URL:${websiteUrl}
ADR;TYPE=WORK:;;Shree Radha Studio\\, New Post Office\\, 9/1112 Matke Wali Gali\\, Opposite Gandhi Nagar\\, Block 9;Delhi;;110031;India
END:VCARD`;
  }

  const blob = new Blob([vcfContent], { type: 'text/vcard' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = name === 'Radhika Collection' ? 'Radhika_Collection.vcf' : 'Shree_Radha_Studio.vcf';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
