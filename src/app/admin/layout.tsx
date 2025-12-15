
'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUser } from '@/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Book, Newspaper, LogOut, Package, Star } from 'lucide-react';
import Logo from '@/components/shared/logo';
import { useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';


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
    
    const navItems = [
      { href: '/admin/orders', label: 'Orders', icon: Package },
      { href: '/admin/books', label: 'Books', icon: Book },
      { href: '/admin/featured', label: 'Featured', icon: Star },
      { href: '/admin/articles', label: 'Articles', icon: Newspaper },
    ]

    return (
        <aside className="w-64 h-screen bg-card border-r flex flex-col">
            <div className="p-4 border-b">
                <Link href="/"><Logo /></Link>
            </div>
            <nav className="flex-1 p-4 space-y-2">
                {navItems.map(item => {
                  const isActive = pathname === item.href;
                  return (
                    <Button key={item.label} variant={isActive ? "secondary" : "ghost"} className="w-full justify-start" asChild>
                        <Link href={item.href}><item.icon className="mr-2 h-4 w-4" /> {item.label}</Link>
                    </Button>
                  )
                })}
            </nav>
            <div className="p-4 border-t">
                <Button variant="ghost" className="w-full justify-start" onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </Button>
            </div>
        </aside>
    )
}


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if loading is finished and there's no user.
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // While loading, show a skeleton screen.
  // Do not attempt to render children or redirect.
  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="flex items-center space-x-2">
           <div className="space-y-2">
            <h2 className='text-xl font-semibold'>Authenticating...</h2>
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      </div>
    );
  }

  // If loading is finished and we have a user, show the admin layout.
  if (user) {
    return (
      <div className="flex">
          <AdminSidebar />
          <main className="flex-1 p-8 bg-muted/40">
              {children}
          </main>
      </div>
    );
  }

  // If loading is finished and there's no user, this will be briefly rendered
  // before the useEffect redirects to '/login'.
  return null;
}
