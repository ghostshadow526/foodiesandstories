
'use client';

import { useState, useEffect } from 'react';
import { useFirestore } from '@/firebase';
import { collection, addDoc, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Product } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { IKContext, IKUpload } from 'imagekitio-react';
import { UploadCloud, Trash2 } from 'lucide-react';

const bookSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  author: z.string().min(1, 'Author is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.coerce.number().min(0, 'Price must be positive'),
  category: z.string().min(1, 'Category is required'),
  imageId: z.string().min(1, 'Image ID is required'),
  imageUrl: z.string().url('A valid image URL is required'),
});

type BookFormValues = z.infer<typeof bookSchema>;

export default function AdminBooksPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [books, setBooks] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

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
    },
  });

  const authenticator = async () => {
    try {
        const response = await fetch('/api/imagekit/auth');
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Request failed with status ${response.status}: ${errorText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Authentication request failed:", error);
        throw new Error(`Authentication request failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const fetchBooks = async () => {
    if (!firestore) return;
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(firestore, 'products'));
      const booksData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setBooks(booksData);
    } catch (error) {
      console.error('Error fetching books:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch books.' });
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteBook = async (bookId: string) => {
    if(!firestore) return;
    try {
      await deleteDoc(doc(firestore, 'products', bookId));
      toast({ title: 'Success', description: 'Book deleted successfully.' });
      fetchBooks();
    } catch (error) {
      console.error('Error deleting book:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not delete book.' });
    }
  }

  useEffect(() => {
    if(firestore){
      fetchBooks();
    }
  }, [firestore]);

  const onSubmit = async (data: BookFormValues) => {
    if (!firestore) return;
    try {
      await addDoc(collection(firestore, 'products'), data);
      toast({ title: 'Success', description: 'Book added successfully.' });
      form.reset();
      fetchBooks();
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
    // You might want to generate a more unique ID or use the one from ImageKit
    form.setValue('imageId', res.fileId); 
    toast({ title: 'Upload Success', description: 'Image has been uploaded and URL is set.' });
  };


  return (
    <IKContext
        urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}
        publicKey={process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY}
        authenticator={authenticator}
    >
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
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
            <CardTitle>Existing Books</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                    <TableRow><TableCell colSpan={4}>Loading...</TableCell></TableRow>
                ) : (
                    books.map(book => (
                        <TableRow key={book.id}>
                            <TableCell>{book.name}</TableCell>
                            <TableCell>{book.author}</TableCell>
                            <TableCell>{formatCurrency(book.price)}</TableCell>
                             <TableCell>
                                <Button size="sm" variant="destructive" onClick={() => handleDeleteBook(book.id)}>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </Button>
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
