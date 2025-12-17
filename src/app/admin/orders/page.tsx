
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useFirestore } from '@/firebase';
import { collection, getDocs, doc, updateDoc, query, orderBy, deleteDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Order } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function AdminOrdersPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = useCallback(async () => {
    if (!firestore) return;
    setLoading(true);
    try {
      const q = query(collection(firestore, 'orders'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const ordersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
      setOrders(ordersData);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch orders.' });
    } finally {
      setLoading(false);
    }
  }, [firestore, toast]);

  useEffect(() => {
    if (firestore) {
      fetchOrders();
    }
  }, [firestore, fetchOrders]);
  
  const handleDeleteOrder = async (orderId: string) => {
    if(!firestore) return;
    try {
      await deleteDoc(doc(firestore, 'orders', orderId));
      toast({ title: 'Success', description: 'Order deleted successfully.' });
      fetchOrders();
    } catch (error) {
      console.error('Error deleting order:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not delete order.' });
    }
  }

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    if (!firestore) return;
    const orderRef = doc(firestore, 'orders', orderId);
    try {
      await updateDoc(orderRef, { status: newStatus });
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      toast({ title: 'Success', description: 'Order status updated.' });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not update order status.' });
    }
  };

  const getStatusVariant = (status: Order['status']) => {
    switch (status) {
        case 'Pending': return 'default';
        case 'Paid': return 'secondary';
        case 'Shipped': return 'outline';
        case 'Delivered': return 'default'; // Success variant would be good here
        case 'Cancelled': return 'destructive';
        default: return 'default';
    }
  };

  const formatDate = (timestamp: Order['createdAt']) => {
    if (!timestamp) return 'N/A';
    // Firestore timestamp or JS Date
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp.seconds * 1000);
    return format(date, 'dd MMM yyyy, p');
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Receipt</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={8} className="text-center">Loading orders...</TableCell></TableRow>
            ) : orders.length === 0 ? (
                 <TableRow><TableCell colSpan={8} className="text-center">No orders found.</TableCell></TableRow>
            ) : (
              orders.map(order => (
                <TableRow key={order.id}>
                  <TableCell>{order.name}</TableCell>
                  <TableCell>
                    <a href={`mailto:${order.email}`} className="text-primary hover:underline">
                        {order.email}
                    </a>
                  </TableCell>
                  <TableCell>{formatDate(order.createdAt)}</TableCell>
                  <TableCell>{formatCurrency(order.total)}</TableCell>
                  <TableCell>{order.items.reduce((acc, item) => acc + item.quantity, 0)}</TableCell>
                  <TableCell>
                    {order.receiptImageUrl ? (
                        <Button variant="outline" size="sm" asChild>
                            <a href={order.receiptImageUrl} target="_blank" rel="noopener noreferrer">
                                <Eye className="mr-2 h-4 w-4"/> View
                            </a>
                        </Button>
                    ) : (
                        <span className="text-muted-foreground">N/A</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={order.status}
                      onValueChange={(value: Order['status']) => handleStatusChange(order.id, value)}
                    >
                      <SelectTrigger className="w-[120px]">
                         <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Paid">Paid</SelectItem>
                        <SelectItem value="Shipped">Shipped</SelectItem>
                        <SelectItem value="Delivered">Delivered</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                   <TableCell>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the order.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteOrder(order.id)}>
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
