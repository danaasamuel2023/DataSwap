'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { CheckCircle2, XCircle, Loader2, ArrowRight, Wallet } from 'lucide-react';

function VerifyClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reference = searchParams?.get('reference');

  const [status, setStatus] = useState('verifying'); // 'verifying' | 'success' | 'error'
  const [message, setMessage] = useState('Verifying your payment…');
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    if (!reference) {
      setStatus('error');
      setMessage('Payment reference not found. Try again or contact support.');
      return;
    }
    (async () => {
      try {
        const r = await axios.get(
          `https://dataswap-ydgo.onrender.com/api/wallet/verify-payment?reference=${reference}`
        );
        if (r.data?.success) {
          setStatus('success');
          setMessage(r.data.message || 'Payment verified successfully.');
          setBalance(r.data.balance);
        } else {
          setStatus('error');
          setMessage(r.data?.error || 'Payment verification failed.');
        }
      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data?.error || 'Payment verification failed. Our team has been notified.');
      }
    })();
  }, [reference]);

  return (
    <div className="bg-[var(--color-surface-muted)] min-h-[calc(100vh-4rem)] grid place-items-center px-4 py-12">
      <div className="card max-w-md w-full p-7 text-center animate-fadeInUp">
        <p className="text-[11px] uppercase tracking-wider text-[var(--color-ink-subtle)]">Payment verification</p>

        {status === 'verifying' && (
          <div className="mt-6 flex flex-col items-center">
            <Loader2 size={36} className="animate-spin text-[var(--color-brand-blue)]" />
            <p className="mt-4 text-[var(--color-ink)]">{message}</p>
          </div>
        )}

        {status === 'success' && (
          <div className="mt-6 flex flex-col items-center">
            <span className="w-14 h-14 rounded-full bg-emerald-100 inline-flex items-center justify-center text-emerald-600">
              <CheckCircle2 size={30} />
            </span>
            <h2 className="mt-4 text-xl font-bold text-[var(--color-brand-navy)]">Payment confirmed</h2>
            <p className="mt-1 text-sm text-[var(--color-ink-muted)]">{message}</p>
            {balance !== null && (
              <div className="mt-5 w-full rounded-xl bg-[var(--color-brand-blue-soft)] border border-[rgba(30,136,255,.18)] p-4 inline-flex items-center justify-between">
                <span className="text-sm text-[var(--color-brand-blue-deep)] inline-flex items-center gap-2">
                  <Wallet size={14} /> New balance
                </span>
                <span className="font-bold text-[var(--color-brand-navy)]">GHS {Number(balance).toFixed(2)}</span>
              </div>
            )}
            <button onClick={() => router.push('/')} className="btn-primary mt-6 w-full">
              Back to dashboard <ArrowRight size={16} />
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="mt-6 flex flex-col items-center">
            <span className="w-14 h-14 rounded-full bg-red-100 inline-flex items-center justify-center text-red-600">
              <XCircle size={30} />
            </span>
            <h2 className="mt-4 text-xl font-bold text-[var(--color-brand-navy)]">Couldn&rsquo;t verify</h2>
            <p className="mt-1 text-sm text-[var(--color-ink-muted)]">{message}</p>
            <div className="mt-6 grid grid-cols-2 gap-3 w-full">
              <button onClick={() => router.push('/deposite')} className="btn-ghost">Try again</button>
              <button onClick={() => router.push('/')} className="btn-primary">Dashboard <ArrowRight size={16} /></button>
            </div>
          </div>
        )}

        {reference && (
          <p className="mt-6 text-[11px] text-[var(--color-ink-subtle)] break-all">
            Ref: <span className="font-mono">{reference}</span>
          </p>
        )}
      </div>
    </div>
  );
}

function Fallback() {
  return (
    <div className="bg-[var(--color-surface-muted)] min-h-[calc(100vh-4rem)] grid place-items-center px-4 py-12">
      <div className="card max-w-md w-full p-7 text-center">
        <Loader2 size={32} className="mx-auto animate-spin text-[var(--color-brand-blue)]" />
        <p className="mt-4 text-[var(--color-ink-muted)]">Loading payment verification…</p>
      </div>
    </div>
  );
}

export default function VerifyDeposit() {
  return (
    <Suspense fallback={<Fallback />}>
      <VerifyClient />
    </Suspense>
  );
}
