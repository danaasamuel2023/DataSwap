'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Wallet, CreditCard, ShieldCheck, ArrowRight, CheckCircle2,
  AlertCircle, Zap, Lock, Loader2, Info,
} from 'lucide-react';

const QUICK_AMOUNTS = [
  { value: 20,  popular: false },
  { value: 50,  popular: true  },
  { value: 100, popular: false },
  { value: 200, popular: false },
];

export default function Deposit() {
  const [userId, setUserId] = useState(null);
  const [email,  setEmail]  = useState('');
  const [amount, setAmount] = useState('');
  const [picked, setPicked] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    const u = localStorage.getItem('userId');
    const e = localStorage.getItem('email');
    if (u) setUserId(u);
    if (e) setEmail(e);
  }, []);

  const setQuick = (v) => { setAmount(String(v)); setPicked(v); setMessage({ text: '', type: '' }); };
  const setCustom = (e) => { setAmount(e.target.value); setPicked(null); setMessage({ text: '', type: '' }); };

  const submit = async () => {
    if (!userId) return setMessage({ text: 'Please sign in first.', type: 'error' });
    const v = parseFloat(amount);
    if (!amount || isNaN(v) || v <= 0) return setMessage({ text: 'Enter a valid amount.', type: 'error' });
    if (v < 10) return setMessage({ text: 'Minimum top-up is GHS 10.', type: 'error' });

    setLoading(true); setMessage({ text: '', type: '' });
    try {
      const r = await axios.post('https://dataswap-ydgo.onrender.com/api/wallet/add-funds', {
        userId, email, amount: v, paymentMethod: 'paystack',
      });
      if (r.data?.success) {
        if (r.data.authorizationUrl) {
          window.location.href = r.data.authorizationUrl;
          return;
        }
        setMessage({ text: r.data.message || 'Top-up successful.', type: 'success' });
        setAmount(''); setPicked(null);
      } else {
        setMessage({ text: r.data?.error || 'Top-up failed. Try again.', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: err.response?.data?.error || 'Top-up failed. Try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[var(--color-surface-muted)] min-h-[calc(100vh-4rem)] py-12">
      <div className="container mx-auto px-4 max-w-xl">
        <div className="text-center mb-8 animate-fadeInUp">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl brand-blue-gradient text-white shadow-md">
            <Wallet size={26} />
          </div>
          <h1 className="mt-4 text-3xl md:text-4xl font-black text-[var(--color-brand-navy)]">Top up wallet</h1>
          <p className="mt-2 text-[var(--color-ink-muted)]">Add funds to send data instantly.</p>
        </div>

        <div className="card p-6 sm:p-8">
          <div className="flex justify-center mb-6">
            <span className="chip">
              <ShieldCheck size={12} /> Secured by Paystack
              <Lock size={10} className="ml-1" />
            </span>
          </div>

          {/* Quick amounts */}
          <label className="label">Quick amounts</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5">
            {QUICK_AMOUNTS.map(q => {
              const active = picked === q.value;
              return (
                <button
                  key={q.value}
                  onClick={() => setQuick(q.value)}
                  className={`relative p-3 rounded-xl border transition-all text-sm font-semibold ${
                    active
                      ? 'border-[var(--color-brand-blue)] bg-[var(--color-brand-blue-soft)] text-[var(--color-brand-blue-deep)]'
                      : 'border-[var(--color-line)] hover:border-[var(--color-line-strong)] text-[var(--color-ink)]'
                  }`}
                >
                  {q.popular && (
                    <span className="absolute -top-2 -right-2 px-2 py-0.5 chip-orange chip !text-[10px]">Popular</span>
                  )}
                  GHS {q.value}
                </button>
              );
            })}
          </div>

          {/* Custom */}
          <label htmlFor="amount" className="label">Or enter a custom amount</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-[var(--color-brand-blue-deep)]">GHS</span>
            <input
              id="amount" type="number" inputMode="decimal" placeholder="0.00"
              value={amount} onChange={setCustom} className="input pl-14"
            />
          </div>
          <p className="mt-1.5 text-xs text-[var(--color-ink-muted)] inline-flex items-center gap-1">
            <Info size={12} /> Minimum top-up: GHS 10.00
          </p>

          {amount && parseFloat(amount) > 0 && (
            <div className="mt-5 flex items-center justify-between p-4 rounded-xl bg-[var(--color-brand-blue-soft)] border border-[rgba(30,136,255,.18)]">
              <span className="text-sm text-[var(--color-brand-blue-deep)]">You&rsquo;ll add</span>
              <span className="text-2xl font-black text-[var(--color-brand-navy)]">GHS {parseFloat(amount).toFixed(2)}</span>
            </div>
          )}

          <button onClick={submit} disabled={loading} className="btn-primary mt-6 w-full !py-3.5 disabled:opacity-60">
            {loading ? (<><Loader2 size={18} className="animate-spin" /> Processing…</>)
                     : (<><CreditCard size={18} /> Continue to payment <ArrowRight size={18} /></>)}
          </button>

          {message.text && (
            <div className={`mt-5 rounded-xl border p-3 text-sm inline-flex items-center gap-2 w-full ${
              message.type === 'success'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                : 'border-red-200 bg-red-50 text-red-700'
            }`}>
              {message.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              {message.text}
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-[var(--color-line)] text-center">
            <p className="text-[11px] uppercase tracking-wider text-[var(--color-ink-subtle)] mb-3">Accepted</p>
            <div className="flex items-center justify-center gap-3">
              <span className="px-3 py-1.5 rounded-md border border-[var(--color-line)] text-xs font-semibold text-[var(--color-ink)]">Card</span>
              <span className="px-3 py-1.5 rounded-md border border-[var(--color-line)] text-xs font-semibold text-[var(--color-ink)]">Mobile Money</span>
              <span className="px-3 py-1.5 rounded-md bg-[#0E2C5C] text-white text-xs font-semibold">Paystack</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6">
          {[
            [<ShieldCheck key="s" size={18} />, 'SSL secured'],
            [<Zap key="z" size={18} />,         'Instant credit'],
            [<CheckCircle2 key="c" size={18} />, '24/7 support'],
          ].map(([icon, label], i) => (
            <div key={label} className="card p-4 text-center">
              <span className="inline-flex w-9 h-9 rounded-lg bg-[var(--color-brand-blue-soft)] text-[var(--color-brand-blue-deep)] items-center justify-center">{icon}</span>
              <p className="mt-2 text-xs text-[var(--color-ink-muted)]">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
