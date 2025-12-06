'use client';

import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/context/cart-provider';
import { formatCurrency } from '@/lib/utils';
import type { Product } from '@/lib/types';
import { toast } from '@/hooks/use-toast';

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  
  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      slug: product.slug,
      imageId: product.imageId,
      imageUrl: product.imageUrl,
    });
    toast({
        title: "Added to Cart",
        description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <Card className="flex flex-col overflow-hidden transition-shadow hover:shadow-lg">
      <CardHeader className="p-0">
        <Link href={`/products/${product.slug}`}>
          <div className="aspect-[2/3] w-full relative">
            {product.imageUrl && (
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            )}
          </div>
        </Link>
      </CardHeader>
      <CardContent className="flex-1 p-4">
        <CardTitle className="font-headline text-xl leading-tight">
            <Link href={`/products/${product.slug}`} className="hover:text-primary transition-colors">
                {product.name}
            </Link>
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">by {product.author}</p>
        <p className="text-lg font-semibold mt-2">{formatCurrency(product.price)}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button onClick={handleAddToCart} className="w-full">Add to Cart</Button>
      </CardFooter>
    </Card>
  );
}
