'use client';

import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

const STORAGE_KEY = 'dataswap-theme';

export default function ThemeToggle({ compact = false, className = '' }) {
  const [theme, setTheme] = useState('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    setTheme(current);
    setMounted(true);

    // Follow system changes only when the user hasn't explicitly chosen.
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e) => {
      if (!localStorage.getItem(STORAGE_KEY)) {
        applyTheme(e.matches ? 'dark' : 'light');
        setTheme(e.matches ? 'dark' : 'light');
      }
    };
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  function applyTheme(next) {
    const html = document.documentElement;
    html.classList.add('theme-changing');
    html.setAttribute('data-theme', next);
    html.style.colorScheme = next;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => html.classList.remove('theme-changing'));
    });
  }

  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    applyTheme(next);
    try { localStorage.setItem(STORAGE_KEY, next); } catch (_) {}
  }

  // Render a stable placeholder until mounted to avoid SSR/CSR mismatch flash.
  if (!mounted) {
    return (
      <button
        aria-label="Toggle theme"
        className={`p-2 rounded-lg border border-[var(--color-line)] text-[var(--color-ink-muted)] ${className}`}
        type="button"
      >
        <Sun size={16} />
      </button>
    );
  }

  const isDark = theme === 'dark';
  const Icon = isDark ? Sun : Moon;
  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';

  if (compact) {
    return (
      <button
        type="button"
        onClick={toggle}
        aria-label={label}
        title={label}
        className={`p-2 rounded-lg border border-[var(--color-line)] text-[var(--color-ink)] hover:bg-[var(--color-surface-muted)] transition-colors ${className}`}
      >
        <Icon size={16} />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border border-[var(--color-line)] text-[var(--color-ink)] hover:bg-[var(--color-surface-muted)] transition-colors ${className}`}
    >
      <Icon size={16} />
      {isDark ? 'Light' : 'Dark'} mode
    </button>
  );
}
