
'use client';
import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import { CartProvider } from '@/context/cart-provider';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { cn } from '@/lib/utils';
import './globals.css';
import { FirebaseClientProvider } from '@/firebase/client-provider';

// This is a workaround to make Metadata work in a client component
// We can't move the layout to a server component because of the providers
// export const metadata: Metadata = {
//   title: 'ICESTORES',
//   description: 'A luxurious online bookstore for premium books and articles.',
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>ICESTORES</title>
        <meta name="description" content="A luxurious online bookstore for premium books and articles." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet" />
      </head>
      <body className={cn("font-body antialiased", "min-h-screen bg-background font-sans")}>
        <FirebaseClientProvider>
          <CartProvider>
            <div className="relative flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster />
          </CartProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
