
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useFirestore } from '@/firebase';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Product } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function AdminAllBooksPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [books, setBooks] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBooks = useCallback(async () => {
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
  },[firestore, toast]);
  
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
  }, [firestore, fetchBooks]);

  return (
    <div>
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">All Books</h1>
            <Button asChild>
            <Link href="/admin/books">Add New Book</Link>
            </Button>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Existing Books</CardTitle>
                <CardDescription>A list of all books in your store.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        <TableRow><TableCell colSpan={4} className="text-center">Loading...</TableCell></TableRow>
                    ) : (
                        books.map(book => (
                            <TableRow key={book.id}>
                                <TableCell>{book.name}</TableCell>
                                <TableCell>{book.author}</TableCell>
                                <TableCell>{formatCurrency(book.price)}</TableCell>
                                <TableCell className="text-right">
                                    <Button size="sm" variant="destructive" onClick={() => handleDeleteBook(book.id)}>
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
