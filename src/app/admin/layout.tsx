
'use client';
import { Book, Home, Newspaper, LogOut, Shield } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useUser, useAuth } from '@/firebase';
import { useEffect } from 'react';
import Logo from '@/components/shared/logo';
import { Button } from '@/components/ui/button';
import { signOut } from 'firebase/auth';

const navLinks = [
    { href: '/admin', label: 'Dashboard', icon: Home },
    { href: '/admin/books', label: 'Books', icon: Book },
    { href: '/admin/articles', label: 'Articles', icon: Newspaper },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { user, loading } = useUser();
    const auth = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user?.isAdmin) {
            router.push('/admin/login');
        }
    }, [user, loading, router, pathname]);

    const handleSignOut = async () => {
        if (auth) {
          await signOut(auth);
          router.push('/admin/login');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div>Loading...</div>
            </div>
        );
    }
    
    if (pathname === '/admin/login') {
        return <div className="bg-muted min-h-screen">{children}</div>;
    }

    if (!user?.isAdmin) {
        return null;
    }

    return (
        <div className="flex min-h-screen bg-muted/40">
            <aside className="w-64 bg-card border-r p-4 hidden md:flex flex-col">
                <div className="mb-8">
                  <Logo />
                </div>
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
                <div className="mt-auto">
                    <Button variant="ghost" className="w-full justify-start" onClick={handleSignOut}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Log Out
                    </Button>
                </div>
            </aside>
            <div className="flex-1 p-4 sm:p-6 lg:p-8">
                {children}
            </div>
        </div>
    );
}
