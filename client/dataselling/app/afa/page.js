'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {
  IdCard, User, Phone, Calendar, Briefcase, MapPin,
  Loader2, ArrowRight, ShieldCheck, AlertCircle,
} from 'lucide-react';

const FIXED_PRICE = 8;

export default function AfaRegistration() {
  const router = useRouter();

  const [token, setToken] = useState('');
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    fullName: '', phoneNumber: '', idType: 'Ghana Card',
    idNumber: '', dateOfBirth: '', occupation: '', location: '',
  });
  const set = (k) => (e) => setForm(s => ({ ...s, [k]: e.target.value }));

  useEffect(() => {
    const t = localStorage.getItem('token');
    const u = localStorage.getItem('userId');
    if (!t || !u) { router.push('/Auth'); return; }
    setToken(t); setUserId(u);
  }, [router]);

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');

    const required = ['fullName','phoneNumber','idNumber','dateOfBirth','occupation','location'];
    if (required.some(k => !form[k])) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'https://bignsah.onrender.com/api/data'}/process-afa-registration`,
        {
          userId, ...form, price: FIXED_PRICE,
          reference: `AFA-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data?.success) {
        setSuccess('AFA registration completed.');
        setForm({ fullName: '', phoneNumber: '', idType: 'Ghana Card', idNumber: '', dateOfBirth: '', occupation: '', location: '' });
        setTimeout(() => router.push('/'), 1500);
      } else {
        setError(res.data?.error || 'Failed to process registration.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[var(--color-surface-muted)] min-h-[calc(100vh-4rem)] py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8 animate-fadeInUp">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl brand-orange-gradient text-white shadow-md">
            <IdCard size={26} />
          </div>
          <h1 className="mt-4 text-3xl md:text-4xl font-black text-[var(--color-brand-navy)]">AFA Registration</h1>
          <p className="mt-2 text-[var(--color-ink-muted)]">
            Register a new line in minutes &mdash; flat fee of GHS {FIXED_PRICE.toFixed(2)}.
          </p>
        </div>

        <form onSubmit={submit} className="card p-6 sm:p-8 space-y-5">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              <span className="inline-flex items-center gap-1.5"><AlertCircle size={14} /> {error}</span>
            </div>
          )}
          {success && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
              {success}
            </div>
          )}

          <Field label="Full name" icon={<User size={16} />} value={form.fullName}
                 onChange={set('fullName')} placeholder="Ama Mensah" required />

          <Field label="Phone number" icon={<Phone size={16} />} value={form.phoneNumber}
                 onChange={set('phoneNumber')} placeholder="024 123 4567" required />

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">ID type</label>
              <select value={form.idType} onChange={set('idType')} className="input" required>
                <option value="Ghana Card">Ghana Card</option>
                <option value="Voter ID">Voter ID</option>
              </select>
            </div>
            <Field label="ID number" icon={<IdCard size={16} />} value={form.idNumber}
                   onChange={set('idNumber')} placeholder="GHA-XXXXXXXXX-X" required />
          </div>

          <Field label="Date of birth" type="date" icon={<Calendar size={16} />}
                 value={form.dateOfBirth} onChange={set('dateOfBirth')} required />

          <Field label="Occupation" icon={<Briefcase size={16} />} value={form.occupation}
                 onChange={set('occupation')} placeholder="Trader" required />

          <Field label="Location" icon={<MapPin size={16} />} value={form.location}
                 onChange={set('location')} placeholder="Accra, Greater Accra" required />

          <div className="rounded-xl bg-[var(--color-brand-blue-soft)] border border-[rgba(30,136,255,.18)] p-4 flex items-center justify-between">
            <span className="text-sm text-[var(--color-brand-blue-deep)] font-semibold inline-flex items-center gap-2">
              <ShieldCheck size={16} /> Registration fee
            </span>
            <span className="text-base font-bold text-[var(--color-brand-navy)]">GHS {FIXED_PRICE.toFixed(2)}</span>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full !py-3 disabled:opacity-60">
            {loading ? (<><Loader2 size={18} className="animate-spin" /> Submitting…</>) : (<>Register <ArrowRight size={18} /></>)}
          </button>

          <button type="button" onClick={() => router.push('/')}
                  className="block mx-auto mt-2 text-sm text-[var(--color-brand-blue-deep)] hover:underline">
            Back to dashboard
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, icon, type = 'text', value, onChange, placeholder, required }) {
  return (
    <div>
      <label className="label">{label}{required && ' *'}</label>
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-subtle)]">{icon}</span>
        )}
        <input
          type={type} value={value} onChange={onChange} placeholder={placeholder}
          required={required} className={`input ${icon ? 'pl-9' : ''}`}
        />
      </div>
    </div>
  );
}
