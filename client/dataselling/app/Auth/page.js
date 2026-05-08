'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import {
  Eye, EyeOff, Loader2, User, Mail, Phone, KeyRound,
  UserPlus, LogIn, ArrowRight, ShieldCheck, Zap, Clock,
} from 'lucide-react';
import Logo from '../components/logo';

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const isSignup = mode === 'signup';

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('token')) {
      router.push('/');
    }
  }, [router]);

  const switchMode = () => {
    setMode(isSignup ? 'login' : 'signup');
    setError(''); setSuccess(''); reset();
  };

  const onSubmit = async (data) => {
    setLoading(true); setError(''); setSuccess('');
    try {
      const endpoint = isSignup ? 'register' : 'login';
      const res = await axios.post(`https://dataswap-ydgo.onrender.com/api/auth/${endpoint}`, data);

      if (!isSignup) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('userId', res.data.userId);
        localStorage.setItem('userrole', res.data.role);
        localStorage.setItem('username', (data.email || '').split('@')[0]);
        setSuccess('Signed in. Redirecting…');
        setTimeout(() => router.push('/'), 900);
      } else {
        setSuccess('Account created. You can now sign in.');
        setTimeout(() => { setMode('login'); reset(); }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] grid lg:grid-cols-[1.05fr_1fr] bg-[var(--color-surface-muted)]">
      {/* ── Left: form ───────────────────────────────────── */}
      <div className="flex items-center justify-center p-6 sm:p-10 bg-white">
        <div className="w-full max-w-md animate-fadeInUp">
          <div className="lg:hidden mb-6 flex justify-center">
            <Logo size={36} />
          </div>

          <h1 className="text-3xl font-black text-[var(--color-brand-navy)]">
            {isSignup ? 'Create your DataSwap account' : 'Welcome back'}
          </h1>
          <p className="mt-2 text-[var(--color-ink-muted)]">
            {isSignup
              ? 'It only takes a minute. No documents required.'
              : 'Sign in to top up your wallet and send data.'}
          </p>

          {error && (
            <div className="mt-5 chip-danger chip !block !rounded-xl !text-left p-3">
              {error}
            </div>
          )}
          {success && (
            <div className="mt-5 chip-success chip !block !rounded-xl !text-left p-3">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            {isSignup && (
              <>
                <Field
                  id="name" label="Full name" icon={<User size={16} />} placeholder="Ama Mensah"
                  register={register('name', { required: 'Full name is required' })}
                  error={errors.name?.message}
                />
                <Field
                  id="username" label="Username" icon={<User size={16} />} placeholder="amam"
                  register={register('username', {
                    required: 'Username is required',
                    minLength: { value: 3, message: 'Min 3 characters' },
                  })}
                  error={errors.username?.message}
                />
                <Field
                  id="phone" label="Phone number" icon={<Phone size={16} />} type="tel"
                  placeholder="+233 24 000 0000"
                  register={register('phone', {
                    required: 'Phone number is required',
                    pattern: { value: /^[0-9+\-\s()]+$/, message: 'Invalid phone number' },
                  })}
                  error={errors.phone?.message}
                />
              </>
            )}

            <Field
              id="email" label="Email" icon={<Mail size={16} />} type="email"
              placeholder="you@example.com"
              register={register('email', {
                required: 'Email is required',
                pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' },
              })}
              error={errors.email?.message}
            />

            <div>
              <label htmlFor="password" className="label">Password</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-subtle)]">
                  <KeyRound size={16} />
                </span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="input pl-9 pr-10"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Min 6 characters' },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-subtle)] hover:text-[var(--color-ink)]"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-[var(--color-danger)]">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full !py-3 disabled:opacity-60">
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Processing…
                </>
              ) : (
                <>
                  {isSignup ? <UserPlus size={18} /> : <LogIn size={18} />}
                  {isSignup ? 'Create account' : 'Sign in'}
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-sm text-center text-[var(--color-ink-muted)]">
            {isSignup ? 'Already have an account?' : "Don't have an account yet?"}{' '}
            <button
              type="button"
              onClick={switchMode}
              className="font-semibold text-[var(--color-brand-blue-deep)] hover:text-[var(--color-brand-blue)] transition-colors"
            >
              {isSignup ? 'Sign in' : 'Create one'}
            </button>
          </p>

          <p className="mt-8 text-center text-xs text-[var(--color-ink-subtle)]">
            By continuing, you agree to DataSwap&rsquo;s{' '}
            <Link href="#" className="underline hover:text-[var(--color-ink)]">Terms</Link> &amp;{' '}
            <Link href="#" className="underline hover:text-[var(--color-ink)]">Privacy Policy</Link>.
          </p>
        </div>
      </div>

      {/* ── Right: brand panel ───────────────────────────── */}
      <div className="hidden lg:flex relative overflow-hidden">
        <div className="absolute inset-0 brand-gradient-bg" />
        <div className="absolute inset-0 bg-dots opacity-15" />
        <div className="absolute -top-32 -right-32 w-[420px] h-[420px] rounded-full bg-white/15 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-[420px] h-[420px] rounded-full bg-white/10 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          <div className="flex items-center gap-2">
            <span className="bg-white/95 rounded-lg p-1.5">
              <Logo size={24} href={null} />
            </span>
          </div>

          <div>
            <h2 className="text-4xl font-black leading-tight">
              Top up once.<br />Send data forever.
            </h2>
            <p className="mt-4 text-white/85 max-w-md">
              The fastest way to send MTN, Telecel and AT bundles in Ghana &mdash;
              no agents, no waiting.
            </p>

            <div className="mt-8 grid grid-cols-3 gap-4 max-w-md">
              <Pill icon={<Zap size={16} />} label="Instant" />
              <Pill icon={<ShieldCheck size={16} />} label="Secure" />
              <Pill icon={<Clock size={16} />} label="24/7" />
            </div>
          </div>

          <p className="text-xs text-white/70">
            &copy; {new Date().getFullYear()} DataSwap &middot; Built for Ghana
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ id, label, icon, type = 'text', placeholder, register, error }) {
  return (
    <div>
      <label htmlFor={id} className="label">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-subtle)]">{icon}</span>
        <input id={id} type={type} placeholder={placeholder} className="input pl-9" {...register} />
      </div>
      {error && <p className="mt-1 text-xs text-[var(--color-danger)]">{error}</p>}
    </div>
  );
}

function Pill({ icon, label }) {
  return (
    <div className="flex items-center gap-2 rounded-xl bg-white/15 backdrop-blur border border-white/20 px-3 py-2">
      <span className="text-white">{icon}</span>
      <span className="text-sm font-semibold">{label}</span>
    </div>
  );
}
