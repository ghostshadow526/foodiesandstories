
'use client';

import { useState, useEffect } from 'react';
import { useFirestore } from '@/firebase';
import { collection, getDocs, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Order } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

export default function AdminOrdersPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
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
  };

  useEffect(() => {
    if (firestore) {
      fetchOrders();
    }
  }, [firestore]);

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
    if (timestamp instanceof Date) {
        return format(timestamp, 'dd MMM yyyy, p');
    }
    if (typeof timestamp === 'object' && 'seconds' in timestamp) {
        const date = new Date(timestamp.seconds * 1000);
        return format(date, 'dd MMM yyyy, p');
    }
    return 'Invalid Date';
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
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} className="text-center">Loading orders...</TableCell></TableRow>
            ) : orders.length === 0 ? (
                 <TableRow><TableCell colSpan={6} className="text-center">No orders found.</TableCell></TableRow>
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
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
