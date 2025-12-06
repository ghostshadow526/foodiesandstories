'use client';

import Image from 'next/image';
import { notFound, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import React, { useEffect, useState } from 'react';
import { useFirestore } from '@/firebase';
import { collection, query, where, getDocs, doc, updateDoc, increment } from 'firebase/firestore';
import type { Article } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { ThumbsUp, Eye } from 'lucide-react';
import { format } from 'date-fns';

export default function ArticleDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const firestore = useFirestore();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!firestore) return;
      setLoading(true);
      try {
        const q = query(collection(firestore, 'articles'), where('slug', '==', slug));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
          setArticle(null);
        } else {
          const docData = querySnapshot.docs[0].data() as Omit<Article, 'id'>;
          setArticle({
            id: querySnapshot.docs[0].id,
            ...docData
          });
        }
      } catch (error) {
        console.error("Error fetching article:", error);
      } finally {
        setLoading(false);
      }
    };
    if (slug) {
      fetchArticle();
    }
  }, [firestore, slug]);

  const handleLike = async () => {
    if (!firestore || !article) return;
    const articleRef = doc(firestore, 'articles', article.id);
    await updateDoc(articleRef, {
      likes: increment(1)
    });
    setArticle(prev => prev ? { ...prev, likes: (prev.likes ?? 0) + 1 } : null);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-8" />
          <Skeleton className="aspect-video w-full mb-8" />
          <Skeleton className="h-6 w-full mb-4" />
          <Skeleton className="h-6 w-full mb-4" />
          <Skeleton className="h-6 w-3/4 mb-4" />
        </div>
      </div>
    );
  }
  
  if (!article) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <article className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="font-headline text-4xl md:text-5xl font-bold mb-4">{article.title}</h1>
          <div className="flex items-center text-muted-foreground text-sm space-x-4">
            <span>by {article.author}</span>
            <span>&bull;</span>
            <span>{format(new Date(article.publishedAt), 'MMMM d, yyyy')}</span>
            <div className="flex items-center gap-1">
                <ThumbsUp className="h-4 w-4" /> 
                <span>{article.likes ?? 0}</span>
            </div>
          </div>
        </header>

        <div className="relative aspect-video w-full rounded-lg overflow-hidden mb-8 shadow-lg">
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover"
            data-ai-hint={article.imageHint}
            priority
          />
        </div>

        <div className="prose prose-lg max-w-none text-foreground">
          {article.content.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
          ))}
        </div>

        <Separator className="my-12" />

        <footer className="flex items-center justify-between">
            <Button onClick={handleLike} variant="outline">
                <ThumbsUp className="h-5 w-5 mr-2" />
                Like
            </Button>
             <p className="text-muted-foreground">{article.likes ?? 0} people liked this.</p>
        </footer>
      </article>
    </div>
  );
}
