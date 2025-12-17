
'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import Logo from '@/components/shared/logo';
import { Button } from '@/components/ui/button';
import { Book, Newspaper, LogOut, Package, Star } from 'lucide-react';

const navItems = [
  { href: '/admin/orders', label: 'Orders', icon: Package },
  { href: '/admin/books', label: 'Books', icon: Book },
  { href: '/admin/articles', label: 'Articles', icon: Newspaper },
  { href: '/admin/featured', label: 'Featured', icon: Star },
];

function AdminSidebar() {
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = async () => {
    if (auth) {
      await signOut(auth);
      router.push('/login');
    }
  };

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-card">
      <div className="border-b p-4">
        <Logo />
      </div>
      <nav className="flex-1 space-y-2 p-4">
        {navItems.map((item) => {
          // An admin path is active if it starts with the item's href
          // e.g. /admin/books is active for /admin/books/all
          const isActive = pathname.startsWith(item.href);
          return (
            <Button
              key={item.label}
              variant={isActive ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              asChild
            >
              <Link href={item.href}>
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Link>
            </Button>
          );
        })}
      </nav>
      <div className="border-t p-4">
        <Button variant="ghost" className="w-full justify-start" onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 bg-muted/40 p-8">{children}</main>
    </div>
  );
}
