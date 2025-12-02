'use client';

import Link from 'next/link';
import { BookOpen, ShoppingCart, User, Menu, X, Newspaper, LogOut } from 'lucide-react';
import { useState } from 'react';
import { signOut, type User as FirebaseUser } from 'firebase/auth';

import Logo from '@/components/shared/logo';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-provider';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useUser } from '@/firebase';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useAuth } from '@/firebase';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Books' },
  { href: '/articles', label: 'Articles' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

function UserNav({user}: {user: FirebaseUser | null}) {
  const auth = useAuth();
  
  const handleSignOut = async () => {
    if (auth) {
      await signOut(auth);
    }
  };

  if (!user) {
    return (
       <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/login">
            <User className="h-5 w-5" />
            <span className="sr-only">Account</span>
          </Link>
        </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? ''} />
            <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


export default function Header() {
  const { cart } = useCart();
  const { user } = useUser();
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const NavLinks = ({ className }: { className?: string }) => (
    <nav className={cn("flex items-center gap-6 text-sm font-medium", className)}>
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="text-foreground/80 transition-colors hover:text-foreground"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          {link.label}
        </Link>
      ))}
      {user?.isAdmin && <Link href="/admin" className="text-foreground/80 transition-colors hover:text-foreground">Admin</Link>}
    </nav>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b supports-[backdrop-filter]:bg-background/60 border-white/20 bg-white/10 backdrop-blur-md">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
            <Logo />
        </div>
        
        <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Menu />
                        <span className="sr-only">Toggle Menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] bg-background/80 backdrop-blur-md border-r border-white/20 p-0">
                  <div className="flex flex-col h-full">
                    <div className="border-b p-4 border-white/20">
                      <Logo />
                    </div>
                    <div className="p-4">
                      <NavLinks className="flex-col items-start gap-4" />
                    </div>
                  </div>
                </SheetContent>
            </Sheet>
        </div>

        <div className="hidden md:flex flex-1 items-center justify-center">
          <NavLinks />
        </div>

        <div className="flex flex-1 items-center justify-end gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {cartItemCount}
                </span>
              )}
              <span className="sr-only">Cart</span>
            </Link>
          </Button>
          <UserNav user={user} />
        </div>
      </div>
    </header>
  );
}
