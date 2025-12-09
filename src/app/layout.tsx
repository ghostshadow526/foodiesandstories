
'use client';
import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import { CartProvider } from '@/context/cart-provider';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { cn } from '@/lib/utils';
import './globals.css';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { usePathname } from 'next/navigation';

// This is a workaround to make Metadata work in a client component
// We can't move the layout to a server component because of the providers
// export const metadata: Metadata = {
//   title: 'ICESTORIES',
//   description: 'A luxurious online bookstore for premium books and articles.',
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>ICESTORIES</title>
        <meta name="description" content="A luxurious online bookstore for premium books and articles." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet" />
      </head>
      <body className={cn("font-body antialiased", "min-h-screen bg-background font-sans")}>
        <FirebaseClientProvider>
          <CartProvider>
            <div className={cn("relative flex min-h-screen flex-col", { 'bg-background': !isAdminRoute })}>
              {!isAdminRoute && <Header />}
              <main className={cn({ "flex-1": !isAdminRoute })}>{children}</main>
              {!isAdminRoute && <Footer />}
            </div>
            <Toaster />
          </CartProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
