'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Smartphone, ChevronDown, ShoppingCart, ArrowRight, AlertCircle,
  CheckCircle2, XCircle, Clock, Loader2, ShieldCheck, Wallet,
} from 'lucide-react';

/**
 * Reusable purchase screen for MTN / AT / Telecel.
 *
 * config: {
 *   id: 'mtn' | 'at' | 'telecel',
 *   title: 'MTN Data Bundles',
 *   subtitle: 'Non-expiry bundles, delivered within minutes.',
 *   network: 'mtn' | 'AT_PREMIUM' | 'TELECEL',   // server enum
 *   availabilityKey: 'mtn' | 'ishare' | 'telecel',
 *   accent: { dot, soft, text, ring, button },   // hex colors
 *   bundles: [{ capacity, mb, price, network }],
 *   phonePattern: RegExp,
 *   phoneHint: '024XXXXXXX, 054XXXXXXX, etc.',
 *   phoneError: 'Enter a valid MTN number',
 *   logoLabel: 'MTN',
 *   logoBg: '#FFCB05',
 *   logoFg: '#0A1628',
 * }
 */
export default function BundlePurchaseScreen({ config }) {
  const c = config;

  const [bundle, setBundle] = useState(null);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [userId, setUserId] = useState(null);
  const [availability, setAvailability] = useState({ mtn: true, ishare: true, telecel: true });
  const [checkingAvail, setCheckingAvail] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pending, setPending] = useState(null);
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [success, setSuccess] = useState({ phone: '', cap: '', ref: '' });
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const u = localStorage.getItem('userId');
    if (u) setUserId(u);
    fetchAvailability();
  }, []); // eslint-disable-line

  const inStock = availability[c.availabilityKey];

  async function fetchAvailability() {
    try {
      setCheckingAvail(true);
      const r = await axios.get('https://dataswap-ydgo.onrender.com/api/networks-availability');
      if (r.data?.success) setAvailability(r.data.networks);
    } catch (_) {} finally {
      setCheckingAvail(false);
    }
  }

  const validatePhone = (n) => c.phonePattern.test(n.trim());

  const initiate = () => {
    setMessage({ text: '', type: '' });

    if (!inStock) {
      setMessage({ text: `${c.title.replace(' Data Bundles', '')} bundles are out of stock right now.`, type: 'error' });
      setErrorOpen(true); return;
    }
    if (!bundle) {
      setMessage({ text: 'Pick a data bundle first.', type: 'error' });
      setErrorOpen(true); return;
    }
    if (!phone.trim()) {
      setMessage({ text: 'Enter the recipient phone number.', type: 'error' });
      setErrorOpen(true); return;
    }
    if (!validatePhone(phone)) {
      setMessage({ text: c.phoneError, type: 'error' });
      setErrorOpen(true); return;
    }
    if (!userId) {
      setMessage({ text: 'Please sign in to purchase.', type: 'error' });
      setErrorOpen(true); return;
    }
    setPending(bundle);
    setConfirmOpen(true);
  };

  const purchase = async () => {
    if (!pending) return;
    setLoading(true);
    try {
      await fetchAvailability();
      if (!availability[c.availabilityKey]) {
        setMessage({ text: 'Just went out of stock — please try again later.', type: 'error' });
        setConfirmOpen(false); setErrorOpen(true); setLoading(false); return;
      }
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication token missing');

      const reference = `DATA-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
      const res = await axios.post(
        'https://dataswap-ydgo.onrender.com/api/data/process-data-order',
        {
          userId,
          phoneNumber: phone.trim(),
          network: c.network,
          dataAmount: parseFloat(pending.mb) / 1000,
          price: parseFloat(pending.price),
          reference,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data?.success) {
        setSuccess({ phone: phone.trim(), cap: pending.capacity, ref: reference });
        setBundle(null); setPhone('');
        setSuccessOpen(true);
      } else {
        setMessage({ text: res.data?.error || 'Failed to process order.', type: 'error' });
        setErrorOpen(true);
      }
    } catch (err) {
      setMessage({
        text: err.response?.data?.error || err.message || 'Failed to purchase bundle.',
        type: 'error',
      });
      setErrorOpen(true);
    } finally {
      setLoading(false);
      setConfirmOpen(false);
      setPending(null);
    }
  };

  return (
    <div className="bg-[var(--color-surface-muted)] min-h-[calc(100vh-4rem)] py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8 animate-fadeInUp">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl text-lg font-black mb-4 shadow-md"
               style={{ background: c.logoBg, color: c.logoFg }}>
            {c.logoLabel}
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-[var(--color-brand-navy)]">{c.title}</h1>
          <p className="mt-2 text-[var(--color-ink-muted)]">{c.subtitle}</p>
        </div>

        {/* Stock badge */}
        <div className="card flex items-center justify-between p-4 mb-6">
          <div className="flex items-center gap-3">
            <span className={`w-2.5 h-2.5 rounded-full ${inStock ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
            <span className="text-sm text-[var(--color-ink-muted)]">Network status</span>
          </div>
          <span className={`text-sm font-semibold ${inStock ? 'text-emerald-600' : 'text-[var(--color-danger)]'}`}>
            {checkingAvail ? 'Checking…' : (inStock ? 'In stock' : 'Out of stock')}
          </span>
        </div>

        {/* Main card */}
        <div className="card p-6 sm:p-8">
          {checkingAvail ? (
            <div className="flex items-center justify-center py-16 gap-3 text-[var(--color-ink-muted)]">
              <Loader2 size={20} className="animate-spin" /> Checking availability…
            </div>
          ) : (
            <>
              {/* Bundle dropdown */}
              <div>
                <label className="label">Choose bundle</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setDropdownOpen(v => !v)}
                    disabled={!inStock}
                    className={`input flex items-center justify-between text-left disabled:opacity-50 disabled:cursor-not-allowed ${bundle ? 'font-semibold' : ''}`}
                  >
                    <span className="inline-flex items-center gap-2">
                      {bundle ? (
                        <>
                          <span className="w-7 h-7 rounded-md inline-flex items-center justify-center text-xs font-black"
                                style={{ background: c.accent.soft, color: c.accent.text }}>
                            {bundle.capacity}
                          </span>
                          <span className="text-[var(--color-ink)]">{bundle.capacity}GB</span>
                          <span className="text-[var(--color-ink-muted)]">&middot; GHS {bundle.price}</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart size={16} className="text-[var(--color-ink-subtle)]" />
                          <span className="text-[var(--color-ink-muted)]">Select a bundle…</span>
                        </>
                      )}
                    </span>
                    <ChevronDown size={18} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''} text-[var(--color-ink-muted)]`} />
                  </button>

                  {dropdownOpen && inStock && (
                    <div className="absolute left-0 right-0 top-full mt-2 z-20 card p-1 max-h-80 overflow-y-auto animate-scaleIn">
                      {c.bundles.map((b, i) => (
                        <button
                          key={i}
                          onClick={() => { setBundle(b); setDropdownOpen(false); }}
                          className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-[var(--color-surface-muted)]"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-9 h-9 rounded-lg inline-flex items-center justify-center text-sm font-black"
                                  style={{ background: c.accent.soft, color: c.accent.text }}>
                              {b.capacity}
                            </span>
                            <div className="text-left">
                              <p className="text-sm font-semibold text-[var(--color-ink)]">{b.capacity}GB data</p>
                              <p className="text-xs text-[var(--color-ink-muted)]">No expiry</p>
                            </div>
                          </div>
                          <span className="text-sm font-bold" style={{ color: c.accent.text }}>GHS {b.price}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Phone input */}
              <div className="mt-5">
                <label className="label">Recipient phone number</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-subtle)]">
                    <Smartphone size={16} />
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.trim())}
                    disabled={!inStock}
                    placeholder={c.phoneHint}
                    className="input pl-9"
                  />
                </div>
                <p className="mt-1.5 text-xs text-[var(--color-ink-muted)]">{c.phoneNoteSmall || ' '}</p>
              </div>

              {/* Selected summary */}
              {bundle && (
                <div className="mt-5 flex items-center justify-between p-4 rounded-xl"
                     style={{ background: c.accent.soft, border: `1px solid ${c.accent.ring}` }}>
                  <div className="flex items-center gap-2">
                    <Wallet size={16} style={{ color: c.accent.text }} />
                    <span className="text-sm font-semibold" style={{ color: c.accent.text }}>
                      Total
                    </span>
                  </div>
                  <span className="text-base font-bold" style={{ color: c.accent.text }}>
                    {bundle.capacity}GB &middot; GHS {bundle.price}
                  </span>
                </div>
              )}

              {/* CTA */}
              <button
                onClick={initiate}
                disabled={loading || !inStock}
                className="btn-primary mt-6 w-full !py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: `linear-gradient(135deg, ${c.accent.button[0]}, ${c.accent.button[1]})`,
                  boxShadow: `0 10px 30px -12px ${c.accent.button[0]}55`,
                }}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Processing…
                  </>
                ) : (
                  <>Buy {bundle ? `${bundle.capacity}GB` : 'bundle'} <ArrowRight size={18} /></>
                )}
              </button>
            </>
          )}
        </div>

        {/* Info */}
        <div className="card mt-6 p-5">
          <h3 className="font-semibold text-[var(--color-ink)] inline-flex items-center gap-2">
            <AlertCircle size={16} className="text-[var(--color-brand-orange)]" />
            Before you buy
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-[var(--color-ink-muted)]">
            <li className="flex gap-2"><span className="text-[var(--color-brand-blue)]">&bull;</span> Non-expiry bundles &mdash; valid until consumed.</li>
            <li className="flex gap-2"><span className="text-[var(--color-brand-blue)]">&bull;</span> Double-check the recipient number. No refunds for wrong numbers.</li>
            <li className="flex gap-2"><span className="text-[var(--color-brand-blue)]">&bull;</span> SMS confirmation will be sent on activation.</li>
          </ul>
        </div>
      </div>

      {/* Confirm modal */}
      {confirmOpen && pending && (
        <Modal title="Confirm purchase" onClose={() => !loading && setConfirmOpen(false)}>
          <div className="rounded-xl border border-[var(--color-brand-orange-soft)] bg-[var(--color-brand-orange-soft)] p-3 mb-4">
            <p className="font-semibold text-[#92400E] inline-flex items-center gap-2 text-sm">
              <Clock size={14} /> Delivery is not always instant
            </p>
            <p className="mt-1 text-xs text-[#7C2D12]">Most bundles arrive within 30 min &mdash; up to 3 hrs on poor networks.</p>
          </div>
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 mb-5">
            <p className="text-xs text-red-700 font-semibold">No refunds for incorrect numbers. Verify before confirming.</p>
          </div>
          <dl className="space-y-2 mb-5">
            <Row label="Recipient" value={phone} />
            <Row label="Bundle"    value={`${pending.capacity}GB`} />
            <Row label="Price"     value={`GHS ${pending.price}`} bold />
          </dl>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setConfirmOpen(false)} disabled={loading} className="btn-ghost">
              Cancel
            </button>
            <button onClick={purchase} disabled={loading} className="btn-primary">
              {loading ? <><Loader2 size={16} className="animate-spin" /> Working…</> : <><ShieldCheck size={16} /> Confirm</>}
            </button>
          </div>
        </Modal>
      )}

      {/* Success modal */}
      {successOpen && (
        <Modal title="Order placed" onClose={() => setSuccessOpen(false)} accent="emerald">
          <div className="text-center py-2">
            <div className="mx-auto w-14 h-14 rounded-full bg-emerald-100 inline-flex items-center justify-center text-emerald-600">
              <CheckCircle2 size={28} />
            </div>
            <p className="mt-4 text-xl font-bold text-[var(--color-ink)]">{success.cap}GB processing</p>
            <p className="text-sm text-[var(--color-ink-muted)]">For {success.phone}</p>

            <div className="mt-5 rounded-xl bg-[var(--color-brand-blue-soft)] border border-[rgba(30,136,255,.18)] p-4 text-left">
              <p className="text-xs text-[var(--color-brand-blue-deep)] font-semibold inline-flex items-center gap-1.5">
                <Clock size={12} /> Expected delivery
              </p>
              <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                <div className="text-center"><p className="font-bold text-emerald-600">~30 min</p><p className="text-[var(--color-ink-muted)]">Good</p></div>
                <div className="text-center"><p className="font-bold text-amber-600">1&ndash;2 hr</p><p className="text-[var(--color-ink-muted)]">Moderate</p></div>
                <div className="text-center"><p className="font-bold text-orange-600">~3 hr</p><p className="text-[var(--color-ink-muted)]">Poor</p></div>
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-[var(--color-surface-muted)] p-3 text-left">
              <p className="text-[11px] text-[var(--color-ink-muted)]">Reference</p>
              <p className="font-mono text-xs text-[var(--color-ink)] break-all">{success.ref}</p>
            </div>

            <button onClick={() => setSuccessOpen(false)} className="btn-primary mt-5 w-full">Done</button>
          </div>
        </Modal>
      )}

      {/* Error modal */}
      {errorOpen && message.type === 'error' && (
        <Modal title="Couldn't complete" onClose={() => setErrorOpen(false)} accent="red">
          <div className="text-center py-2">
            <div className="mx-auto w-14 h-14 rounded-full bg-red-100 inline-flex items-center justify-center text-red-600">
              <XCircle size={28} />
            </div>
            <p className="mt-4 text-[var(--color-ink)]">{message.text}</p>
            <button onClick={() => setErrorOpen(false)} className="btn-ghost mt-5 w-full">Close</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Row({ label, value, bold }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <dt className="text-[var(--color-ink-muted)]">{label}</dt>
      <dd className={`text-[var(--color-ink)] ${bold ? 'font-bold' : 'font-medium'}`}>{value}</dd>
    </div>
  );
}

function Modal({ title, children, onClose, accent }) {
  const accentClass =
    accent === 'emerald' ? 'from-emerald-500 to-emerald-600' :
    accent === 'red'     ? 'from-red-500 to-rose-500' :
                           'from-[#0B3D91] to-[#1E88FF]';
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-[var(--color-brand-navy)]/45 backdrop-blur-sm animate-fadeIn">
      <div className="card max-w-sm w-full overflow-hidden animate-scaleIn">
        <div className={`bg-gradient-to-r ${accentClass} text-white p-4 text-center`}>
          <h2 className="text-base font-bold">{title}</h2>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
