'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Menu, X, Home, LogOut, Users, Wallet, ShoppingBag, ChevronDown,
  ArrowRight, Receipt, Settings, CreditCard, Loader2, Plus,
} from 'lucide-react';
import Logo from './logo';
import ThemeToggle from './theme-toggle';

const networkProviders = [
  { id: 'mtn',     name: 'MTN',     dot: '#FFCB05' },
  { id: 'at',      name: 'AT',      dot: '#ED1C24' },
  { id: 'telecel', name: 'Telecel', dot: '#E60000' },
  { id: 'afa',     name: 'AFA Reg.', dot: '#1E88FF' },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState('');
  const [username, setUsername] = useState('');
  const [userRole, setUserRole] = useState('');
  const [walletBalance, setWalletBalance] = useState(0);
  const [today, setToday] = useState({ credits: 0, debits: 0 });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [networksOpen, setNetworksOpen] = useState(false);
  const [logoutToast, setLogoutToast] = useState(false);

  // Add-money form
  const [topupAmount, setTopupAmount] = useState('');
  const [topupBusy, setTopupBusy] = useState(false);
  const [topupErr, setTopupErr] = useState('');
  const [buyDataOpen, setBuyDataOpen] = useState(false);
  const [walletPanelOpen, setWalletPanelOpen] = useState(false);

  useEffect(() => {
    const uId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    if (uId) {
      setIsLoggedIn(true);
      setUserId(uId);
      setUsername(localStorage.getItem('username') || 'User');
      setUserRole(localStorage.getItem('userrole') || '');
      if (token) {
        fetchBalance(uId, token);
        fetchTodaySummary(uId, token);
      }
    }

    document.body.style.overflow = mobileOpen ? 'hidden' : 'unset';
    const onClick = (e) => {
      if (mobileOpen && !e.target.closest('#mobile-menu') && !e.target.closest('#menu-button')) {
        setMobileOpen(false);
      }
      if (networksOpen && !e.target.closest('#networks-dropdown')) {
        setNetworksOpen(false);
      }
      if (walletPanelOpen && !e.target.closest('#wallet-panel') && !e.target.closest('#wallet-trigger')) {
        setWalletPanelOpen(false);
      }
    };
    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('click', onClick);
      document.body.style.overflow = 'unset';
    };
  }, [mobileOpen, networksOpen, walletPanelOpen]);

  // Refresh balance + today's summary when the panel opens
  useEffect(() => {
    if (walletPanelOpen && userId) {
      const token = localStorage.getItem('token');
      if (token) {
        fetchBalance(userId, token);
        fetchTodaySummary(userId, token);
      }
    }
  }, [walletPanelOpen, userId]);

  async function fetchBalance(uid, token) {
    try {
      const r = await fetch(
        `https://dataswap-ydgo.onrender.com/api/wallet/balance?userId=${uid}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (r.ok) {
        const data = await r.json();
        setWalletBalance(data.balance || 0);
      }
    } catch (_) {}
  }

  async function fetchTodaySummary(uid, token) {
    try {
      const r = await fetch(
        `https://dataswap-ydgo.onrender.com/api/wallet/today-summary?userId=${uid}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (r.ok) {
        const data = await r.json();
        if (data?.success) {
          setToday({ credits: data.credits || 0, debits: data.debits || 0 });
        }
      }
    } catch (_) {}
  }

  async function handleQuickTopup(e) {
    e.preventDefault();
    setTopupErr('');
    const v = parseFloat(topupAmount);
    if (!v || isNaN(v) || v <= 0) return setTopupErr('Enter an amount.');
    if (v < 10) return setTopupErr('Minimum is GHS 10.');

    setTopupBusy(true);
    try {
      const r = await fetch('https://dataswap-ydgo.onrender.com/api/wallet/add-funds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          email: localStorage.getItem('email') || '',
          amount: v,
          paymentMethod: 'paystack',
        }),
      });
      const data = await r.json();
      if (data?.success && data.authorizationUrl) {
        window.location.href = data.authorizationUrl;
        return;
      }
      setTopupErr(data?.error || 'Top-up failed. Try again.');
    } catch (_) {
      setTopupErr('Network error. Try again.');
    } finally {
      setTopupBusy(false);
    }
  }

  const handleLogout = () => {
    ['userId','username','token','userrole','email'].forEach(k => localStorage.removeItem(k));
    setIsLoggedIn(false);
    setMobileOpen(false);
    setLogoutToast(true);
    setTimeout(() => { setLogoutToast(false); router.push('/Auth'); }, 1200);
  };

  const isAdmin = userRole === 'adm';
  const linkActive = (href) =>
    pathname === href
      ? 'text-[var(--color-brand-blue-deep)] bg-[var(--color-brand-blue-soft)]'
      : 'text-[var(--color-ink-soft)] hover:text-[var(--color-brand-navy)] hover:bg-[var(--color-surface-muted)]';
  const drawerLink = (href) =>
    pathname === href
      ? 'text-[var(--color-ink)] bg-[var(--color-surface-muted)]'
      : 'text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-muted)]';

  // ID display: "ID-XXXXXX" from last chars of MongoDB ObjectId
  const displayId = userId ? `ID-${userId.slice(-6).toUpperCase()}` : '';

  return (
    <>
      {logoutToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[90] card px-5 py-3 flex items-center gap-3 animate-fadeInDown">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-soft" />
          <span className="text-sm font-medium text-[var(--color-ink)]">Signed out — redirecting…</span>
        </div>
      )}

      <nav className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-[var(--color-line)]">
        <div className="container mx-auto px-4">
          <div className="h-16 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Logo size={32} />

              <div className="hidden lg:flex items-center gap-1">
                <Link href="/" className={`px-3 py-2 rounded-lg text-sm font-medium inline-flex items-center gap-2 transition-colors ${linkActive('/')}`}>
                  <Home size={16} /> Home
                </Link>

                <div className="relative" id="networks-dropdown">
                  <button
                    onClick={() => setNetworksOpen(v => !v)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium inline-flex items-center gap-2 transition-colors ${linkActive('/__never__')}`}
                  >
                    <ShoppingBag size={16} /> Buy Data
                    <ChevronDown size={14} className={`transition-transform ${networksOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {networksOpen && (
                    <div className="absolute top-full left-0 mt-2 w-56 card p-2 animate-scaleIn">
                      {networkProviders.map(p => (
                        <Link
                          key={p.id}
                          href={`/${p.id}`}
                          onClick={() => setNetworksOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[var(--color-ink)] hover:bg-[var(--color-surface-muted)]"
                        >
                          <span className="w-2.5 h-2.5 rounded-full" style={{ background: p.dot }} />
                          {p.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <Link href="/deposite" className={`px-3 py-2 rounded-lg text-sm font-medium inline-flex items-center gap-2 transition-colors ${linkActive('/deposite')}`}>
                  <Wallet size={16} /> Top up
                </Link>
                <Link href="/orders" className={`px-3 py-2 rounded-lg text-sm font-medium inline-flex items-center gap-2 transition-colors ${linkActive('/orders')}`}>
                  <Receipt size={16} /> Orders
                </Link>
                {isAdmin && (
                  <Link href="/admin" className={`px-3 py-2 rounded-lg text-sm font-medium inline-flex items-center gap-2 transition-colors ${linkActive('/admin')}`}>
                    <Settings size={16} /> Admin
                  </Link>
                )}
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-3">
              {isLoggedIn ? (
                <>
                  {/* Wallet trigger — opens rich panel */}
                  <div className="relative">
                    <button
                      id="wallet-trigger"
                      onClick={() => setWalletPanelOpen(v => !v)}
                      aria-expanded={walletPanelOpen}
                      className="group flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--color-brand-blue-soft)] border border-[rgba(30,136,255,.18)] hover:border-[var(--color-brand-blue)] transition-colors"
                    >
                      <Wallet size={14} className="text-[var(--color-brand-blue-deep)]" />
                      <span className="text-xs text-[var(--color-ink-muted)]">Bal</span>
                      <span className="text-sm font-bold text-[var(--color-brand-navy)] tabular-nums">
                        GH₵{Number(walletBalance).toFixed(2)}
                      </span>
                      <ChevronDown size={12} className={`text-[var(--color-ink-muted)] transition-transform ${walletPanelOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {walletPanelOpen && (
                      <div
                        id="wallet-panel"
                        className="absolute right-0 top-full mt-2 w-80 card overflow-hidden animate-scaleIn z-[60]"
                      >
                        {/* Balance */}
                        <div className="p-5 border-b border-[var(--color-line)] bg-[var(--color-surface-muted)]">
                          <p className="text-[10px] uppercase tracking-[.18em] text-[var(--color-ink-muted)] text-center font-bold">
                            Available balance
                          </p>
                          <p className="mt-1.5 text-center text-3xl font-black text-emerald-500 tabular-nums">
                            GH₵{Number(walletBalance).toFixed(2)}
                          </p>
                          <div className="mt-3 grid grid-cols-2 gap-2">
                            <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-2 text-center">
                              <p className="text-[10px] uppercase tracking-wider text-[var(--color-ink-muted)] font-bold">Today in</p>
                              <p className="text-sm font-bold text-emerald-500 tabular-nums">+GH₵{Number(today.credits).toFixed(2)}</p>
                            </div>
                            <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-2 text-center">
                              <p className="text-[10px] uppercase tracking-wider text-[var(--color-ink-muted)] font-bold">Today out</p>
                              <p className="text-sm font-bold text-red-400 tabular-nums">−GH₵{Number(today.debits).toFixed(2)}</p>
                            </div>
                          </div>
                          <div className="mt-3 flex items-center gap-2.5">
                            <span className="w-8 h-8 rounded-full brand-blue-gradient text-white inline-flex items-center justify-center text-xs font-bold shrink-0">
                              {(username || 'U').slice(0, 1).toUpperCase()}
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-[var(--color-ink)] truncate">{username}</span>
                                {isAdmin && <span className="chip-orange chip">ADMIN</span>}
                              </div>
                              <p className="text-[10px] text-[var(--color-ink-muted)] font-mono">{displayId}</p>
                            </div>
                          </div>
                        </div>

                        {/* Add money */}
                        <form onSubmit={handleQuickTopup} className="p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="w-7 h-7 rounded-lg brand-blue-gradient inline-flex items-center justify-center">
                              <Wallet size={14} className="text-white" />
                            </span>
                            <h3 className="font-bold text-[var(--color-ink)] text-sm">Add Money</h3>
                          </div>
                          <div className="grid grid-cols-[1fr_auto] gap-2">
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--color-ink-muted)] font-semibold">₵</span>
                              <input
                                type="number" inputMode="decimal" min="10" step="0.01"
                                value={topupAmount}
                                onChange={(e) => { setTopupAmount(e.target.value); setTopupErr(''); }}
                                placeholder="Enter amount"
                                className="input pl-7 !py-2 text-sm"
                              />
                            </div>
                            <button
                              type="submit"
                              disabled={topupBusy}
                              className="px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold inline-flex items-center gap-1.5 disabled:opacity-60 transition-colors"
                            >
                              {topupBusy ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                              Topup
                            </button>
                          </div>
                          {topupErr && <p className="mt-2 text-xs text-red-400">{topupErr}</p>}
                          <p className="mt-2 text-[10px] text-[var(--color-ink-subtle)]">Min top-up: GHS 10.00 · Secured by Paystack</p>

                          <Link
                            href="/deposite"
                            onClick={() => setWalletPanelOpen(false)}
                            className="mt-3 w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-[var(--color-line)] hover:border-emerald-500/40 hover:bg-emerald-500/10 text-xs font-semibold text-[var(--color-ink)] transition-colors"
                          >
                            <CreditCard size={12} /> More options
                          </Link>
                        </form>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pl-2">
                    <span className="w-8 h-8 rounded-full brand-blue-gradient text-white inline-flex items-center justify-center text-xs font-bold">
                      {(username || 'U').slice(0, 1).toUpperCase()}
                    </span>
                    <span className="text-sm font-medium text-[var(--color-ink)]">{username}</span>
                    {isAdmin && <span className="chip-orange chip">ADMIN</span>}
                  </div>

                  <ThemeToggle compact />
                  <button onClick={handleLogout} className="btn-ghost !py-2 !px-3 text-sm">
                    <LogOut size={16} /> Sign out
                  </button>
                </>
              ) : (
                <>
                  <ThemeToggle compact />
                  <Link href="/Auth" className="btn-ghost !py-2 !px-4 text-sm">Sign in</Link>
                  <Link href="/Auth" className="btn-primary !py-2 !px-4 text-sm">
                    Get started <ArrowRight size={16} />
                  </Link>
                </>
              )}
            </div>

            <div className="flex items-center gap-2 lg:hidden">
              {isLoggedIn && (
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[var(--color-brand-blue-soft)] border border-[rgba(30,136,255,.18)]">
                  <Wallet size={13} className="text-[var(--color-brand-blue-deep)]" />
                  <span className="text-xs font-bold text-[var(--color-brand-navy)]">
                    GHS {Number(walletBalance).toFixed(2)}
                  </span>
                </div>
              )}
              <ThemeToggle compact />
              <button
                id="menu-button"
                onClick={() => setMobileOpen(v => !v)}
                className="p-2 rounded-lg border border-[var(--color-line)] text-[var(--color-ink)] hover:bg-[var(--color-surface-muted)]"
                aria-expanded={mobileOpen}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Mobile drawer + overlay (siblings of nav, top stacking) ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/55 backdrop-blur-[2px] z-[70] lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        id="mobile-menu"
        className={`fixed top-0 left-0 h-full w-[88%] max-w-sm bg-[var(--color-surface)] border-r border-[var(--color-line)] shadow-2xl z-[80] transform transition-transform duration-300 lg:hidden flex flex-col ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full pointer-events-none'
        }`}
        aria-hidden={!mobileOpen}
      >
        {/* Header */}
        <div className="px-5 py-4 flex items-center justify-between border-b border-[var(--color-line)]">
          <h2 className="text-xl font-black text-[var(--color-ink)]">Account</h2>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 -mr-2 rounded-lg text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-muted)]"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body — scrollable. Balance + Add Money sit at the top so
            users see them without scrolling; menu lives below. */}
        <div className="flex-1 overflow-y-auto">
          {/* ── Balance card ── */}
          {isLoggedIn && (
            <div className="px-4 pt-4">
              <div className="rounded-2xl p-5 border border-[var(--color-line)] bg-[var(--color-surface-muted)]">
                <p className="text-[10px] uppercase tracking-[.18em] text-[var(--color-ink-muted)] text-center font-bold">
                  Available balance
                </p>
                <p className="mt-2 text-center text-4xl font-black text-emerald-500 tabular-nums">
                  GH₵{Number(walletBalance).toFixed(2)}
                </p>

                <div className="mt-3 flex items-center justify-between text-xs px-2">
                  <span className="text-[var(--color-ink-muted)] uppercase tracking-wider">Today</span>
                  <span className="text-emerald-500 font-semibold">+GH₵{Number(today.credits).toFixed(2)}</span>
                  <span className="text-red-400 font-semibold">−GH₵{Number(today.debits).toFixed(2)}</span>
                </div>

                <div className="mt-4 pt-4 border-t border-[var(--color-line)] flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full brand-blue-gradient text-white inline-flex items-center justify-center text-sm font-bold shrink-0">
                    {(username || 'U').slice(0, 1).toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[var(--color-ink)] truncate">{username}</span>
                      {isAdmin && <span className="chip-orange chip">ADMIN</span>}
                    </div>
                    <p className="text-xs text-[var(--color-ink-muted)] font-mono">{displayId}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Add money ── */}
          {isLoggedIn && (
            <form onSubmit={handleQuickTopup} className="px-4 pt-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-8 h-8 rounded-lg brand-blue-gradient inline-flex items-center justify-center">
                  <Wallet size={16} className="text-white" />
                </span>
                <h3 className="font-bold text-[var(--color-ink)]">Add Money</h3>
              </div>

              <Link
                href="/deposite"
                onClick={() => setMobileOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-emerald-500/40 text-emerald-500 hover:bg-emerald-500/10 text-sm font-semibold transition-colors"
              >
                <CreditCard size={14} /> Paystack
              </Link>

              <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--color-ink-muted)] font-semibold">₵</span>
                  <input
                    type="number" inputMode="decimal" min="10" step="0.01"
                    value={topupAmount}
                    onChange={(e) => { setTopupAmount(e.target.value); setTopupErr(''); }}
                    placeholder="Enter amount"
                    className="input pl-7 !py-2.5 text-sm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={topupBusy}
                  className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold inline-flex items-center gap-1.5 disabled:opacity-60 transition-colors"
                >
                  {topupBusy ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                  Topup
                </button>
              </div>
              {topupErr && <p className="mt-2 text-xs text-red-400">{topupErr}</p>}
              <p className="mt-2 text-[11px] text-[var(--color-ink-subtle)]">Minimum top-up: GHS 10.00</p>
            </form>
          )}

          {/* ── Nav list (below balance/topup) ── */}
          <nav className="px-3 pt-4 pb-2 space-y-0.5">
            <Link href="/" onClick={() => setMobileOpen(false)} className={`flex items-center gap-3 px-3 py-3 rounded-lg text-[15px] font-medium ${drawerLink('/')}`}>
              <Home size={18} /> Dashboard
            </Link>
            <Link href="/orders" onClick={() => setMobileOpen(false)} className={`flex items-center gap-3 px-3 py-3 rounded-lg text-[15px] font-medium ${drawerLink('/orders')}`}>
              <Receipt size={18} /> Orders
            </Link>
            <Link href="/deposite" onClick={() => setMobileOpen(false)} className={`flex items-center gap-3 px-3 py-3 rounded-lg text-[15px] font-medium ${drawerLink('/deposite')}`}>
              <Wallet size={18} /> Top up wallet
            </Link>

            {/* Collapsible Buy data */}
            <button
              onClick={() => setBuyDataOpen(v => !v)}
              aria-expanded={buyDataOpen}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-[15px] font-medium text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-muted)]`}
            >
              <ShoppingBag size={18} />
              Buy data
              <ChevronDown size={16} className={`ml-auto transition-transform ${buyDataOpen ? 'rotate-180' : ''}`} />
            </button>
            <div
              className={`overflow-hidden transition-[max-height,opacity] duration-300 ${buyDataOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}
            >
              <div className="pl-3 ml-3 border-l border-[var(--color-line)] space-y-0.5">
                {networkProviders.map(p => (
                  <Link
                    key={p.id}
                    href={`/${p.id}`}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${drawerLink(`/${p.id}`)}`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: p.dot }} />
                    {p.name}
                  </Link>
                ))}
              </div>
            </div>

            {isAdmin && (
              <div className="pt-2">
                <p className="px-3 pb-1 text-[10px] uppercase tracking-wider font-bold text-[var(--color-ink-subtle)]">
                  Admin
                </p>
                <Link href="/admin" onClick={() => setMobileOpen(false)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${drawerLink('/admin')}`}>
                  <Settings size={16} /> Dashboard
                </Link>
                <Link href="/users" onClick={() => setMobileOpen(false)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${drawerLink('/users')}`}>
                  <Users size={16} /> Manage users
                </Link>
              </div>
            )}

            {isLoggedIn && (
              <button onClick={handleLogout} className="w-full mt-2 flex items-center gap-3 px-3 py-3 rounded-lg text-[15px] font-medium text-[var(--color-danger)] hover:bg-[rgba(220,38,38,.08)]">
                <LogOut size={18} /> Log out
              </button>
            )}
          </nav>

          {!isLoggedIn && (
            <div className="px-4 pt-4 grid grid-cols-2 gap-2">
              <Link href="/Auth" onClick={() => setMobileOpen(false)} className="btn-ghost text-sm">
                Sign in
              </Link>
              <Link href="/Auth" onClick={() => setMobileOpen(false)} className="btn-primary text-sm">
                Get started
              </Link>
            </div>
          )}

          <div className="h-4" />
        </div>

        {/* Footer — theme toggle */}
        <div className="px-4 py-3 border-t border-[var(--color-line)] bg-[var(--color-surface)]">
          <ThemeToggle className="w-full" />
        </div>
      </aside>
    </>
  );
}
