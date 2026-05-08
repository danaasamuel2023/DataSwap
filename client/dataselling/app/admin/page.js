'use client';

import { Fragment, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Loader2, RefreshCw, Users as UsersIcon, ToggleLeft, Search,
  ChevronDown, AlertCircle, CheckCircle2,
} from 'lucide-react';

const STATUSES = ['pending', 'processing', 'completed', 'failed'];

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updates, setUpdates] = useState({});
  const [expanded, setExpanded] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => { fetchOrders(); }, []);

  async function fetchOrders() {
    try {
      setLoading(true);
      const r = await fetch('https://dataswap-ydgo.onrender.com/api/orders', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (!r.ok) throw new Error('Failed to fetch orders');
      const data = await r.json();
      setOrders(data);
      const init = {};
      data.forEach(o => { init[o._id] = { status: o.status, loading: false, message: '' }; });
      setUpdates(init);
    } catch (err) {
      setError(err.message || 'Error fetching orders');
    } finally {
      setLoading(false);
    }
  }

  function setRowStatus(id, status) {
    setUpdates(p => ({ ...p, [id]: { ...p[id], status } }));
  }

  async function applyStatus(id) {
    try {
      setUpdates(p => ({ ...p, [id]: { ...p[id], loading: true, message: '' } }));
      const r = await fetch(`https://dataswap-ydgo.onrender.com/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ status: updates[id].status }),
      });
      if (!r.ok) {
        const err = await r.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to update');
      }
      const { order } = await r.json();
      setOrders(prev => prev.map(o => o._id === id ? order : o));
      setUpdates(p => ({ ...p, [id]: { ...p[id], loading: false, message: 'Updated' } }));
      setTimeout(() => setUpdates(p => ({ ...p, [id]: { ...p[id], message: '' } })), 2400);
    } catch (err) {
      setUpdates(p => ({ ...p, [id]: { ...p[id], loading: false, message: `Error: ${err.message}` } }));
    }
  }

  const filtered = orders.filter(o => {
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (o.phoneNumber || '').toLowerCase().includes(q) ||
      (o._id || '').toLowerCase().includes(q) ||
      (o.userId?.email || '').toLowerCase().includes(q) ||
      (o.userId?.name || '').toLowerCase().includes(q) ||
      (o.reference || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="bg-[var(--color-surface-muted)] min-h-[calc(100vh-4rem)] py-10">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-xs uppercase tracking-wider text-[var(--color-ink-subtle)]">Admin</p>
            <h1 className="mt-1 text-3xl font-black text-[var(--color-brand-navy)]">Orders management</h1>
            <p className="mt-1 text-[var(--color-ink-muted)]">View and update every order in the system.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={() => router.push('/toogle')} className="btn-ghost text-sm">
              <ToggleLeft size={16} /> Network toggle
            </button>
            <button onClick={() => router.push('/users')} className="btn-ghost text-sm">
              <UsersIcon size={16} /> Users
            </button>
            <button onClick={fetchOrders} className="btn-primary text-sm !py-2 !px-3">
              <RefreshCw size={16} /> Refresh
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="card p-4 mb-4 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-subtle)]" />
            <input
              value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by user, phone, reference, or order ID…"
              className="input pl-9"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto">
            {['all', ...STATUSES].map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-colors capitalize whitespace-nowrap ${
                  statusFilter === s
                    ? 'bg-[var(--color-brand-blue-soft)] text-[var(--color-brand-blue-deep)] border-[rgba(30,136,255,.25)]'
                    : 'bg-white text-[var(--color-ink-muted)] border-[var(--color-line)] hover:border-[var(--color-line-strong)]'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        {loading ? (
          <div className="card p-12 text-center">
            <Loader2 size={28} className="mx-auto animate-spin text-[var(--color-brand-blue)]" />
            <p className="mt-3 text-[var(--color-ink-muted)]">Loading orders…</p>
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 inline-flex items-center gap-2">
            <AlertCircle size={16} /> {error}
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-[var(--color-surface-muted)] text-[var(--color-ink-muted)] text-xs uppercase tracking-wider">
                    {['Order', 'User', 'Network', 'Phone', 'Data', 'Price', 'Date', 'Status', 'Actions'].map(h => (
                      <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-line)]">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="px-4 py-8 text-center text-[var(--color-ink-muted)]">
                        No orders match.
                      </td>
                    </tr>
                  ) : filtered.map(order => (
                    <Fragment key={order._id}>
                      <tr className="hover:bg-[var(--color-surface-muted)]/60 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs text-[var(--color-ink)]">{order._id.substring(0, 8)}…</td>
                        <td className="px-4 py-3">
                          {order.userId ? (
                            <div>
                              <p className="font-semibold text-[var(--color-ink)]">{order.userId.name}</p>
                              <p className="text-xs text-[var(--color-ink-muted)]">{order.userId.email}</p>
                            </div>
                          ) : (
                            <span className="text-[var(--color-ink-subtle)]">Unknown user</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-[var(--color-ink)]">
                          {formatNetwork(order.network)}
                          {order.network === 'afa-registration' && (
                            <button
                              onClick={() => setExpanded(e => e === order._id ? null : order._id)}
                              className="ml-2 text-xs text-[var(--color-brand-blue-deep)] hover:underline inline-flex items-center gap-0.5"
                            >
                              <ChevronDown size={12} className={`transition-transform ${expanded === order._id ? 'rotate-180' : ''}`} />
                              {expanded === order._id ? 'Hide' : 'Details'}
                            </button>
                          )}
                        </td>
                        <td className="px-4 py-3 text-[var(--color-ink)]">{order.phoneNumber}</td>
                        <td className="px-4 py-3 text-[var(--color-ink)]">
                          {order.network === 'afa-registration' ? 'N/A' : `${order.dataAmount / 1000} GB`}
                        </td>
                        <td className="px-4 py-3 font-semibold text-[var(--color-brand-navy)]">GHS {Number(order.price).toFixed(2)}</td>
                        <td className="px-4 py-3 text-[var(--color-ink-muted)] whitespace-nowrap">{formatDate(order.createdAt)}</td>
                        <td className="px-4 py-3"><StatusChip status={order.status} /></td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <select
                              value={updates[order._id]?.status || order.status}
                              onChange={(e) => setRowStatus(order._id, e.target.value)}
                              className="input !py-1.5 !px-2 !text-xs w-32"
                            >
                              {STATUSES.map(s => <option key={s} value={s}>{capitalize(s)}</option>)}
                            </select>
                            <button
                              onClick={() => applyStatus(order._id)}
                              disabled={updates[order._id]?.loading || updates[order._id]?.status === order.status}
                              className="btn-primary !py-1.5 !px-3 !text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {updates[order._id]?.loading ? <Loader2 size={12} className="animate-spin" /> : 'Update'}
                            </button>
                            {updates[order._id]?.message && (
                              <span className={`text-xs font-medium inline-flex items-center gap-1 ${
                                updates[order._id].message.startsWith('Error')
                                  ? 'text-[var(--color-danger)]' : 'text-emerald-600'
                              }`}>
                                {!updates[order._id].message.startsWith('Error') && <CheckCircle2 size={12} />}
                                {updates[order._id].message}
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>

                      {order.network === 'afa-registration' && expanded === order._id && (
                        <tr>
                          <td colSpan="9" className="px-4 py-4 bg-[var(--color-surface-muted)]">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <Detail label="Full name"     value={order.fullName} />
                              <Detail label="ID type"       value={order.idType} />
                              <Detail label="ID number"     value={order.idNumber} />
                              <Detail label="Date of birth" value={formatDate(order.dateOfBirth)} />
                              <Detail label="Occupation"    value={order.occupation} />
                              <Detail label="Location"      value={order.location} />
                              {order.status === 'completed' && <Detail label="Completed at" value={formatDate(order.completedAt)} />}
                              {order.status === 'failed' && <Detail label="Failure reason" value={order.failureReason || 'No reason provided'} valueClass="text-[var(--color-danger)]" />}
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusChip({ status }) {
  const map = {
    pending:    'chip chip-warn',
    processing: 'chip',
    completed:  'chip chip-success',
    failed:     'chip chip-danger',
  };
  return <span className={`${map[status] || 'chip'} capitalize`}>{status}</span>;
}

function Detail({ label, value, valueClass = '' }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wider text-[var(--color-ink-subtle)]">{label}</p>
      <p className={`text-sm font-medium text-[var(--color-ink)] ${valueClass}`}>{value || 'N/A'}</p>
    </div>
  );
}

function formatNetwork(n) {
  if (!n) return 'N/A';
  if (n === 'mtn') return 'MTN';
  if (n === 'at')  return 'AirtelTigo';
  if (n === 'AT_PREMIUM') return 'AT Premium';
  if (n === 'TELECEL') return 'Telecel';
  if (n === 'afa-registration') return 'AFA Registration';
  return capitalize(n);
}

function formatDate(s) {
  if (!s) return 'N/A';
  const d = new Date(s);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function capitalize(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; }
