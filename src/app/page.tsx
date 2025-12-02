import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { mockProducts } from '@/lib/data';
import ProductCard from '@/components/shared/product-card';

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-1');
  const featuredProducts = mockProducts.slice(0, 4);

  return (
    <div className="flex flex-col gap-16 md:gap-24">
      <section className="relative h-[60vh] w-full">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            priority
            data-ai-hint={heroImage.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white p-4">
          <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            Prestige Pages
          </h1>
          <p className="mt-4 max-w-2xl text-lg md:text-xl text-primary-foreground/90">
            Discover a curated collection of timeless books and insightful articles. Your journey into literary excellence begins here.
          </p>
          <Button asChild size="lg" className="mt-8 bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href="/products">Explore Collection</Link>
          </Button>
        </div>
      </section>

      <section className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="font-headline text-3xl md:text-4xl font-bold">Featured Books</h2>
          <p className="mt-2 text-lg text-muted-foreground">Handpicked selections for the discerning reader.</p>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="text-center mt-12">
            <Button asChild size="lg" variant="outline">
                <Link href="/products">View All Books</Link>
            </Button>
        </div>
      </section>

      <section className="bg-secondary py-20">
        <div className="container mx-auto px-4 text-center">
            <h2 className="font-headline text-3xl md:text-4xl font-bold">Why Choose Prestige Pages?</h2>
            <div className="mt-8 grid max-w-4xl mx-auto grid-cols-1 md:grid-cols-3 gap-8 text-left">
                <div className="p-6 rounded-lg">
                    <h3 className="font-headline text-xl font-semibold">Expert Curation</h3>
                    <p className="mt-2 text-muted-foreground">Each book and article is selected by our team of literary experts to ensure the highest quality.</p>
                </div>
                <div className="p-6 rounded-lg">
                    <h3 className="font-headline text-xl font-semibold">Exclusive Content</h3>
                    <p className="mt-2 text-muted-foreground">Access a library of exclusive content you won't find anywhere else.</p>
                </div>
                <div className="p-6 rounded-lg">
                    <h3 className="font-headline text-xl font-semibold">Seamless Experience</h3>
                    <p className="mt-2 text-muted-foreground">From browsing to purchase, enjoy a smooth, elegant, and secure user experience.</p>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
}
