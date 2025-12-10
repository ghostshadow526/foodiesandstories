import Link from 'next/link';
import Logo from '@/components/shared/logo';

export default function Footer() {
  return (
    <footer className="bg-transparent">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Logo />
          </div>
          <nav className="flex gap-6 font-medium text-foreground/80">
            <Link href="/about" className="hover:text-foreground">About</Link>
            <Link href="/contact" className="hover:text-foreground">Contact</Link>
            <Link href="/terms-of-service" className="hover:text-foreground">Terms of Service</Link>
            <Link href="/privacy-policy" className="hover:text-foreground">Privacy Policy</Link>
          </nav>
        </div>
        <div className="mt-8 border-t pt-4 text-center text-muted-foreground text-sm">
          <p>&copy; {new Date().getFullYear()} ICESTORIES. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
