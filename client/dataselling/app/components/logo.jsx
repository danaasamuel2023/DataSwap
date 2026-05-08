import Image from 'next/image';
import Link from 'next/link';

export default function Logo({ size = 36, withWordmark = false, href = '/', className = '' }) {
  const inner = (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <Image
        src="/dataswap-logo.jpeg"
        alt="DataSwap"
        width={size * 3}
        height={size}
        priority
        className="rounded-md object-contain"
        style={{ height: size, width: 'auto' }}
      />
      {withWordmark && (
        <span className="hidden sm:inline-flex flex-col leading-tight">
          <span className="text-[10px] uppercase tracking-[0.18em] text-[var(--color-ink-muted)]">
            Ghana data
          </span>
        </span>
      )}
    </span>
  );

  if (!href) return inner;
  return (
    <Link href={href} aria-label="DataSwap home" className="inline-flex items-center">
      {inner}
    </Link>
  );
}
