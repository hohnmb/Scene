'use client';
import Link from 'next/link';
import { useSavedStore } from '@/stores/useSavedStore';
import { Heart } from 'lucide-react';
import { useState, useEffect } from 'react';

export function Header() {
  const saved = useSavedStore(s => s.saved);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-40 w-full bg-black/50 backdrop-blur-md border-b border-[var(--color-border-subtle)]">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between h-16 px-4 md:px-6">
        <Link href="/" className="text-2xl font-bold tracking-tight text-[var(--color-brand-primary)]">
          SCENE
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/explore" className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
            탐색
          </Link>
          <Link href="/saved" className="flex items-center gap-1.5 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
            <Heart className="w-4 h-4" />
            <span className="hidden sm:inline">찜 목록</span>
            {mounted && saved.length > 0 && (
              <span className="bg-[var(--color-brand-accent)] text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-1">
                {saved.length}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
