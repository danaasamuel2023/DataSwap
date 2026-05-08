import Link from 'next/link';
import { Phone, Clock, MessageCircle, Mail, ArrowUpRight } from 'lucide-react';
import Logo from './logo';

const Footer = () => {
  const whatsappLink = 'https://whatsapp.com/channel/0029VbB174796H4JCaqzq43S';
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-[var(--color-line)] mt-20">
      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div>
            <Logo size={36} />
            <p className="mt-4 text-sm leading-relaxed text-[var(--color-ink-muted)] max-w-xs">
              Ghana&rsquo;s easiest way to buy MTN, Telecel and AT data bundles. Top up
              once, send to any number in seconds.
            </p>
            <div className="mt-5 flex items-center gap-2">
              <span className="chip">MTN</span>
              <span className="chip-orange chip">Telecel</span>
              <span className="chip-success chip">AT</span>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-sm font-bold text-[var(--color-ink)] mb-4 inline-flex items-center gap-2">
              <Clock size={16} className="text-[var(--color-brand-orange)]" /> Operating hours
            </h3>
            <ul className="space-y-3 text-sm text-[var(--color-ink-muted)]">
              <li>
                <p className="font-medium text-[var(--color-ink)]">Monday &ndash; Saturday</p>
                <p>8:00 AM &ndash; 9:00 PM</p>
              </li>
              <li>
                <p className="font-medium text-[var(--color-ink)]">Sunday</p>
                <p>Orders processed Monday morning</p>
              </li>
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-sm font-bold text-[var(--color-ink)] mb-4">Quick links</h3>
            <ul className="space-y-2.5">
              {[
                ['Home', '/'],
                ['MTN data', '/mtn'],
                ['Telecel data', '/telecel'],
                ['AT data', '/at'],
                ['AFA registration', '/afa'],
                ['Order history', '/orders'],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="group inline-flex items-center gap-1 text-sm text-[var(--color-ink-muted)] hover:text-[var(--color-brand-blue-deep)] transition-colors"
                  >
                    {label}
                    <ArrowUpRight
                      size={12}
                      className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold text-[var(--color-ink)] mb-4 inline-flex items-center gap-2">
              <MessageCircle size={16} className="text-[var(--color-brand-blue)]" /> Get in touch
            </h3>
            <div className="space-y-3">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl border border-[var(--color-line)] hover:border-[var(--color-brand-blue)] hover:bg-[var(--color-brand-blue-soft)] transition-colors group"
              >
                <span className="w-9 h-9 rounded-lg brand-blue-gradient text-white inline-flex items-center justify-center">
                  <MessageCircle size={16} />
                </span>
                <div className="text-sm">
                  <p className="text-xs text-[var(--color-ink-muted)]">WhatsApp channel</p>
                  <p className="font-medium text-[var(--color-ink)]">Join updates</p>
                </div>
              </a>
              <a
                href="mailto:support@dataswap.gh"
                className="flex items-center gap-3 p-3 rounded-xl border border-[var(--color-line)] hover:border-[var(--color-brand-orange)] hover:bg-[var(--color-brand-orange-soft)] transition-colors"
              >
                <span className="w-9 h-9 rounded-lg brand-orange-gradient text-white inline-flex items-center justify-center">
                  <Mail size={16} />
                </span>
                <div className="text-sm">
                  <p className="text-xs text-[var(--color-ink-muted)]">Email</p>
                  <p className="font-medium text-[var(--color-ink)]">support@dataswap.gh</p>
                </div>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-[var(--color-line)] pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--color-ink-muted)]">
            &copy; {year} <span className="font-semibold text-[var(--color-brand-navy)]">DataSwap</span>. All rights reserved.
          </p>
          <div className="flex items-center gap-5 text-xs">
            <Link href="#" className="text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]">Privacy</Link>
            <Link href="#" className="text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]">Terms</Link>
            <Link href="#" className="text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
