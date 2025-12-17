
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IKContext, IKUpload } from 'imagekitio-react';
import { UploadCloud, Library } from 'lucide-react';
import { useFirestore } from '@/firebase';
import { collection, addDoc } from 'firebase/firestore';
import Link from 'next/link';
import { onUploadError, onUploadSuccess, authenticator } from '@/lib/imagekit-client';

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

export default function AdminAddBookPage() {
  const firestore = useFirestore();
  const { toast } = useToast();

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
      isFeatured: false,
    },
  });

  const onSubmit = async (data: BookFormValues) => {
    if (!firestore) return;
    try {
      await addDoc(collection(firestore, 'products'), data);
      toast({ title: 'Success', description: 'Book added successfully.' });
      form.reset();
    } catch (error) {
      console.error('Error adding book:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not add book.' });
    }
  };

  return (
    <IKContext
        urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!}
        publicKey={process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!}
        authenticator={authenticator}
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Add New Book</h1>
        <Button asChild variant="outline">
          <Link href="/admin/books/all">
            <Library className="mr-2 h-4 w-4" />
            View All Books
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Book Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="author" render={({ field }) => (
                  <FormItem><FormLabel>Author</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="slug" render={({ field }) => (
                  <FormItem><FormLabel>Slug</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="price" render={({ field }) => (
                  <FormItem><FormLabel>Price</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              
              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea rows={5} {...field} /></FormControl><FormMessage /></FormItem>
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
                                    onError={(err) => onUploadError(err, toast)}
                                    onSuccess={(res) => onUploadSuccess(res, form, 'imageUrl', 'imageId', toast)}
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
    </IKContext>
  );
}
