'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ArrowRight, Wallet, ShieldCheck, Zap, Clock,
  Smartphone, BarChart3, CheckCircle2, Star, ChevronRight
} from 'lucide-react';

const networks = [
  {
    id: 'mtn',
    name: 'MTN',
    tagline: 'Best coverage nationwide',
    accent: '#FFCB05',
    accentText: '#7A5800',
    accentSoft: '#FFF7D6',
    sample: '1GB from GHS 5',
  },
  {
    id: 'telecel',
    name: 'Telecel',
    tagline: 'Fast 4G+ in major cities',
    accent: '#E60000',
    accentText: '#7A0000',
    accentSoft: '#FFE5E5',
    sample: '1GB from GHS 5',
  },
  {
    id: 'at',
    name: 'AT',
    tagline: 'Affordable everyday bundles',
    accent: '#1E88FF',
    accentText: '#0B3D91',
    accentSoft: '#E8F1FF',
    sample: '1GB from GHS 4',
  },
];

function NetworkCard({ n }) {
  return (
    <Link
      href={`/${n.id}`}
      className="card group p-6 transition-all hover:-translate-y-1 hover:shadow-[0_20px_40px_-20px_rgba(10,22,40,.18)]"
    >
      <div className="flex items-start justify-between">
        <span
          className="inline-flex items-center justify-center w-12 h-12 rounded-xl text-base font-black"
          style={{ background: n.accentSoft, color: n.accentText }}
        >
          {n.name.slice(0, 2)}
        </span>
        <span
          className="text-xs font-semibold px-2.5 py-1 rounded-full"
          style={{ background: n.accentSoft, color: n.accentText }}
        >
          {n.sample}
        </span>
      </div>
      <h3 className="mt-5 text-lg font-bold text-[var(--color-ink)]">{n.name} bundles</h3>
      <p className="mt-1 text-sm text-[var(--color-ink-muted)]">{n.tagline}</p>
      <div className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-brand-blue-deep)] group-hover:gap-2 transition-all">
        Choose plan <ArrowRight size={16} />
      </div>
    </Link>
  );
}

function Feature({ icon, title, desc }) {
  return (
    <div className="card p-5">
      <div className="w-10 h-10 rounded-lg brand-blue-gradient text-white inline-flex items-center justify-center">
        {icon}
      </div>
      <h4 className="mt-4 font-semibold text-[var(--color-ink)]">{title}</h4>
      <p className="mt-1 text-sm text-[var(--color-ink-muted)]">{desc}</p>
    </div>
  );
}

function Stat({ label, value, accent }) {
  return (
    <div className="text-center">
      <div className={`text-2xl md:text-3xl font-black ${accent}`}>{value}</div>
      <div className="mt-1 text-xs uppercase tracking-wider text-[var(--color-ink-muted)]">{label}</div>
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    const t = localStorage.getItem('token');
    const u = localStorage.getItem('userId');
    if (t && u) setIsLoggedIn(true);
    return () => { document.documentElement.style.scrollBehavior = ''; };
  }, []);

  return (
    <div className="bg-white">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-60 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />
        <div className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full bg-[var(--color-brand-blue-soft)] blur-3xl opacity-70" />
        <div className="absolute -bottom-40 -left-32 w-[420px] h-[420px] rounded-full bg-[var(--color-brand-orange-soft)] blur-3xl opacity-70" />

        <div className="relative container mx-auto px-4 pt-16 pb-20 lg:pt-24 lg:pb-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fadeInUp">
              <span className="chip">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-blue)]" />
                Built for Ghana &middot; Live now
              </span>
              <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[var(--color-brand-navy)] leading-[1.05]">
                Buy data bundles
                <br />
                <span className="brand-gradient-text">in seconds.</span>
              </h1>
              <p className="mt-5 text-lg text-[var(--color-ink-soft)] max-w-xl">
                Top up your DataSwap wallet once, then send MTN, Telecel, AT and AFA bundles
                to any number &mdash; from your phone, anytime.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link href={isLoggedIn ? '/mtn' : '/Auth'} className="btn-primary">
                  {isLoggedIn ? 'Buy data now' : 'Get started free'} <ArrowRight size={18} />
                </Link>
                <a href="#networks" className="btn-ghost">
                  Browse plans <ChevronRight size={18} />
                </a>
              </div>

              <div className="mt-8 flex items-center gap-5 text-sm text-[var(--color-ink-muted)]">
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 size={16} className="text-emerald-500" /> Instant delivery
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 size={16} className="text-emerald-500" /> Paystack secured
                </span>
                <span className="hidden sm:inline-flex items-center gap-1.5">
                  <CheckCircle2 size={16} className="text-emerald-500" /> 24/7
                </span>
              </div>
            </div>

            {/* Visual preview card */}
            <div className="relative animate-fadeInUp delay-150">
              <div className="absolute -inset-4 brand-gradient-bg opacity-15 blur-3xl rounded-[2rem]" />
              <div className="relative card p-6 lg:p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[var(--color-ink-muted)]">Wallet balance</p>
                    <p className="mt-1 text-3xl font-black text-[var(--color-brand-navy)]">GHS 248.50</p>
                  </div>
                  <button className="btn-accent !py-2 !px-3 text-sm">
                    <Wallet size={16} /> Top up
                  </button>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-2">
                  {networks.map(n => (
                    <div key={n.id} className="rounded-xl border border-[var(--color-line)] p-3 text-center">
                      <div
                        className="mx-auto mb-2 w-9 h-9 rounded-lg inline-flex items-center justify-center text-xs font-black"
                        style={{ background: n.accentSoft, color: n.accentText }}
                      >
                        {n.name.slice(0, 2)}
                      </div>
                      <p className="text-[11px] font-semibold text-[var(--color-ink)]">{n.name}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 space-y-3">
                  {[
                    { label: '0244 123 456', net: 'MTN', vol: '2GB', amt: '10.00' },
                    { label: '0207 654 321', net: 'Telecel', vol: '5GB', amt: '24.00' },
                    { label: '0265 987 234', net: 'AT', vol: '1GB', amt: '4.50' },
                  ].map((tx, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[var(--color-surface-muted)]">
                      <div className="flex items-center gap-3">
                        <span className="w-9 h-9 rounded-lg bg-white border border-[var(--color-line)] inline-flex items-center justify-center">
                          <Smartphone size={16} className="text-[var(--color-brand-blue-deep)]" />
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-[var(--color-ink)]">{tx.vol} &middot; {tx.net}</p>
                          <p className="text-xs text-[var(--color-ink-muted)]">{tx.label}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-[var(--color-ink)]">GHS {tx.amt}</p>
                        <span className="chip-success chip !py-0 !px-2">Delivered</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto card p-6">
            <Stat label="Active users" value="10K+" accent="text-[var(--color-brand-blue-deep)]" />
            <Stat label="Daily orders" value="500+" accent="text-[var(--color-brand-orange)]" />
            <Stat label="Uptime" value="99.9%" accent="text-emerald-600" />
            <Stat label="Support" value="24/7" accent="text-[var(--color-brand-navy)]" />
          </div>
        </div>
      </section>

      {/* ── Why DataSwap ─────────────────────────────────── */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-2xl mx-auto">
          <span className="chip-orange chip">Why DataSwap</span>
          <h2 className="mt-4 text-3xl md:text-4xl font-black text-[var(--color-brand-navy)]">
            Built for the way you actually use data.
          </h2>
          <p className="mt-3 text-[var(--color-ink-muted)]">
            No app downloads. No SIM swaps. Just sign up, top up, send.
          </p>
        </div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Feature icon={<Zap size={18} />}        title="Seconds, not minutes"  desc="Bundles arrive on the recipient's line within seconds of payment." />
          <Feature icon={<ShieldCheck size={18} />} title="Paystack secured"      desc="Card and mobile money payments protected by Paystack." />
          <Feature icon={<Clock size={18} />}      title="Buy any time"          desc="Order around the clock; we process Sunday orders Monday morning." />
          <Feature icon={<BarChart3 size={18} />}  title="Track every order"     desc="Live order history with delivery status for every transaction." />
        </div>
      </section>

      {/* ── Networks ─────────────────────────────────────── */}
      <section id="networks" className="bg-[var(--color-surface-muted)] border-y border-[var(--color-line)]">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center max-w-2xl mx-auto">
            <span className="chip">Pick a network</span>
            <h2 className="mt-4 text-3xl md:text-4xl font-black text-[var(--color-brand-navy)]">
              Choose your network to start.
            </h2>
            <p className="mt-3 text-[var(--color-ink-muted)]">
              Same wallet works across MTN, Telecel and AT.
            </p>
          </div>

          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {networks.map(n => <NetworkCard key={n.id} n={n} />)}
          </div>

          <div className="mt-6 max-w-5xl mx-auto">
            <Link
              href="/afa"
              className="card flex items-center justify-between p-5 group hover:-translate-y-0.5 transition-transform"
            >
              <div className="flex items-center gap-4">
                <span className="w-10 h-10 rounded-lg brand-orange-gradient text-white inline-flex items-center justify-center font-bold">
                  AFA
                </span>
                <div>
                  <p className="font-semibold text-[var(--color-ink)]">AFA Registration</p>
                  <p className="text-sm text-[var(--color-ink-muted)]">Register a new line in minutes.</p>
                </div>
              </div>
              <ArrowRight className="text-[var(--color-brand-blue-deep)] group-hover:translate-x-1 transition-transform" size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────── */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="chip">Three steps</span>
            <h2 className="mt-4 text-3xl md:text-4xl font-black text-[var(--color-brand-navy)]">
              From sign up to first bundle in under a minute.
            </h2>
            <ol className="mt-8 space-y-5">
              {[
                ['Create your account', 'Sign up with email and a password — no document upload required.'],
                ['Top up your wallet', 'Pay with Mobile Money or card via Paystack. Funds land instantly.'],
                ['Send data anywhere', 'Pick a network, type the recipient number, choose a bundle, done.'],
              ].map(([t, d], i) => (
                <li key={t} className="flex gap-4">
                  <span className="shrink-0 w-9 h-9 rounded-full brand-blue-gradient text-white inline-flex items-center justify-center font-bold">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-[var(--color-ink)]">{t}</p>
                    <p className="text-sm text-[var(--color-ink-muted)]">{d}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-8">
              <Link href={isLoggedIn ? '/deposite' : '/Auth'} className="btn-primary">
                {isLoggedIn ? 'Top up wallet' : 'Open my account'} <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 brand-gradient-bg opacity-10 blur-3xl rounded-[2rem]" />
            <div className="relative card p-7">
              <div className="flex items-center gap-2">
                {[1,2,3,4,5].map(i => <Star key={i} size={16} className="fill-amber-400 text-amber-400" />)}
                <span className="text-sm text-[var(--color-ink-muted)] ml-2">4.9 / 5 from 1,200+ users</span>
              </div>
              <blockquote className="mt-5 text-lg text-[var(--color-ink)] leading-relaxed">
                &ldquo;DataSwap completely replaced the half-dozen agent numbers I used to call.
                Top up once, send to my whole family.&rdquo;
              </blockquote>
              <div className="mt-5 flex items-center gap-3">
                <span className="w-10 h-10 rounded-full brand-orange-gradient text-white inline-flex items-center justify-center font-bold">
                  AB
                </span>
                <div>
                  <p className="text-sm font-semibold text-[var(--color-ink)]">Abena B.</p>
                  <p className="text-xs text-[var(--color-ink-muted)]">Customer in Kumasi</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="container mx-auto px-4 pb-20">
        <div className="relative overflow-hidden rounded-3xl brand-gradient-bg p-10 md:p-14 text-center text-white">
          <div className="absolute inset-0 bg-dots opacity-10" />
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-black">Ready to send your first bundle?</h2>
            <p className="mt-3 text-white/85 max-w-xl mx-auto">
              Free to sign up. Pay only for the data you send.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link
                href={isLoggedIn ? '/deposite' : '/Auth'}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-[var(--color-brand-navy)] font-semibold hover:bg-[var(--color-brand-blue-soft)] transition-colors"
              >
                {isLoggedIn ? 'Top up wallet' : 'Create account'} <ArrowRight size={18} />
              </Link>
              <Link
                href="/mtn"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-white/30 text-white font-semibold hover:bg-white/10 transition-colors"
              >
                See MTN plans
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
