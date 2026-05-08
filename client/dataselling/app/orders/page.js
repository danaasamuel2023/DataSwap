'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Clock, CheckCircle2, XCircle, AlertCircle, Phone, Hash, Loader2,
  Receipt, Calendar, Wallet, Eye, Inbox,
} from 'lucide-react';

const STATUS_LOOKUP_API_KEY =
  process.env.NEXT_PUBLIC_DATAMART_STATUS_KEY ||
  'f9329bb51dd27c41fe3b85c7eb916a8e88821e07fd0565e1ff2558e7be3be7b4';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [modal, setModal] = useState({ open: false, data: null, loading: false, error: null, reference: '' });

  useEffect(() => {
    const u = localStorage.getItem('userId');
    if (!u) { setError('Please sign in to view your orders.'); setLoading(false); return; }
    fetchOrders(u);
  }, []);

  async function fetchOrders(userId) {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication token not found');
      const r = await axios.get(`https://dataswap-ydgo.onrender.com/api/data/user-orders/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (r.data?.success) setOrders(r.data.orders || []);
      else setError('Failed to load orders');
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  }

  async function checkOrderStatus(reference) {
    setModal({ open: true, data: null, loading: true, error: null, reference });
    try {
      const r = await axios.get(`https://datamartbackened.onrender.com/api/developer/order-status/${reference}`, {
        headers: { 'x-api-key': STATUS_LOOKUP_API_KEY },
      });
      if (r.data?.status === 'success') {
        setModal({ open: true, data: r.data.data, loading: false, error: null, reference });
      } else {
        setModal({ open: true, data: null, loading: false, error: 'Failed to fetch order status', reference });
      }
    } catch (err) {
      setModal({ open: true, data: null, loading: false, error: err.response?.data?.message || 'Failed to check order status', reference });
    }
  }

  const filtered = orders.filter(o => {
    if (filter === 'all') return true;
    if (filter === 'recent') {
      const d = new Date(o.createdAt);
      return (Date.now() - d.getTime()) / (1000 * 60 * 60 * 24) <= 7;
    }
    return true;
  });

  const totalSpent = orders.reduce((s, o) => s + (o.price || 0), 0);
  const recentCount = orders.filter(o => {
    const d = new Date(o.createdAt);
    return (Date.now() - d.getTime()) / (1000 * 60 * 60 * 24) <= 7;
  }).length;

  return (
    <div className="bg-[var(--color-surface-muted)] min-h-[calc(100vh-4rem)] py-10">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-black text-[var(--color-brand-navy)] inline-flex items-center gap-3">
              <Receipt size={28} className="text-[var(--color-brand-blue-deep)]" />
              Order history
            </h1>
            <p className="mt-1 text-[var(--color-ink-muted)]">Track every bundle you&rsquo;ve sent.</p>
          </div>
          <div className="flex items-center gap-2">
            <FilterPill active={filter === 'all'}    onClick={() => setFilter('all')}>All</FilterPill>
            <FilterPill active={filter === 'recent'} onClick={() => setFilter('recent')}>Recent (7d)</FilterPill>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatCard icon={<Receipt size={18} />} label="Total orders" value={orders.length} accent="blue" />
          <StatCard icon={<Calendar size={18} />} label="Last 7 days"  value={recentCount}    accent="orange" />
          <StatCard icon={<Wallet size={18} />}   label="Total spent"  value={`GHS ${totalSpent.toFixed(2)}`} accent="navy" />
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 inline-flex items-center gap-2 mb-4">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {/* List */}
        {loading ? (
          <div className="card p-10 text-center text-[var(--color-ink-muted)]">
            <Loader2 size={28} className="mx-auto animate-spin text-[var(--color-brand-blue)]" />
            <p className="mt-3">Loading orders…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="card p-10 text-center">
            <Inbox size={32} className="mx-auto text-[var(--color-ink-subtle)]" />
            <p className="mt-3 text-[var(--color-ink-muted)]">
              {filter === 'recent' ? 'No orders in the last 7 days.' : 'No orders yet.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((order) => <OrderCard key={order.id || order.reference} order={order} onCheck={checkOrderStatus} />)}
          </div>
        )}
      </div>

      {/* Status modal */}
      {modal.open && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-[var(--color-brand-navy)]/45 backdrop-blur-sm animate-fadeIn">
          <div className="card max-w-sm w-full p-6 text-center animate-scaleIn">
            {modal.loading && (
              <>
                <Loader2 size={36} className="mx-auto animate-spin text-[var(--color-brand-blue)]" />
                <p className="mt-4 text-[var(--color-ink-muted)]">Checking order status…</p>
              </>
            )}
            {modal.error && (
              <>
                <span className="w-12 h-12 mx-auto rounded-full bg-red-100 inline-flex items-center justify-center text-red-600">
                  <XCircle size={26} />
                </span>
                <p className="mt-3 font-semibold text-[var(--color-ink)]">Couldn&rsquo;t check status</p>
                <p className="mt-1 text-sm text-[var(--color-ink-muted)]">{modal.error}</p>
              </>
            )}
            {modal.data && (() => {
              const s = statusStyle(modal.data.orderStatus);
              return (
                <>
                  <span className={`w-14 h-14 mx-auto rounded-full inline-flex items-center justify-center ${s.bg} ${s.text}`}>
                    {s.icon}
                  </span>
                  <p className="mt-3 text-sm text-[var(--color-ink-muted)]">Order status</p>
                  <p className={`mt-1 inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${s.bg} ${s.text}`}>
                    {capitalize(modal.data.orderStatus)}
                  </p>
                  <p className="mt-3 text-[11px] text-[var(--color-ink-subtle)] font-mono break-all">Ref: {modal.reference}</p>
                </>
              );
            })()}
            <button onClick={() => setModal({ open: false, data: null, loading: false, error: null, reference: '' })}
                    className="btn-ghost w-full mt-5">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterPill({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-colors ${
        active
          ? 'bg-[var(--color-brand-blue-soft)] text-[var(--color-brand-blue-deep)] border-[rgba(30,136,255,.25)]'
          : 'bg-white text-[var(--color-ink-muted)] border-[var(--color-line)] hover:border-[var(--color-line-strong)]'
      }`}
    >
      {children}
    </button>
  );
}

function StatCard({ icon, label, value, accent }) {
  const styles = {
    blue:   { bg: 'bg-[var(--color-brand-blue-soft)]',   text: 'text-[var(--color-brand-blue-deep)]' },
    orange: { bg: 'bg-[var(--color-brand-orange-soft)]', text: 'text-[#B7480F]' },
    navy:   { bg: 'bg-[var(--color-surface-sunken)]',    text: 'text-[var(--color-brand-navy)]' },
  }[accent];
  return (
    <div className="card p-5 flex items-center justify-between">
      <div>
        <p className="text-xs uppercase tracking-wider text-[var(--color-ink-muted)]">{label}</p>
        <p className="mt-1 text-2xl font-black text-[var(--color-ink)]">{value}</p>
      </div>
      <span className={`w-10 h-10 rounded-lg inline-flex items-center justify-center ${styles.bg} ${styles.text}`}>
        {icon}
      </span>
    </div>
  );
}

function OrderCard({ order, onCheck }) {
  const s = statusStyle(order.status || 'pending');
  const net = networkStyle(order.network);

  return (
    <div className="card p-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4 flex-1">
          <span
            className="w-12 h-12 rounded-xl inline-flex items-center justify-center text-sm font-black shrink-0"
            style={{ background: net.bg, color: net.fg }}
          >
            {net.label}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-[var(--color-ink)]">{order.dataAmount}GB bundle</h3>
              <span className={`chip ${s.chip}`}>{capitalize(order.status || 'pending')}</span>
            </div>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-sm text-[var(--color-ink-muted)]">
              <span className="inline-flex items-center gap-1.5"><Phone size={13} /> {order.phoneNumber}</span>
              <span className="inline-flex items-center gap-1.5"><Clock size={13} /> {formatDate(order.createdAt)}</span>
              <span className="inline-flex items-center gap-1.5 truncate"><Hash size={13} /> <span className="font-mono text-xs truncate">{order.reference}</span></span>
              <span className="inline-flex items-center gap-1.5">{net.dot}{(order.network || '').toUpperCase()}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end md:self-auto">
          <div className="text-right">
            <p className="text-xs text-[var(--color-ink-muted)]">Amount</p>
            <p className="text-xl font-bold text-[var(--color-brand-navy)]">GHS {Number(order.price || 0).toFixed(2)}</p>
          </div>
          <button onClick={() => onCheck(order.reference)} className="btn-ghost text-sm !py-2 !px-3">
            <Eye size={14} /> Status
          </button>
        </div>
      </div>
    </div>
  );
}

// ── helpers ────────────────────────────────────────────────
function statusStyle(status) {
  switch ((status || '').toLowerCase()) {
    case 'completed': return { icon: <CheckCircle2 size={20} />, bg: 'bg-emerald-100', text: 'text-emerald-700', chip: 'chip-success' };
    case 'failed':    return { icon: <XCircle size={20} />,    bg: 'bg-red-100',     text: 'text-red-700',     chip: 'chip-danger' };
    case 'pending':   return { icon: <Clock size={20} />,      bg: 'bg-amber-100',   text: 'text-amber-700',   chip: 'chip-warn' };
    case 'processing':return { icon: <Loader2 size={20} className="animate-spin" />, bg: 'bg-sky-100', text: 'text-sky-700', chip: 'chip' };
    default:          return { icon: <AlertCircle size={20} />, bg: 'bg-slate-100',  text: 'text-slate-700',  chip: 'chip' };
  }
}

function networkStyle(network) {
  const u = (network || '').toUpperCase();
  if (u === 'YELLO' || u === 'MTN')         return { label: 'MTN', bg: '#FFF7D6', fg: '#7A5800', dot: <Dot color="#FFCB05" /> };
  if (u === 'AT' || u === 'AIRTELTIGO' || u === 'AT_PREMIUM') return { label: 'AT', bg: '#FFE5E5', fg: '#7A0000', dot: <Dot color="#ED1C24" /> };
  if (u === 'TELECEL')                       return { label: 'Tc', bg: '#FFE5E5', fg: '#7A0000', dot: <Dot color="#E60000" /> };
  return { label: (network || '??').slice(0, 2).toUpperCase(), bg: '#EEF2F8', fg: '#3B4A66', dot: <Dot color="#94A0B8" /> };
}

function Dot({ color }) {
  return <span className="inline-block w-2 h-2 rounded-full" style={{ background: color }} />;
}

function formatDate(s) {
  if (!s) return 'N/A';
  const d = new Date(s);
  const diffH = (Date.now() - d.getTime()) / (1000 * 60 * 60);
  if (diffH < 1) return `${Math.max(1, Math.floor(diffH * 60))} min ago`;
  if (diffH < 24) return `${Math.floor(diffH)} hr ago`;
  if (diffH < 168) {
    const dd = Math.floor(diffH / 24);
    return `${dd} day${dd > 1 ? 's' : ''} ago`;
  }
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function capitalize(s) {
  if (!s) return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
}
