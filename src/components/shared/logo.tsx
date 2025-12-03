import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export default function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      <Image 
        src="https://raw.githubusercontent.com/ghostshadow526/CRUISESHIP/main/ICE.png" 
        alt="ICESTORES Logo" 
        width={40} 
        height={40} 
        className="h-10 w-10 drop-shadow-lg"
        priority
      />
      <span className="font-headline text-2xl font-bold tracking-tight">
        ICESTORES
      </span>
    </Link>
  );
}
