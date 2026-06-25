'use client';

import { useEffect, useState, useCallback } from 'react';
import { fetchAllLeads, searchLeads } from '@/lib/supabase';
import { formatDate } from '@/lib/utils';
import type { ExhibitionLead, UploadedFile } from '@/types';
import {
  Search,
  ChevronUp,
  ChevronDown,
  ExternalLink,
  RefreshCw,
  Users,
  ArrowUpDown,
} from 'lucide-react';

type SortKey = 'created_at' | 'name' | 'city' | 'shop_name';
type SortDir = 'asc' | 'desc';

export default function AdminLeadsClient() {
  const [leads, setLeads] = useState<ExhibitionLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('created_at');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [selectedLead, setSelectedLead] = useState<ExhibitionLead | null>(null);

  const loadLeads = useCallback(async (searchQuery = '') => {
    setLoading(true);
    setError(null);
    try {
      const data = searchQuery.trim()
        ? await searchLeads(searchQuery.trim())
        : await fetchAllLeads();
      setLeads(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load leads');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => loadLeads(query), 400);
    return () => clearTimeout(t);
  }, [query, loadLeads]);

  const sorted = [...leads].sort((a, b) => {
    const av = a[sortKey] ?? '';
    const bv = b[sortKey] ?? '';
    const cmp = String(av).localeCompare(String(bv));
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const SortIcon = ({ colKey }: { colKey: SortKey }) => {
    if (sortKey !== colKey) return <ArrowUpDown size={13} style={{ opacity: 0.4 }} />;
    return sortDir === 'asc' ? <ChevronUp size={13} /> : <ChevronDown size={13} />;
  };

  const getBadgeStyle = (type: string | null) => {
    const colors: Record<string, string> = {
      Wholesaler: 'rgba(201,169,110,0.2)',
      Retailer: 'rgba(37,211,102,0.15)',
      Distributor: 'rgba(99,102,241,0.2)',
      Other: 'rgba(157,133,117,0.15)',
    };
    return {
      background: colors[type ?? ''] ?? 'rgba(157,133,117,0.15)',
      color: type === 'Wholesaler' ? 'var(--gold)' : type === 'Retailer' ? '#25d366' : type === 'Distributor' ? '#818cf8' : 'var(--text-muted)',
      border: `1px solid ${colors[type ?? ''] ?? 'rgba(157,133,117,0.3)'}`,
      padding: '3px 10px',
      borderRadius: '100px',
      fontSize: '11px',
      fontWeight: 600,
    };
  };

  return (
    <div className="min-h-screen px-4 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(201,169,110,0.12)', border: '1px solid rgba(201,169,110,0.25)' }}
          >
            <Users size={20} style={{ color: 'var(--gold)' }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-shimmer">Exhibition Leads</h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Shree Radha Studio — Admin Panel
            </p>
          </div>
        </div>
        <div className="gold-divider" style={{ margin: '16px 0', marginLeft: '0' }} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Leads', value: leads.length },
          { label: 'With Files', value: leads.filter((l) => l.uploaded_files?.length).length },
          { label: 'Wholesalers', value: leads.filter((l) => l.business_type === 'Wholesaler').length },
          { label: 'Retailers', value: leads.filter((l) => l.business_type === 'Retailer').length },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="glass-card p-4 text-center"
          >
            <p className="text-2xl font-bold text-gold-gradient">{value}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Search + Refresh */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--text-muted)' }}
          />
          <input
            id="admin-search"
            type="text"
            placeholder="Search by name or mobile…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="form-input pl-10"
          />
        </div>
        <button
          id="admin-refresh-btn"
          onClick={() => loadLeads(query)}
          disabled={loading}
          className="btn-secondary gap-2 whitespace-nowrap"
          style={{ padding: '12px 20px' }}
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div
          className="rounded-xl p-4 mb-6 text-sm"
          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444' }}
        >
          ⚠️ {error}
        </div>
      )}

      {/* Table */}
      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div
              className="w-8 h-8 rounded-full border-2 animate-spin"
              style={{ borderColor: 'rgba(201,169,110,0.2)', borderTopColor: 'var(--gold)' }}
            />
          </div>
        ) : sorted.length === 0 ? (
          <div className="py-16 text-center" style={{ color: 'var(--text-muted)' }}>
            <Users size={40} className="mx-auto mb-3 opacity-30" />
            <p>No leads found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('name')}>
                    <span className="flex items-center gap-1">Name <SortIcon colKey="name" /></span>
                  </th>
                  <th>Mobile</th>
                  <th onClick={() => handleSort('city')}>
                    <span className="flex items-center gap-1">City <SortIcon colKey="city" /></span>
                  </th>
                  <th onClick={() => handleSort('shop_name')}>
                    <span className="flex items-center gap-1">Shop <SortIcon colKey="shop_name" /></span>
                  </th>
                  <th>Type</th>
                  <th>Files</th>
                  <th onClick={() => handleSort('created_at')}>
                    <span className="flex items-center gap-1">Date <SortIcon colKey="created_at" /></span>
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((lead) => (
                  <tr key={lead.id}>
                    <td>
                      <div className="font-semibold" style={{ color: 'var(--text-cream)' }}>
                        {lead.name}
                      </div>
                      {lead.state && (
                        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                          {lead.state}
                        </div>
                      )}
                    </td>
                    <td>
                      <a
                        href={`tel:${lead.mobile}`}
                        style={{ color: 'var(--gold)', textDecoration: 'none' }}
                        className="hover:underline"
                      >
                        {lead.mobile}
                      </a>
                    </td>
                    <td>{lead.city}</td>
                    <td>
                      <div className="max-w-[160px] truncate" title={lead.shop_name}>
                        {lead.shop_name}
                      </div>
                    </td>
                    <td>
                      {lead.business_type ? (
                        <span style={getBadgeStyle(lead.business_type)}>
                          {lead.business_type}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>—</span>
                      )}
                    </td>
                    <td>
                      {lead.uploaded_files?.length ? (
                        <button
                          onClick={() => setSelectedLead(lead)}
                          className="text-xs px-3 py-1 rounded-lg transition-colors"
                          style={{
                            background: 'rgba(201,169,110,0.1)',
                            color: 'var(--gold)',
                            border: '1px solid rgba(201,169,110,0.25)',
                            cursor: 'pointer',
                          }}
                        >
                          {lead.uploaded_files.length} file{lead.uploaded_files.length !== 1 ? 's' : ''}
                        </button>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>—</span>
                      )}
                    </td>
                    <td>
                      <span className="text-xs" style={{ color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                        {formatDate(lead.created_at)}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="p-2 rounded-lg transition-colors"
                        style={{ color: 'var(--text-muted)', cursor: 'pointer' }}
                        title="View Details"
                        aria-label="View lead details"
                      >
                        <ExternalLink size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-xs text-center mt-4" style={{ color: 'var(--text-muted)' }}>
        Showing {sorted.length} of {leads.length} leads
      </p>

      {/* ── Lead Detail Modal ────────────────────────────────────────── */}
      {selectedLead && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
          onClick={() => setSelectedLead(null)}
        >
          <div
            className="glass-card max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold" style={{ color: 'var(--text-cream)' }}>
                  {selectedLead.name}
                </h2>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  Registered on {formatDate(selectedLead.created_at)}
                </p>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="text-lg leading-none"
                style={{ color: 'var(--text-muted)', cursor: 'pointer', background: 'none', border: 'none', padding: '4px 8px' }}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <div className="gold-divider mb-6" style={{ margin: '0 0 24px 0' }} />

            <div className="grid grid-cols-2 gap-4 text-sm mb-6">
              {[
                ['Mobile', selectedLead.mobile],
                ['City', selectedLead.city],
                ['State', selectedLead.state || '—'],
                ['Shop Name', selectedLead.shop_name],
                ['Business Type', selectedLead.business_type || '—'],
                ['Product Code', selectedLead.product_code || '—'],
                ['Sales Order', selectedLead.sales_order_code || '—'],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--gold)', fontWeight: 600 }}>
                    {label}
                  </p>
                  <p style={{ color: 'var(--text-cream)' }}>{value}</p>
                </div>
              ))}
              {selectedLead.remarks && (
                <div className="col-span-2">
                  <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--gold)', fontWeight: 600 }}>
                    Remarks
                  </p>
                  <p style={{ color: 'var(--text-cream)' }}>{selectedLead.remarks}</p>
                </div>
              )}
            </div>

            {/* Files */}
            {selectedLead.uploaded_files && selectedLead.uploaded_files.length > 0 && (
              <div>
                <p
                  className="text-xs uppercase tracking-wider mb-3"
                  style={{ color: 'var(--gold)', fontWeight: 600 }}
                >
                  Uploaded Files ({selectedLead.uploaded_files.length})
                </p>
                <div className="space-y-2">
                  {(selectedLead.uploaded_files as UploadedFile[]).map((f, i) => (
                    <a
                      key={i}
                      href={f.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-lg px-4 py-3 transition-colors"
                      style={{
                        background: 'rgba(201,169,110,0.07)',
                        border: '1px solid rgba(201,169,110,0.15)',
                        textDecoration: 'none',
                        color: 'var(--gold)',
                      }}
                    >
                      <ExternalLink size={14} />
                      <span className="text-sm flex-1 truncate">{f.name}</span>
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {f.category.replace(/_/g, ' ')}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
