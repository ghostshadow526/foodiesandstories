
'use client';
import ProductCard from '@/components/shared/product-card';
import { useFirestore } from '@/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import type { Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardFooter } from '@/components/ui/card';


export default function ProductsPage() {
  const firestore = useFirestore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!firestore) return;
      try {
        const querySnapshot = await getDocs(collection(firestore, "products"));
        const productsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [firestore]);


  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">Our Collection</h1>
        <p className="mt-2 text-lg text-muted-foreground">Explore our curated selection of books and articles.</p>
      </div>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {loading ? (
          Array.from({ length: 8 }).map((_, index) => (
            <Card key={index} className="overflow-hidden">
                <Skeleton className="aspect-[2/3] w-full" />
                <CardContent className="p-4 space-y-2">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                   <Skeleton className="h-5 w-1/3" />
                </CardContent>
                <CardFooter className="p-4">
                    <Skeleton className="h-10 w-full" />
                </CardFooter>
            </Card>
          ))
        ): (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>
    </div>
  );
}
