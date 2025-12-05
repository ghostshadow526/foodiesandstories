'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Book, Newspaper, LogOut } from 'lucide-react';
import Logo from '@/components/shared/logo';
import { useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';


function AdminSidebar() {
    const auth = useAuth();
    const router = useRouter();

    const handleSignOut = async () => {
        if (auth) {
            await signOut(auth);
            router.push('/login');
        }
    };

    return (
        <aside className="w-64 h-screen bg-card border-r flex flex-col">
            <div className="p-4 border-b">
                <Logo />
            </div>
            <nav className="flex-1 p-4 space-y-2">
                <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href="/admin/books"><Book className="mr-2 h-4 w-4" /> Books</Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href="/admin/articles"><Newspaper className="mr-2 h-4 w-4" /> Articles</Link>
                </Button>
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
    if (!loading && !user?.isAdmin) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user?.isAdmin) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-8 bg-background">
            {children}
        </main>
    </div>
    );
}
