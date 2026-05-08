'use client';

import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import {
  Smartphone, ShoppingCart, ArrowRight, AlertCircle, CheckCircle2,
  XCircle, Clock, Loader2, ShieldCheck, Zap, Infinity as InfinityIcon,
  RefreshCw, Trash2, Wallet,
} from 'lucide-react';

/**
 * config: {
 *   id, title, subtitle,
 *   network: 'mtn' | 'AT_PREMIUM' | 'TELECEL',
 *   availabilityKey: 'mtn' | 'ishare' | 'telecel',
 *   bundles: [{ capacity, mb, price, network }],
 *   phonePattern: RegExp,
 *   phoneHint, phoneError, phoneNoteSmall,
 *   logoLabel, accent: { tile, tileText, ring, soft, text, button: [c1,c2] }
 * }
 */
export default function BundlePurchaseScreen({ config }) {
  const c = config;

  const [phone, setPhone] = useState('');
  const [pickedBundle, setPickedBundle] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [userId, setUserId] = useState(null);
  const [availability, setAvailability] = useState({ mtn: true, ishare: true, telecel: true });
  const [checking, setChecking] = useState(true);

  const [bulkText, setBulkText] = useState('');
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setUserId(localStorage.getItem('userId'));
    fetchAvailability();
  }, []); // eslint-disable-line

  async function fetchAvailability() {
    try {
      setChecking(true);
      const r = await axios.get('https://dataswap-ydgo.onrender.com/api/networks-availability');
      if (r.data?.success) setAvailability(r.data.networks);
    } catch (_) {} finally {
      setChecking(false);
    }
  }

  const inStock = availability[c.availabilityKey];
  const validatePhone = (n) => c.phonePattern.test((n || '').trim());

  function openConfirm(bundle) {
    setError(null);
    if (!inStock) return setError(`${c.shortName} is currently out of stock.`);
    if (!userId)  return setError('Please sign in first.');
    if (!phone.trim()) return setError('Enter a phone number above first.');
    if (!validatePhone(phone)) return setError(c.phoneError);
    setPickedBundle(bundle);
    setConfirmOpen(true);
  }

  async function purchase() {
    if (!pickedBundle) return;
    setLoading(true);
    try {
      await fetchAvailability();
      if (!availability[c.availabilityKey]) {
        setError(`${c.shortName} just went out of stock.`);
        setConfirmOpen(false); setLoading(false); return;
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
          dataAmount: parseFloat(pickedBundle.mb) / 1000,
          price: parseFloat(pickedBundle.price),
          reference,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data?.success) {
        setSuccess({ phone: phone.trim(), cap: pickedBundle.capacity, ref: reference });
        setPhone(''); setPickedBundle(null);
      } else {
        setError(res.data?.error || 'Failed to process order.');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to purchase bundle.');
    } finally {
      setLoading(false);
      setConfirmOpen(false);
    }
  }

  // ── Bulk paste parsing ─────────────────────────────────────
  const bulkRows = useMemo(() => parseBulk(bulkText, c), [bulkText, c]);

  return (
    <div className="bg-[var(--color-surface-muted)] min-h-[calc(100vh-4rem)] py-8">
      <div className="container mx-auto px-4 max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span
              className="w-12 h-12 rounded-xl inline-flex items-center justify-center text-sm font-black shadow-lg"
              style={{ background: c.accent.tile, color: c.accent.tileText }}
            >
              {c.logoLabel}
            </span>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-[var(--color-brand-navy)]">{c.title}</h1>
              <p className="text-sm text-[var(--color-ink-muted)]">{c.subtitle}</p>
            </div>
          </div>

          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${
            checking ? 'border-[var(--color-line)] text-[var(--color-ink-muted)]' :
            inStock  ? 'border-emerald-500/40 text-emerald-500 bg-emerald-500/10'
                     : 'border-red-500/40 text-red-400 bg-red-500/10'
          }`}>
            <span className={`w-2 h-2 rounded-full ${checking ? 'bg-slate-400' : inStock ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
            {checking ? 'Checking…' : inStock ? 'In stock' : 'Out of stock'}
            <button onClick={fetchAvailability} className="opacity-70 hover:opacity-100 ml-1">
              <RefreshCw size={11} className={checking ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Recipient phone (always visible — used by both single & bulk flows) */}
        <div className="card p-5">
          <label className="label">Recipient phone number</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-subtle)]">
              <Smartphone size={16} />
            </span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => { setPhone(e.target.value.trim()); setError(null); }}
              placeholder={c.phoneHint}
              className="input pl-9"
              disabled={!inStock}
            />
          </div>
          {c.phoneNoteSmall && <p className="mt-1.5 text-xs text-[var(--color-ink-muted)]">{c.phoneNoteSmall}</p>}
        </div>

        {/* Bulk paste */}
        <div className="card p-5">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-bold text-[var(--color-ink)] inline-flex items-center gap-2">
              <ShoppingCart size={16} className="text-[var(--color-brand-blue)]" />
              Bulk copy-paste orders
            </h2>
            <span className="chip-warn chip">Beta</span>
          </div>
          <p className="mt-2 text-xs text-[var(--color-ink-muted)]">
            Format:{' '}
            <span className="font-semibold text-[var(--color-brand-orange)]">Phone number (10 digits)</span>{' '}
            +{' '}
            <span className="font-semibold text-[var(--color-brand-orange)]">Data size (GB)</span>
            {' '}per line. Max 100 rows.
          </p>

          <textarea
            rows={6}
            placeholder={`0244000000 2\n0540000000 5\n0590000000 10`}
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            className="input mt-4 font-mono text-sm resize-y"
          />

          {bulkText.trim() && (
            <BulkPreview rows={bulkRows} accent={c.accent} onClear={() => setBulkText('')} />
          )}

          <button
            disabled={!bulkRows.valid.length}
            title={bulkRows.valid.length ? 'Bulk submission coming soon' : 'Paste at least one valid row'}
            className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-white font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: 'linear-gradient(135deg, #0B3D91, #1E88FF)' }}
          >
            <ShoppingCart size={16} /> Add to cart{bulkRows.valid.length ? ` (${bulkRows.valid.length})` : ''}
          </button>
          <p className="mt-2 text-[11px] text-center text-[var(--color-ink-subtle)]">
            Bulk submission endpoint not live yet — preview only.
          </p>
        </div>

        {/* Inline errors */}
        {error && (
          <div className="card p-4 border-red-500/40 bg-red-500/10 text-sm text-red-400 inline-flex items-center gap-2">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {/* Bundle tile grid */}
        {checking ? (
          <div className="card p-12 text-center">
            <Loader2 size={28} className="mx-auto animate-spin text-[var(--color-brand-blue)]" />
            <p className="mt-3 text-[var(--color-ink-muted)]">Loading bundles…</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {c.bundles.map((b) => (
              <BundleTile
                key={`${b.network}-${b.capacity}`}
                bundle={b}
                accent={c.accent}
                logoLabel={c.logoLabel}
                disabled={!inStock || !phone.trim() || !validatePhone(phone)}
                onPick={() => openConfirm(b)}
              />
            ))}
          </div>
        )}

        {/* Info */}
        <div className="card p-5">
          <h3 className="font-semibold text-[var(--color-ink)] inline-flex items-center gap-2">
            <AlertCircle size={16} className="text-[var(--color-brand-orange)]" /> Before you buy
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-[var(--color-ink-muted)]">
            <li className="flex gap-2"><span className="text-[var(--color-brand-blue)]">•</span> Non-expiry bundles — valid until consumed.</li>
            <li className="flex gap-2"><span className="text-[var(--color-brand-blue)]">•</span> Double-check the recipient number. No refunds for wrong numbers.</li>
            <li className="flex gap-2"><span className="text-[var(--color-brand-blue)]">•</span> SMS confirmation sent on activation.</li>
          </ul>
        </div>
      </div>

      {/* Confirm modal */}
      {confirmOpen && pickedBundle && (
        <Modal title="Confirm purchase" onClose={() => !loading && setConfirmOpen(false)}>
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 mb-4">
            <p className="font-semibold text-amber-400 inline-flex items-center gap-2 text-sm">
              <Clock size={14} /> Delivery isn't always instant
            </p>
            <p className="mt-1 text-xs text-amber-300/80">Most bundles arrive within 30 min — up to 3 hrs on poor networks.</p>
          </div>
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 mb-5">
            <p className="text-xs text-red-300 font-semibold">No refunds for incorrect numbers. Verify before confirming.</p>
          </div>
          <dl className="space-y-2 mb-5">
            <Row label="Recipient" value={phone} />
            <Row label="Bundle"    value={`${pickedBundle.capacity}GB`} />
            <Row label="Price"     value={`GHS ${pickedBundle.price}`} bold />
          </dl>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setConfirmOpen(false)} disabled={loading} className="btn-ghost">Cancel</button>
            <button onClick={purchase} disabled={loading}
                    className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-white font-semibold shadow-lg"
                    style={{ background: `linear-gradient(135deg, ${c.accent.button[0]}, ${c.accent.button[1]})` }}>
              {loading ? <><Loader2 size={16} className="animate-spin" /> Working…</> : <><ShieldCheck size={16} /> Confirm</>}
            </button>
          </div>
        </Modal>
      )}

      {/* Success modal */}
      {success && (
        <Modal title="Order placed" onClose={() => setSuccess(null)} accent="emerald">
          <div className="text-center py-2">
            <div className="mx-auto w-14 h-14 rounded-full bg-emerald-500/20 inline-flex items-center justify-center text-emerald-400">
              <CheckCircle2 size={28} />
            </div>
            <p className="mt-4 text-xl font-bold text-[var(--color-ink)]">{success.cap}GB processing</p>
            <p className="text-sm text-[var(--color-ink-muted)]">For {success.phone}</p>
            <div className="mt-4 rounded-xl bg-[var(--color-surface-muted)] p-3 text-left">
              <p className="text-[11px] text-[var(--color-ink-muted)]">Reference</p>
              <p className="font-mono text-xs text-[var(--color-ink)] break-all">{success.ref}</p>
            </div>
            <button onClick={() => setSuccess(null)}
                    className="w-full mt-5 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors">
              Done
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ── Bundle tile ─────────────────────────────────────────────── */
function BundleTile({ bundle, accent, logoLabel, disabled, onPick }) {
  return (
    <button
      type="button"
      onClick={onPick}
      disabled={disabled}
      className={`group relative rounded-2xl p-4 text-left transition-all
                  ${disabled ? 'opacity-60 cursor-not-allowed' : 'hover:-translate-y-0.5 active:translate-y-0'}
                  shadow-md hover:shadow-xl`}
      style={{ background: accent.tile, color: accent.tileText }}
    >
      {/* Brand pill */}
      <span
        className="inline-flex items-center text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full"
        style={{ border: `1px solid ${accent.tileText}40`, color: accent.tileText }}
      >
        {logoLabel}
      </span>

      {/* Capacity */}
      <p className="mt-3 text-3xl sm:text-4xl font-black leading-none">
        {bundle.capacity}<span className="text-xl ml-0.5">GB</span>
      </p>

      {/* Bottom info row */}
      <div className="mt-4 pt-3 border-t flex items-center justify-between text-[11px] font-medium"
           style={{ borderColor: `${accent.tileText}25` }}>
        <div className="flex flex-col">
          <span className="font-bold text-sm">GH₵{bundle.price}</span>
          <span className="opacity-70">Price</span>
        </div>
        <div className="hidden sm:flex flex-col text-center">
          <span className="font-bold text-sm">N/A</span>
          <span className="opacity-70">Rollover</span>
        </div>
        <div className="flex flex-col items-end">
          <InfinityIcon size={14} />
          <span className="opacity-70">No expiry</span>
        </div>
      </div>

      {!disabled && (
        <ArrowRight
          size={16}
          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ color: accent.tileText }}
        />
      )}
    </button>
  );
}

/* ── Bulk preview ───────────────────────────────────────────── */
function BulkPreview({ rows, accent, onClear }) {
  return (
    <div className="mt-4 rounded-xl border border-[var(--color-line)] bg-[var(--color-surface-muted)] p-3">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold text-[var(--color-ink-muted)]">
          Preview &middot; {rows.valid.length} valid &middot; {rows.invalid.length} invalid
        </p>
        <button onClick={onClear} className="text-xs text-[var(--color-ink-muted)] hover:text-[var(--color-danger)] inline-flex items-center gap-1">
          <Trash2 size={12} /> Clear
        </button>
      </div>
      <div className="space-y-1 max-h-44 overflow-y-auto">
        {rows.valid.map((r, i) => (
          <div key={`v${i}`} className="flex items-center justify-between text-xs px-2 py-1.5 rounded-md bg-emerald-500/10 text-emerald-400">
            <span className="font-mono">{r.phone}</span>
            <span className="font-semibold">{r.capacity}GB &middot; GH₵{r.price.toFixed(2)}</span>
          </div>
        ))}
        {rows.invalid.map((r, i) => (
          <div key={`i${i}`} className="flex items-center justify-between text-xs px-2 py-1.5 rounded-md bg-red-500/10 text-red-400">
            <span className="font-mono truncate max-w-[60%]">{r.raw}</span>
            <span>{r.reason}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 pt-3 border-t border-[var(--color-line)] flex items-center justify-between text-sm">
        <span className="text-[var(--color-ink-muted)] inline-flex items-center gap-1.5"><Wallet size={13} /> Total</span>
        <span className="font-bold text-[var(--color-ink)]">GH₵ {rows.totalPrice.toFixed(2)}</span>
      </div>
    </div>
  );
}

function parseBulk(text, c) {
  const valid = [];
  const invalid = [];
  const lines = (text || '').split(/\r?\n/).map(l => l.trim()).filter(Boolean).slice(0, 100);

  for (const raw of lines) {
    const parts = raw.split(/[\s,;|\t]+/).filter(Boolean);
    if (parts.length < 2) { invalid.push({ raw, reason: 'Need phone & GB' }); continue; }
    const phone = parts[0];
    const gb = parseFloat(parts[1]);
    if (!c.phonePattern.test(phone)) { invalid.push({ raw, reason: 'Bad phone' }); continue; }
    if (!gb || isNaN(gb))            { invalid.push({ raw, reason: 'Bad GB' });   continue; }
    const match = c.bundles.find(b => parseFloat(b.capacity) === gb);
    if (!match) { invalid.push({ raw, reason: `No ${gb}GB plan` }); continue; }
    valid.push({ phone, capacity: match.capacity, price: parseFloat(match.price), mb: match.mb });
  }

  const totalPrice = valid.reduce((s, r) => s + r.price, 0);
  return { valid, invalid, totalPrice };
}

/* ── Helpers ──────────────────────────────────────────────── */
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
    <div className="fixed inset-0 z-[90] grid place-items-center p-4 bg-black/55 backdrop-blur-sm animate-fadeIn">
      <div className="card max-w-sm w-full overflow-hidden animate-scaleIn">
        <div className={`bg-gradient-to-r ${accentClass} text-white p-4 text-center`}>
          <h2 className="text-base font-bold">{title}</h2>
          <button onClick={onClose} className="absolute top-3 right-3 text-white/80 hover:text-white" aria-label="Close">
            <XCircle size={18} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
