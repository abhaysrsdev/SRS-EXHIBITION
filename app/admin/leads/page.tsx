import type { Metadata } from 'next';
import AdminLeadsClient from './AdminLeadsClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Admin — Exhibition Leads | Shree Radha Studio',
  description: 'View and manage all exhibition leads for Shree Radha Studio.',
  robots: { index: false, follow: false },
};

export default function AdminLeadsPage() {
  return <AdminLeadsClient />;
}
