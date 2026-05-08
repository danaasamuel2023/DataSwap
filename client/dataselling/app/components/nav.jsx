'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Menu, X, Home, User, LogOut, Users, Wallet,
  ShoppingBag, ChevronDown, ArrowRight, Receipt, Settings
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
  const [username, setUsername] = useState('');
  const [userRole, setUserRole] = useState('');
  const [walletBalance, setWalletBalance] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [networksOpen, setNetworksOpen] = useState(false);
  const [logoutToast, setLogoutToast] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    if (userId) {
      setIsLoggedIn(true);
      setUsername(localStorage.getItem('username') || 'User');
      setUserRole(localStorage.getItem('userrole') || '');
      if (token) fetchBalance(userId, token);
    }

    document.body.style.overflow = mobileOpen ? 'hidden' : 'unset';
    const onClick = (e) => {
      if (mobileOpen && !e.target.closest('#mobile-menu') && !e.target.closest('#menu-button')) {
        setMobileOpen(false);
      }
      if (networksOpen && !e.target.closest('#networks-dropdown')) {
        setNetworksOpen(false);
      }
    };
    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('click', onClick);
      document.body.style.overflow = 'unset';
    };
  }, [mobileOpen, networksOpen]);

  const fetchBalance = async (userId, token) => {
    try {
      const r = await fetch(
        `https://dataswap-ydgo.onrender.com/api/wallet/balance?userId=${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (r.ok) {
        const data = await r.json();
        setWalletBalance(data.balance || 0);
      }
    } catch (_) {}
  };

  const handleLogout = () => {
    ['userId','username','token','userrole'].forEach(k => localStorage.removeItem(k));
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

  return (
    <>
      {logoutToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] card px-5 py-3 flex items-center gap-3 animate-fadeInDown">
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
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--color-brand-blue-soft)] border border-[rgba(30,136,255,.18)]">
                    <Wallet size={14} className="text-[var(--color-brand-blue-deep)]" />
                    <span className="text-xs text-[var(--color-ink-muted)]">Bal</span>
                    <span className="text-sm font-bold text-[var(--color-brand-navy)]">
                      GHS {Number(walletBalance).toFixed(2)}
                    </span>
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

        {/* Mobile drawer */}
        <div
          id="mobile-menu"
          className={`fixed top-0 right-0 h-full w-[88%] max-w-sm bg-white border-l border-[var(--color-line)] shadow-2xl z-50 transform transition-transform duration-300 ${
            mobileOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="p-4 border-b border-[var(--color-line)] flex items-center justify-between">
            <Logo size={28} />
            <button
              onClick={() => setMobileOpen(false)}
              className="p-2 rounded-lg border border-[var(--color-line)] text-[var(--color-ink)]"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          </div>

          {isLoggedIn && (
            <div className="p-4 border-b border-[var(--color-line)]">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-full brand-blue-gradient text-white inline-flex items-center justify-center text-sm font-bold">
                  {(username || 'U').slice(0, 1).toUpperCase()}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[var(--color-ink)]">{username}</span>
                    {isAdmin && <span className="chip-orange chip">ADMIN</span>}
                  </div>
                  <div className="mt-2 flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--color-brand-blue-soft)]">
                    <Wallet size={14} className="text-[var(--color-brand-blue-deep)]" />
                    <span className="text-xs text-[var(--color-ink-muted)]">Wallet</span>
                    <span className="ml-auto text-sm font-bold text-[var(--color-brand-navy)]">
                      GHS {Number(walletBalance).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="px-3 py-4 space-y-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 220px)' }}>
            <Link href="/" onClick={() => setMobileOpen(false)} className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium ${linkActive('/')}`}>
              <Home size={18} /> Home
            </Link>

            <div className="pt-2">
              <p className="px-3 pb-1 text-[11px] uppercase tracking-wider font-bold text-[var(--color-ink-subtle)]">
                Buy data
              </p>
              {networkProviders.map(p => (
                <Link
                  key={p.id}
                  href={`/${p.id}`}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium ${linkActive(`/${p.id}`)}`}
                >
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: p.dot }} />
                  {p.name}
                </Link>
              ))}
            </div>

            <Link href="/deposite" onClick={() => setMobileOpen(false)} className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium ${linkActive('/deposite')}`}>
              <Wallet size={18} /> Top up wallet
            </Link>
            <Link href="/orders" onClick={() => setMobileOpen(false)} className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium ${linkActive('/orders')}`}>
              <Receipt size={18} /> My orders
            </Link>
            {isAdmin && (
              <>
                <Link href="/admin" onClick={() => setMobileOpen(false)} className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium ${linkActive('/admin')}`}>
                  <Settings size={18} /> Admin dashboard
                </Link>
                <Link href="/users" onClick={() => setMobileOpen(false)} className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium ${linkActive('/users')}`}>
                  <Users size={18} /> Manage users
                </Link>
              </>
            )}
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[var(--color-line)] bg-[var(--color-surface)] space-y-2">
            <ThemeToggle className="w-full" />
            {isLoggedIn ? (
              <button onClick={handleLogout} className="btn-ghost w-full !text-[var(--color-danger)] hover:!border-[var(--color-danger)]">
                <LogOut size={16} /> Sign out
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link href="/Auth" onClick={() => setMobileOpen(false)} className="btn-ghost text-sm">
                  Sign in
                </Link>
                <Link href="/Auth" onClick={() => setMobileOpen(false)} className="btn-primary text-sm">
                  Get started
                </Link>
              </div>
            )}
          </div>
        </div>

        {mobileOpen && (
          <div
            className="fixed inset-0 bg-[var(--color-brand-navy)]/40 backdrop-blur-[2px] z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </nav>
    </>
  );
}
