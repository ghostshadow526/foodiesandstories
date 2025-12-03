
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFirestore } from '@/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { formatCurrency } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import type { Product } from '@/lib/types';


const bookSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  author: z.string().min(3, "Author must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().positive("Price must be a positive number"),
  category: z.string().min(2, "Category is required"),
  imageId: z.string().min(1, "Image is required"),
});

type BookFormValues = z.infer<typeof bookSchema>;

function slugify(text: string) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

export default function AdminBooksPage() {
  const firestore = useFirestore();
  const [books, setBooks] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<BookFormValues>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
        name: '',
        author: '',
        description: '',
        price: 0,
        category: '',
        imageId: '',
    },
  });

  const fetchBooks = async () => {
    if (!firestore) return;
    const querySnapshot = await getDocs(collection(firestore, "products"));
    const booksData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    setBooks(booksData);
  }

  useEffect(() => {
    fetchBooks();
  }, [firestore]);


  const onSubmit = async (data: BookFormValues) => {
    if (!firestore) {
        toast({ variant: 'destructive', title: 'Error', description: 'Firestore is not available' });
        return;
    }
    setIsLoading(true);

    try {
        const slug = slugify(data.name);
        await addDoc(collection(firestore, "products"), {
            ...data,
            slug
        });
        toast({ title: 'Success', description: 'Book added successfully' });
        form.reset();
        fetchBooks();
    } catch (error) {
        console.error("Error adding book:", error);
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to add book' });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-8 md:grid-cols-3">
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Add New Book</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="author" render={({ field }) => (
                  <FormItem><FormLabel>Author</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="price" render={({ field }) => (
                  <FormItem><FormLabel>Price</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="category" render={({ field }) => (
                  <FormItem><FormLabel>Category</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="imageId" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Book Cover Image</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a cover image" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {PlaceHolderImages.filter(img => img.id.includes('book-cover')).map(image => (
                                <SelectItem key={image.id} value={image.id}>{image.description}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />

                <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? 'Adding...' : 'Add Book'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      <div className="md:col-span-2">
         <Card>
            <CardHeader>
                <CardTitle>Existing Books</CardTitle>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Author</TableHead>
                            <TableHead className="text-right">Price</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {books.map((book) => (
                            <TableRow key={book.id}>
                                <TableCell className="font-medium">{book.name}</TableCell>
                                <TableCell>{book.author}</TableCell>
                                <TableCell className="text-right">{formatCurrency(book.price)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
