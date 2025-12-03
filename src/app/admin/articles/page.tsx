
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFirestore } from '@/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import type { Article } from '@/lib/types';
import Image from 'next/image';

const articleSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  author: z.string().min(3, "Author must be at least 3 characters"),
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters"),
  content: z.string().min(20, "Content must be at least 20 characters"),
  imageUrl: z.string().url("Must be a valid ImageKit URL"),
});

type ArticleFormValues = z.infer<typeof articleSchema>;

function slugify(text: string) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export default function AdminArticlesPage() {
  const firestore = useFirestore();
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: '', author: '', excerpt: '', content: '', imageUrl: ''
    },
  });

  const fetchArticles = async () => {
    if (!firestore) return;
    const querySnapshot = await getDocs(collection(firestore, "articles"));
    const articlesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Article));
    setArticles(articlesData);
  }

  useEffect(() => {
    fetchArticles();
  }, [firestore]);


  const onSubmit = async (data: ArticleFormValues) => {
    if (!firestore) {
      toast({ variant: 'destructive', title: 'Error', description: 'Firestore is not available' });
      return;
    }
    setIsLoading(true);

    try {
      const slug = slugify(data.title);
      const publishedAt = format(new Date(), 'MMMM d, yyyy');
      
      await addDoc(collection(firestore, "articles"), {
        ...data,
        slug,
        publishedAt,
        imageHint: "article cover",
      });

      toast({ title: 'Success', description: 'Article added successfully' });
      form.reset();
      fetchArticles();
    } catch (error) {
      console.error("Error adding article:", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to add article' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-8 md:grid-cols-3">
      <div className="md:col-span-1">
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
                <FormField control={form.control} name="excerpt" render={({ field }) => (
                  <FormItem><FormLabel>Excerpt</FormLabel><FormControl><Textarea rows={3} {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="content" render={({ field }) => (
                  <FormItem><FormLabel>Content</FormLabel><FormControl><Textarea rows={8} {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="imageUrl" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl><Input placeholder="https://ik.imagekit.io/..." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                {form.watch('imageUrl') && (
                    <div className="aspect-video relative rounded-md overflow-hidden border">
                        <Image src={form.watch('imageUrl')} alt="Preview" fill className="object-cover" />
                    </div>
                )}

                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? 'Adding...' : 'Add Article'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Existing Articles</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Published</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {articles.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell className="font-medium">{article.title}</TableCell>
                    <TableCell>{article.author}</TableCell>
                    <TableCell>{article.publishedAt}</TableCell>
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
