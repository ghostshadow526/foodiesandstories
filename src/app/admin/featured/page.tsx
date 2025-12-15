
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useFirestore } from '@/firebase';
import { collection, getDocs, doc, updateDoc, addDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import type { Product } from '@/lib/types';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { IKContext, IKUpload } from 'imagekitio-react';
import { UploadCloud } from 'lucide-react';

const bookSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  author: z.string().min(1, 'Author is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.coerce.number().min(0, 'Price must be positive'),
  category: z.string().min(1, 'Category is required'),
  imageId: z.string().min(1, 'Image ID is required'),
  imageUrl: z.string().url('A valid image URL is required'),
  isFeatured: z.boolean().default(false),
});

type BookFormValues = z.infer<typeof bookSchema>;

const authenticator = async () => {
    try {
        const response = await fetch('/api/imagekit/auth');
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Request failed with status ${response.status}: ${errorText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error(`Authentication request failed: ${error instanceof Error ? error.message : String(error)}`);
    }
};


export default function AdminFeaturedPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const form = useForm<BookFormValues>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      name: '',
      author: '',
      slug: '',
      description: '',
      price: 0,
      category: '',
      imageId: 'book-cover-1',
      imageUrl: '',
      isFeatured: true, // Default to featured when adding from this page
    },
  });

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
  
  const onBookSubmit = async (data: BookFormValues) => {
    if (!firestore) return;
    try {
      await addDoc(collection(firestore, 'products'), data);
      toast({ title: 'Success', description: 'Book added successfully.' });
      form.reset();
      fetchProducts();
    } catch (error) {
      console.error('Error adding book:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not add book.' });
    }
  };

  const onUploadError = (err: any) => {
    console.error("Upload error:", err);
    toast({ variant: 'destructive', title: 'Upload Failed', description: err.message || 'There was an error uploading the image.' });
  };

  const onUploadSuccess = (res: any) => {
    form.setValue('imageUrl', res.url);
    form.setValue('imageId', res.fileId); 
    toast({ title: 'Upload Success', description: 'Image has been uploaded and URL is set.' });
  };

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
    <IKContext
        urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!}
        publicKey={process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!}
        authenticator={authenticator}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
             <Card>
                <CardHeader>
                    <CardTitle>Add New Featured Book</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                    <form onSubmit={form.handleSubmit(onBookSubmit)} className="space-y-4">
                        <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="author" render={({ field }) => (
                        <FormItem><FormLabel>Author</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="slug" render={({ field }) => (
                        <FormItem><FormLabel>Slug</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="description" render={({ field }) => (
                        <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="price" render={({ field }) => (
                        <FormItem><FormLabel>Price</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="category" render={({ field }) => (
                            <FormItem><FormLabel>Category</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="imageUrl" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Book Cover Image</FormLabel>
                                <FormControl>
                                    <div className="flex items-center gap-4">
                                        <label className="cursor-pointer">
                                        <Button type="button" variant="outline" asChild>
                                            <span><UploadCloud className="mr-2 h-4 w-4" /> Upload</span>
                                        </Button>
                                        <IKUpload
                                            fileName="book-cover.jpg"
                                            onError={onUploadError}
                                            onSuccess={onUploadSuccess}
                                            useUniqueFileName={true}
                                            className="hidden"
                                        />
                                        </label>
                                        <Input {...field} placeholder="Image URL will appear here" readOnly />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="isFeatured" render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                <div className="space-y-0.5">
                                    <FormLabel>Feature this book?</FormLabel>
                                    <FormDescription>
                                        Display this book on the homepage.
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="imageId" render={({ field }) => (
                            <FormItem className='hidden'><FormLabel>Image ID</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <Button type="submit" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? 'Adding...' : 'Add Book'}
                        </Button>
                    </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-2">
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
                            checked={!!product.isFeatured}
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
        </div>
      </div>
    </IKContext>
  );
}
