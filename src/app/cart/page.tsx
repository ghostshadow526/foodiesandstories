'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/cart-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/lib/utils';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { X } from 'lucide-react';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="font-headline text-4xl md:text-5xl font-bold mb-8 text-center">Your Cart</h1>
      {cart.length === 0 ? (
        <div className="text-center">
          <p className="text-lg text-muted-foreground mb-4">Your cart is empty.</p>
          <Button asChild>
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-12">
          <div className="md:col-span-2">
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {cart.map((item) => {
                    const image = PlaceHolderImages.find((img) => img.id === item.imageId);
                    return (
                      <div key={item.id} className="flex items-center p-4">
                        <div className="relative h-24 w-16 rounded overflow-hidden">
                          {image && (
                            <Image src={image.imageUrl} alt={item.name} fill className="object-cover" data-ai-hint="book cover" />
                          )}
                        </div>
                        <div className="ml-4 flex-1">
                          <Link href={`/products/${item.slug}`} className="font-semibold hover:text-primary">{item.name}</Link>
                          <p className="text-sm text-muted-foreground">{formatCurrency(item.price)}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity || 1}
                            onChange={(e) => {
                                const newQuantity = parseInt(e.target.value, 10);
                                if (!isNaN(newQuantity)) {
                                    updateQuantity(item.id, newQuantity);
                                }
                            }}
                            className="w-20 text-center"
                          />
                           <p className="w-24 text-right font-semibold">{formatCurrency(item.price * item.quantity)}</p>
                          <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="md:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="font-headline text-2xl">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(cartTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{formatCurrency(cartTotal)}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full" size="lg">
                  <Link href="/checkout">Proceed to Checkout</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
