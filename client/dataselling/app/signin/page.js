'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SigninRedirect() {
  const router = useRouter();
  useEffect(() => { router.replace('/Auth'); }, [router]);
  return null;
}
