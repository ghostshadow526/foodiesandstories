
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useFirestore } from '@/firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import type { Product } from '@/lib/types';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminFeaturedPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    if (!firestore) return;
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(firestore, 'products'));
      const productsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch products.' });
    } finally {
      setLoading(false);
    }
  }, [firestore, toast]);

  useEffect(() => {
    if (firestore) {
      fetchProducts();
    }
  }, [firestore, fetchProducts]);

  const handleFeaturedToggle = async (productId: string, isFeatured: boolean) => {
    if (!firestore) return;

    const productRef = doc(firestore, 'products', productId);
    try {
      await updateDoc(productRef, { isFeatured: isFeatured });
      setProducts(prevProducts =>
        prevProducts.map(p => (p.id === productId ? { ...p, isFeatured } : p))
      );
      toast({
        title: 'Success',
        description: `Book has been ${isFeatured ? 'featured' : 'unfeatured'}.`,
      });
    } catch (error) {
      console.error('Error updating featured status:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not update featured status.' });
       // Revert UI change on error
      setProducts(prevProducts =>
        prevProducts.map(p => (p.id === productId ? { ...p, isFeatured: !isFeatured } : p))
      );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Featured Books</CardTitle>
        <CardDescription>Use the toggle to feature or unfeature a book on the homepage.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Author</TableHead>
              <TableHead className="text-right">Feature</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-16 w-12 rounded" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-6 w-10 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : (
              products.map(product => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="relative h-16 w-12 rounded overflow-hidden">
                        {product.imageUrl && <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.author}</TableCell>
                  <TableCell className="text-right">
                    <Switch
                      checked={product.isFeatured}
                      onCheckedChange={(checked) => handleFeaturedToggle(product.id, checked)}
                      aria-label={`Feature ${product.name}`}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
