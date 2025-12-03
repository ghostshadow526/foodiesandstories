
'use client';
import { Book, Home, Newspaper, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navLinks = [
    { href: '/admin', label: 'Dashboard', icon: Home },
    { href: '/admin/books', label: 'Books', icon: Book },
    { href: '/admin/articles', label: 'Articles', icon: Newspaper },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    return (
        <div className="flex min-h-screen">
            <aside className="w-64 bg-card border-r p-4 hidden md:flex flex-col">
                <h2 className="font-headline text-2xl font-bold mb-8">Admin Panel</h2>
                <nav className="flex flex-col gap-2">
                    {navLinks.map(link => (
                        <Link key={link.href} href={link.href} className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                            pathname === link.href && "bg-muted text-primary"
                        )}>
                           <link.icon className="h-4 w-4" />
                           {link.label}
                        </Link>
                    ))}
                </nav>
            </aside>
            <div className="flex-1 p-8">
                {children}
            </div>
        </div>
    );
}
