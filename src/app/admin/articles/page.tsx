
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

const articleSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  slug: z.string().min(1, 'Slug is required'),
  excerpt: z.string().min(1, 'Excerpt is required'),
  content: z.string().min(1, 'Content is required'),
  imageUrl: z.string().url('A valid image URL is required.'),
  imageHint: z.string().optional(),
});

type ArticleFormValues = z.infer<typeof articleSchema>;


export default function AdminAddArticlePage() {
  const firestore = useFirestore();
  const { toast } = useToast();

  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: '',
      author: '',
      slug: '',
      excerpt: '',
      content: '',
      imageUrl: '',
      imageHint: '',
    },
  });

  const onSubmit = async (data: ArticleFormValues) => {
    if (!firestore) return;
    try {
      await addDoc(collection(firestore, 'articles'), {
        ...data,
        publishedAt: new Date().toISOString(),
        likes: 0,
      });
      toast({ title: 'Success', description: 'Article added successfully.' });
      form.reset();
    } catch (error) {
      console.error('Error adding article:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not add article.' });
    }
  };
  
  return (
    <IKContext
        urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!}
        publicKey={process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!}
        authenticator={authenticator}
    >
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Add New Article</h1>
            <Button asChild variant="outline">
            <Link href="/admin/articles/all">
                <Library className="mr-2 h-4 w-4" />
                View All Articles
            </Link>
            </Button>
        </div>
        <Card>
        <CardHeader>
            <CardTitle>Article Details</CardTitle>
        </CardHeader>
        <CardContent>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="author" render={({ field }) => (
                <FormItem><FormLabel>Author</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="slug" render={({ field }) => (
                <FormItem><FormLabel>Slug</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="excerpt" render={({ field }) => (
                    <FormItem><FormLabel>Excerpt</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="content" render={({ field }) => (
                <FormItem><FormLabel>Content</FormLabel><FormControl><Textarea rows={6} {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                
                <FormField control={form.control} name="imageUrl" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Article Image</FormLabel>
                        <FormControl>
                            <div className="flex items-center gap-4">
                                <label className="cursor-pointer">
                                    <Button type="button" variant="outline" asChild>
                                        <span><UploadCloud className="mr-2 h-4 w-4" /> Upload</span>
                                    </Button>
                                    <IKUpload
                                        fileName="article-image.jpg"
                                        onError={(err) => onUploadError(err, toast)}
                                        onSuccess={(res) => onUploadSuccess(res, form, 'imageUrl', 'imageHint', toast)}
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
                
                <FormField control={form.control} name="imageHint" render={({ field }) => (
                    <FormItem><FormLabel>Image Hint (for AI)</FormLabel><FormControl><Input {...field} placeholder="e.g. 'vintage book'"/></FormControl><FormMessage /></FormItem>
                )} />
                <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Adding...' : 'Add Article'}
                </Button>
            </form>
            </Form>
        </CardContent>
        </Card>
    </IKContext>
  );
}
