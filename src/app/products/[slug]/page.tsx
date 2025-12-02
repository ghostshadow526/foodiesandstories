'use client';

import Image from 'next/image';
import { notFound } from 'next/navigation';
import { mockProducts } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { useCart } from '@/context/cart-provider';
import { toast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import React from 'react';

// The page component now needs to be async to await params
export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  // Await for the params to resolve
  const { slug } = React.use(params);

  const { addToCart } = useCart();
  const product = mockProducts.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  const image = PlaceHolderImages.find((img) => img.id === product.imageId);

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      slug: product.slug,
      imageId: product.imageId,
    });
    toast({
        title: "Added to Cart",
        description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-12">
        <div className="aspect-[2/3] w-full max-w-md mx-auto relative shadow-xl rounded-lg overflow-hidden">
          {image && (
            <Image
              src={image.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              data-ai-hint={image.imageHint}
            />
          )}
        </div>
        <div>
          <h1 className="font-headline text-4xl md:text-5xl font-bold">{product.name}</h1>
          <p className="mt-2 text-xl text-muted-foreground">by {product.author}</p>
          <p className="mt-4 text-3xl font-bold text-primary">{formatCurrency(product.price)}</p>
          
          <Separator className="my-8" />

          <p className="text-base leading-relaxed">{product.description}</p>
          
          <Button onClick={handleAddToCart} size="lg" className="mt-8 w-full md:w-auto">Add to Cart</Button>

          <div className="mt-8 text-sm text-muted-foreground">
            <p><span className="font-semibold">Category:</span> {product.category}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
