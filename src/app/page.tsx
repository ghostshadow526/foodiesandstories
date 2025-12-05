
'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useFirestore } from '@/firebase';
import { collection, getDocs, limit, query, orderBy } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { Product, Article } from '@/lib/types';
import ProductCard from '@/components/shared/product-card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-1');
  
  const firestore = useFirestore();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [journalEntries, setJournalEntries] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firestore) return;

    const fetchHomePageData = async () => {
      setLoading(true);
      try {
        // Fetch New Arrivals (latest 8 products)
        const productsRef = collection(firestore, 'products');
        const newArrivalsQuery = query(productsRef, orderBy('name', 'desc'), limit(8));
        const newArrivalsSnapshot = await getDocs(newArrivalsQuery);
        const newArrivalsData = newArrivalsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        setNewArrivals(newArrivalsData.slice(0, 4));
        setFeaturedProducts(newArrivalsData.slice(4, 8));


        // Fetch Journal Entries (latest 3 articles)
        const articlesRef = collection(firestore, 'articles');
        const articlesQuery = query(articlesRef, orderBy('publishedAt', 'desc'), limit(3));
        const articlesSnapshot = await getDocs(articlesQuery);
        const articlesData = articlesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Article));
        setJournalEntries(articlesData);

      } catch (error) {
        console.error("Error fetching home page data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomePageData();
  }, [firestore]);


  return (
    <div className="flex flex-col gap-16 md:gap-24 overflow-x-hidden">
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
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white p-4">
          <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight animate-fade-in-up">
            ICESTORES
          </h1>
          <p className="mt-4 max-w-2xl text-lg md:text-xl text-primary-foreground/90 animate-fade-in-up [animation-delay:200ms]">
            Discover a curated collection of timeless books and insightful articles. Your journey into literary excellence begins here.
          </p>
          <Button asChild size="lg" className="mt-8 animate-fade-in-up [animation-delay:400ms]">
            <Link href="/products">Explore Collection</Link>
          </Button>
        </div>
      </section>

      <section className="container mx-auto px-4">
        <div className="text-center animate-fade-in-up">
          <h2 className="font-headline text-3xl md:text-4xl font-bold">New Arrivals</h2>
          <p className="mt-2 text-lg text-muted-foreground">Freshly added to our exclusive collection.</p>
        </div>
        <div className="mt-8 animate-fade-in-up [animation-delay:200ms]">
            {loading ? (
              <div className="flex justify-center">
                <Skeleton className="h-96 w-full" />
              </div>
            ) : (
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
            )}
        </div>
      </section>

      <section className="container mx-auto px-4">
        <div className="text-center animate-fade-in-up">
          <h2 className="font-headline text-3xl md:text-4xl font-bold">Featured Books</h2>
          <p className="mt-2 text-lg text-muted-foreground">Handpicked selections for the discerning reader.</p>
        </div>
        <div className="mt-12 space-y-24">
          {loading ? (
             Array.from({ length: 2 }).map((_, index) => (
                <div key={index} className="grid md:grid-cols-2 gap-12 items-center">
                  <Skeleton className="aspect-[2/3] w-full max-w-sm mx-auto" />
                  <div className="space-y-4">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-10 w-3/4" />
                    <Skeleton className="h-5 w-1/2" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-12 w-40" />
                  </div>
                </div>
             ))
          ) : (
            featuredProducts.map((product, index) => {
              const image = PlaceHolderImages.find((img) => img.id === product.imageId);
              const isOdd = index % 2 !== 0;
              return (
                <div key={product.id} className="grid md:grid-cols-2 gap-12 items-center animate-fade-in-up">
                  <div className={cn("relative aspect-[2/3] w-full max-w-sm mx-auto shadow-xl rounded-lg overflow-hidden transition-transform duration-500 hover:scale-105", isOdd && "md:order-last")}>
                      {image && (
                        <Link href={`/products/${product.slug}`}>
                          <Image
                          src={image.imageUrl}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                          data-ai-hint={image.imageHint}
                          />
                        </Link>
                      )}
                  </div>
                  <div className={cn("text-center md:text-left", isOdd && "md:text-right")}>
                    <p className="text-accent font-semibold">{product.category}</p>
                    <h3 className="font-headline text-3xl font-bold mt-2">{product.name}</h3>
                    <p className="mt-4 text-muted-foreground text-lg">by {product.author}</p>
                    <p className="mt-4 text-lg line-clamp-3">{product.description}</p>
                    <Button asChild size="lg" className="mt-8">
                        <Link href={`/products/${product.slug}`}>
                          View Book <ArrowRight className="ml-2"/>
                        </Link>
                    </Button>
                  </div>
                </div>
              )
            })
          )}
        </div>
        <div className="text-center mt-20 animate-fade-in-up">
            <Button asChild size="lg">
                <Link href="/products">View All Books</Link>
            </Button>
        </div>
      </section>

      <section className="bg-transparent py-20">
        <div className="container mx-auto px-4 text-center animate-fade-in-up">
            <h2 className="font-headline text-3xl md:text-4xl font-bold">Why Choose ICESTORES?</h2>
            <div className="mt-8 grid max-w-5xl mx-auto grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <Card className="p-6 transition-transform hover:scale-105 hover:shadow-xl animate-fade-in-up" style={{animationDelay: '100ms'}}>
                    <h3 className="font-headline text-xl font-semibold">Expert Curation</h3>
                    <p className="mt-2 text-muted-foreground">Each book and article is selected by our team of literary experts to ensure the highest quality.</p>
                </Card>
                <Card className="p-6 transition-transform hover:scale-105 hover:shadow-xl animate-fade-in-up" style={{animationDelay: '200ms'}}>
                    <h3 className="font-headline text-xl font-semibold">Exclusive Content</h3>
                    <p className="mt-2 text-muted-foreground">Access a library of exclusive content you won't find anywhere else.</p>
                </Card>
                <Card className="p-6 transition-transform hover:scale-105 hover:shadow-xl animate-fade-in-up" style={{animationDelay: '300ms'}}>
                    <h3 className="font-headline text-xl font-semibold">Seamless Experience</h3>
                    <p className="mt-2 text-muted-foreground">From browsing to purchase, enjoy a smooth, elegant, and secure user experience.</p>
                </Card>
            </div>
        </div>
      </section>

       <section className="container mx-auto px-4 mb-16 md:mb-24">
        <div className="text-center animate-fade-in-up">
          <h2 className="font-headline text-3xl md:text-4xl font-bold">From Our Journal</h2>
          <p className="mt-2 text-lg text-muted-foreground">Insights, interviews, and inspiration for the literary mind.</p>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
          {loading ? (
             Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className="overflow-hidden">
                    <Skeleton className="aspect-video w-full" />
                    <CardContent className="p-6 space-y-3">
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-6 w-full" />
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-8 w-24" />
                    </CardContent>
                </Card>
             ))
          ) : (
            journalEntries.map((article, index) => (
              <Card key={article.id} className="overflow-hidden transition-shadow hover:shadow-xl animate-fade-in-up" style={{animationDelay: `${index * 200}ms`}}>
                  <Link href={`/articles/${article.slug}`}>
                      <div className="aspect-video relative">
                          <Image src={article.imageUrl} alt={article.title} fill className="object-cover" data-ai-hint={article.imageHint} />
                      </div>
                  </Link>
                  <CardContent className="p-6">
                      <h3 className="font-headline text-xl font-semibold mb-2 leading-tight">
                          <Link href={`/articles/${article.slug}`} className="hover:text-primary">{article.title}</Link>
                      </h3>
                      <p className="text-muted-foreground mb-4 line-clamp-2">{article.excerpt}</p>
                      <Button variant="link" asChild><Link href={`/articles/${article.slug}`}>Read More</Link></Button>
                  </CardContent>
              </Card>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
