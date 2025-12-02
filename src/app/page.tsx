'use client';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { mockProducts } from '@/lib/data';
import ProductCard from '@/components/shared/product-card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from '@/components/ui/card';

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-1');
  const featuredProducts = mockProducts.slice(0, 4);
  const newArrivals = mockProducts.slice(4, 8);

  return (
    <div className="flex flex-col gap-16 md:gap-24">
      <section className="relative h-[70vh] w-full">
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
          <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight animate-fade-in-up">
            Prestige Pages
          </h1>
          <p className="mt-4 max-w-2xl text-lg md:text-xl text-primary-foreground/90 animate-fade-in-up [animation-delay:200ms]">
            Discover a curated collection of timeless books and insightful articles. Your journey into literary excellence begins here.
          </p>
          <Button asChild size="lg" className="mt-8 border border-white/30 bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/30 animate-fade-in-up [animation-delay:400ms]">
            <Link href="/products">Explore Collection</Link>
          </Button>
        </div>
      </section>

      <section className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="font-headline text-3xl md:text-4xl font-bold">New Arrivals</h2>
          <p className="mt-2 text-lg text-muted-foreground">Freshly added to our exclusive collection.</p>
        </div>
        <div className="mt-8">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent>
                {newArrivals.map((product, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/4">
                    <div className="p-1">
                      <ProductCard product={product} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex" />
              <CarouselNext className="hidden md:flex" />
            </Carousel>
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
                <div className="p-6 rounded-lg transition-transform hover:scale-105">
                    <h3 className="font-headline text-xl font-semibold">Expert Curation</h3>
                    <p className="mt-2 text-muted-foreground">Each book and article is selected by our team of literary experts to ensure the highest quality.</p>
                </div>
                <div className="p-6 rounded-lg transition-transform hover:scale-105">
                    <h3 className="font-headline text-xl font-semibold">Exclusive Content</h3>
                    <p className="mt-2 text-muted-foreground">Access a library of exclusive content you won't find anywhere else.</p>
                </div>
                <div className="p-6 rounded-lg transition-transform hover:scale-105">
                    <h3 className="font-headline text-xl font-semibold">Seamless Experience</h3>
                    <p className="mt-2 text-muted-foreground">From browsing to purchase, enjoy a smooth, elegant, and secure user experience.</p>
                </div>
            </div>
        </div>
      </section>

       <section className="container mx-auto px-4 mb-16 md:mb-24">
        <div className="text-center">
          <h2 className="font-headline text-3xl md:text-4xl font-bold">From Our Journal</h2>
          <p className="mt-2 text-lg text-muted-foreground">Insights, interviews, and inspiration for the literary mind.</p>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
          <Card className="overflow-hidden transition-shadow hover:shadow-lg">
            <Image src="https://picsum.photos/seed/journal1/600/400" alt="Journal Entry 1" width={600} height={400} className="object-cover" data-ai-hint="reading writer" />
            <CardContent className="p-6">
              <h3 className="font-headline text-xl font-semibold mb-2">The Enduring Power of Classic Literature</h3>
              <p className="text-muted-foreground mb-4">Discover why the classics remain relevant and powerful in our modern world.</p>
              <Button variant="link" asChild><Link href="#">Read More</Link></Button>
            </CardContent>
          </Card>
           <Card className="overflow-hidden transition-shadow hover:shadow-lg">
            <Image src="https://picsum.photos/seed/journal2/600/400" alt="Journal Entry 2" width={600} height={400} className="object-cover" data-ai-hint="author interview" />
            <CardContent className="p-6">
              <h3 className="font-headline text-xl font-semibold mb-2">An Interview with a Modern Wordsmith</h3>
              <p className="text-muted-foreground mb-4">We sit down with a bestselling author to discuss their creative process.</p>
               <Button variant="link" asChild><Link href="#">Read More</Link></Button>
            </CardContent>
          </Card>
           <Card className="overflow-hidden transition-shadow hover:shadow-lg">
            <Image src="https://picsum.photos/seed/journal3/600/400" alt="Journal Entry 3" width={600} height={400} className="object-cover" data-ai-hint="cozy library" />
            <CardContent className="p-6">
              <h3 className="font-headline text-xl font-semibold mb-2">Creating the Perfect Reading Nook</h3>
              <p className="text-muted-foreground mb-4">Tips and tricks for designing a space that invites you to get lost in a book.</p>
              <Button variant="link" asChild><Link href="#">Read More</Link></Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

    