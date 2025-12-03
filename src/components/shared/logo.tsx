import Link from 'next/link';
import { BookMarked } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      <BookMarked className="h-7 w-7 text-primary" />
      <span className="font-headline text-2xl font-bold tracking-tight">
        ICESTORES
      </span>
    </Link>
  );
}
