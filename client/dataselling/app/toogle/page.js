'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Loader2, AlertCircle, CheckCircle2, ToggleLeft } from 'lucide-react';

const NETWORK_LABELS = {
  mtn: { name: 'MTN', dot: '#FFCB05' },
  ishare: { name: 'AT iShare', dot: '#ED1C24' },
  tigo: { name: 'Tigo', dot: '#0088CC' },
  telecel: { name: 'Telecel', dot: '#E60000' },
};

export default function NetworkToggle() {
  const [networks, setNetworks] = useState({ mtn: true, telecel: true, ishare: true });
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => { fetchStatus(); }, []);

  async function fetchStatus() {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const r = await axios.get('https://dataswap-ydgo.onrender.com/api/networks-availability', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (r.data?.success) setNetworks(r.data.networks);
      else setError('Failed to fetch network status.');
    } catch (err) {
      setError('Error connecting to server.');
    } finally {
      setLoading(false);
    }
  }

  async function toggle(network, available) {
    setBusy(network); setError(null); setSuccess(null);
    try {
      const token = localStorage.getItem('token');
      const r = await axios.post('https://dataswap-ydgo.onrender.com/api/toggle-network',
        { network, available },
        { headers: { Authorization: `Bearer ${token}` } });
      if (r.data?.success) {
        setNetworks(p => ({ ...p, [network]: available }));
        const label = NETWORK_LABELS[network]?.name || network.toUpperCase();
        setSuccess(`${label} is now ${available ? 'in stock' : 'out of stock'}.`);
        setTimeout(() => setSuccess(null), 2400);
      } else {
        setError(r.data?.error || 'Failed to update network status.');
      }
    } catch (_) {
      setError('Error connecting to server.');
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="bg-[var(--color-surface-muted)] min-h-[calc(100vh-4rem)] py-10">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-wider text-[var(--color-ink-subtle)]">Admin</p>
          <h1 className="mt-1 text-3xl font-black text-[var(--color-brand-navy)] inline-flex items-center gap-3">
            <ToggleLeft size={28} className="text-[var(--color-brand-blue-deep)]" />
            Network availability
          </h1>
          <p className="mt-1 text-[var(--color-ink-muted)]">Mark networks in or out of stock for customers.</p>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 mb-4 inline-flex items-center gap-2">
            <AlertCircle size={16} /> {error}
          </div>
        )}
        {success && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700 mb-4 inline-flex items-center gap-2">
            <CheckCircle2 size={16} /> {success}
          </div>
        )}

        {loading ? (
          <div className="card p-12 text-center">
            <Loader2 size={28} className="mx-auto animate-spin text-[var(--color-brand-blue)]" />
          </div>
        ) : (
          <div className="card divide-y divide-[var(--color-line)]">
            {Object.entries(networks).map(([net, isAvail]) => {
              const meta = NETWORK_LABELS[net] || { name: net.toUpperCase(), dot: '#94A0B8' };
              return (
                <div key={net} className="flex items-center justify-between p-5">
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: meta.dot }} />
                    <p className="font-semibold text-[var(--color-ink)]">{meta.name}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`chip ${isAvail ? 'chip-success' : 'chip-danger'}`}>
                      {isAvail ? 'In stock' : 'Out of stock'}
                    </span>
                    <button
                      onClick={() => toggle(net, !isAvail)}
                      disabled={busy === net}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 ${
                        isAvail
                          ? 'bg-red-600 hover:bg-red-700 text-white'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      }`}
                    >
                      {busy === net ? <Loader2 size={12} className="animate-spin inline" />
                                    : (isAvail ? 'Mark out of stock' : 'Mark in stock')}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
