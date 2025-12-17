
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useFirestore } from '@/firebase';
import { collection, addDoc, getDocs, doc, updateDoc, increment, deleteDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Article } from '@/lib/types';
import { ThumbsUp, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import Link from 'next/link';


export default function AdminAllArticlesPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div>
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">All Articles</h1>
            <Button asChild>
                <Link href="/admin/articles">Add New Article</Link>
            </Button>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Existing Articles</CardTitle>
                <CardDescription>A list of all articles on your site.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Published</TableHead>
                    <TableHead>Likes</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        <TableRow><TableCell colSpan={4} className="text-center">Loading...</TableCell></TableRow>
                    ) : (
                        articles.map(article => (
                            <TableRow key={article.id}>
                                <TableCell>{article.title}</TableCell>
                                <TableCell>{format(new Date(article.publishedAt), 'dd MMM yyyy')}</TableCell>
                                <TableCell>{article.likes ?? 0}</TableCell>
                                <TableCell className="flex gap-2 justify-end">
                                    <Button size="sm" onClick={() => handleIncrementLikes(article.id)}>
                                        <ThumbsUp className="h-4 w-4" />
                                    </Button>
                                    <Button size="sm" variant="destructive" onClick={() => handleDeleteArticle(article.id)}>
                                        <Trash2 className="h-4 w-4" />
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
  );
}
