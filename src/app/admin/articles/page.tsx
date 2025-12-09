
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useFirestore } from '@/firebase';
import { collection, addDoc, getDocs, doc, updateDoc, increment, deleteDoc } from 'firebase/firestore';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Article } from '@/lib/types';
import { ThumbsUp, UploadCloud, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { IKContext, IKUpload } from 'imagekitio-react';

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

export default function AdminArticlesPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);

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

  const fetchArticles = useCallback(async () => {
    if (!firestore) return;
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(firestore, 'articles'));
      const articlesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Article));
      setArticles(articlesData);
    } catch (error) {
      console.error('Error fetching articles:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch articles.' });
    } finally {
      setLoading(false);
    }
  }, [firestore, toast]);

  useEffect(() => {
    if (firestore) {
      fetchArticles();
    }
  }, [firestore, fetchArticles]);

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
      fetchArticles();
    } catch (error) {
      console.error('Error adding article:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not add article.' });
    }
  };
  
  const handleIncrementLikes = async (articleId: string) => {
    if (!firestore) return;
    const articleRef = doc(firestore, 'articles', articleId);
    try {
      await updateDoc(articleRef, {
        likes: increment(1)
      });
      setArticles(prev => prev.map(a => a.id === articleId ? { ...a, likes: (a.likes ?? 0) + 1 } : a));
      toast({ title: 'Success', description: 'Likes incremented.' });
    } catch (error) {
        console.error("Error incrementing likes:", error);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not increment likes.' });
    }
  }

  const handleDeleteArticle = async (articleId: string) => {
    if(!firestore) return;
    try {
      await deleteDoc(doc(firestore, 'articles', articleId));
      toast({ title: 'Success', description: 'Article deleted successfully.' });
      fetchArticles();
    } catch (error) {
      console.error('Error deleting article:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not delete article.' });
    }
  }

  const onUploadError = (err: any) => {
    console.error("Upload error:", err);
    toast({ variant: 'destructive', title: 'Upload Failed', description: err.message || 'There was an error uploading the image.' });
  }

  const onUploadSuccess = (res: any) => {
    form.setValue('imageUrl', res.url);
    toast({ title: 'Upload Success', description: 'Image has been uploaded and URL is set.' });
  }


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
                <CardTitle>Add New Article</CardTitle>
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
        </div>
        <div className="lg:col-span-2">
            <Card>
            <CardHeader>
                <CardTitle>Existing Articles</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Published</TableHead>
                    <TableHead>Likes</TableHead>
                    <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        <TableRow><TableCell colSpan={4}>Loading...</TableCell></TableRow>
                    ) : (
                        articles.map(article => (
                            <TableRow key={article.id}>
                                <TableCell>{article.title}</TableCell>
                                <TableCell>{format(new Date(article.publishedAt), 'dd MMM yyyy')}</TableCell>
                                <TableCell>{article.likes ?? 0}</TableCell>
                                <TableCell className="flex gap-2">
                                    <Button size="sm" onClick={() => handleIncrementLikes(article.id)}>
                                        <ThumbsUp className="mr-2 h-4 w-4" />
                                        Like
                                    </Button>
                                    <Button size="sm" variant="destructive" onClick={() => handleDeleteArticle(article.id)}>
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
