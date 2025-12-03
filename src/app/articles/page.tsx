
'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFirestore } from '@/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import type { Article } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function ArticlesPage() {
  const firestore = useFirestore();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      if (!firestore) return;
      try {
        const querySnapshot = await getDocs(collection(firestore, "articles"));
        const articlesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Article));
        setArticles(articlesData);
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [firestore]);


  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12 animate-fade-in-up">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">Our Journal</h1>
        <p className="mt-2 text-lg text-muted-foreground">Insights, interviews, and inspiration for the literary mind.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
           Array.from({ length: 3 }).map((_, index) => (
             <Card key={index} className="overflow-hidden">
                <Skeleton className="aspect-video w-full" />
                <CardContent className="p-6 space-y-3">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-12 w-full" />
                   <Skeleton className="h-8 w-24" />
                </CardContent>
             </Card>
           ))
        ) : (
          articles.map((article, index) => (
            <Card 
              key={article.id} 
              className="overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 animate-fade-in-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <Link href={`/articles/${article.slug}`} className="block">
                <div className="aspect-video relative">
                  <Image 
                    src={article.imageUrl} 
                    alt={article.title} 
                    fill 
                    className="object-cover" 
                    data-ai-hint={article.imageHint}
                  />
                </div>
              </Link>
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground mb-2">{article.publishedAt} &bull; by {article.author}</p>
                <h2 className="font-headline text-2xl font-semibold mb-3 leading-tight">
                  <Link href={`/articles/${article.slug}`} className="hover:text-primary transition-colors">
                    {article.title}
                  </Link>
                </h2>
                <p className="text-muted-foreground mb-4 line-clamp-3">{article.excerpt}</p>
                <Button asChild variant="link" className="p-0">
                  <Link href={`/articles/${article.slug}`}>Read More</Link>
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
