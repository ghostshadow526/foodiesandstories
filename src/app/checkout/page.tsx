
'use client';

import { useCart } from '@/context/cart-provider';
import { formatCurrency } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useFirestore } from '@/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { IKContext, IKUpload } from 'imagekitio-react';
import { UploadCloud } from 'lucide-react';

const shippingSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email({ message: "Invalid email address." }),
    address: z.string().min(5, { message: "Address must be at least 5 characters." }),
    city: z.string().min(2, { message: "City must be at least 2 characters." }),
    country: z.string().min(2, { message: "Country must be at least 2 characters." }),
    receiptImageUrl: z.string().url({ message: "Please upload a payment receipt." }),
});

type ShippingFormValues = z.infer<typeof shippingSchema>;


export default function CheckoutPage() {
    const { cart, cartTotal, clearCart } = useCart();
    const router = useRouter();
    const firestore = useFirestore();
    const { toast } = useToast();

    const form = useForm<ShippingFormValues>({
        resolver: zodResolver(shippingSchema),
        defaultValues: {
            name: '',
            email: '',
            address: '',
            city: 'Lagos',
            country: 'Nigeria',
            receiptImageUrl: '',
        }
    });
    
    const authenticator = async () => {
        try {
            const response = await fetch('/api/imagekit/auth');
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Request failed with status ${response.status}: ${errorText}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Authentication request failed:", error);
            throw new Error(`Authentication request failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    };
    
    const onUploadError = (err: any) => {
        console.error("Upload error:", err);
        toast({ variant: 'destructive', title: 'Upload Failed', description: err.message || 'There was an error uploading the receipt.' });
    };

    const onUploadSuccess = (res: any) => {
        form.setValue('receiptImageUrl', res.url);
        toast({ title: 'Upload Success', description: 'Receipt has been uploaded.' });
    };

    const onSubmit: SubmitHandler<ShippingFormValues> = async (data) => {
        if (!firestore) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Could not connect to the database. Please try again later.'
            });
            return;
        }

        const orderData = {
            ...data,
            items: cart.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
            })),
            total: cartTotal,
            status: 'Pending',
            createdAt: new Date()
        };

        try {
            await addDoc(collection(firestore, 'orders'), orderData);
            clearCart();
            toast({
                title: 'Order Placed!',
                description: "Thank you for your order. We will process it shortly.",
            });
            router.push('/');
        } catch (error) {
            console.error("Error creating order:", error);
            toast({
                variant: 'destructive',
                title: 'Order Failed',
                description: 'There was a problem placing your order. Please try again.'
            })
        }
    };

    if (cart.length === 0) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <h1 className="font-headline text-4xl md:text-5xl font-bold mb-8">Checkout</h1>
                <p className="text-lg text-muted-foreground mb-4">Your cart is empty. You can't checkout.</p>
                <Button asChild>
                    <Link href="/products">Continue Shopping</Link>
                </Button>
            </div>
        )
    }

    return (
        <IKContext
            urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}
            publicKey={process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY}
            authenticator={authenticator}
        >
            <div className="container mx-auto px-4 py-12">
                <h1 className="font-headline text-4xl md:text-5xl font-bold mb-8 text-center">Checkout</h1>
                <div className="grid lg:grid-cols-2 gap-12">
                    <div className="space-y-8">
                         <Form {...form}>
                            <form id="shipping-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className='font-headline text-2xl'>Shipping Information</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <FormField control={form.control} name="name" render={({ field }) => (
                                            <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="Full Name" {...field} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                        <FormField control={form.control} name="email" render={({ field }) => (
                                            <FormItem><FormLabel>Email</FormLabel><FormControl><Input placeholder="you@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                        <FormField control={form.control} name="address" render={({ field }) => (
                                            <FormItem><FormLabel>Address</FormLabel><FormControl><Input placeholder="123 Luxury Avenue" {...field} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                        <div className="grid grid-cols-2 gap-4">
                                            <FormField control={form.control} name="city" render={({ field }) => (
                                                <FormItem><FormLabel>City</FormLabel><FormControl><Input placeholder="Lagos" {...field} /></FormControl><FormMessage /></FormItem>
                                            )} />
                                            <FormField control={form.control} name="country" render={({ field }) => (
                                                <FormItem><FormLabel>Country</FormLabel><FormControl><Input placeholder="Nigeria" {...field} /></FormControl><FormMessage /></FormItem>
                                            )} />
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle className='font-headline text-2xl'>Payment Information</CardTitle>
                                        <CardDescription>
                                            Please make a bank transfer to the account below, then upload your receipt to complete the order.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                    <div className="text-lg space-y-2 rounded-md border p-4">
                                            <p><strong>Account Name:</strong> EMENIKE Charles IFUNANYA</p>
                                            <p><strong>Account Number:</strong> 1120172302</p>
                                            <p><strong>Bank:</strong> Polaris Bank</p>
                                    </div>
                                    <FormField control={form.control} name="receiptImageUrl" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Proof of Payment</FormLabel>
                                            <FormControl>
                                                <div className="flex items-center gap-4">
                                                    <label className="cursor-pointer">
                                                        <Button type="button" variant="outline" asChild>
                                                            <span><UploadCloud className="mr-2 h-4 w-4" /> Upload Receipt</span>
                                                        </Button>
                                                        <IKUpload
                                                            fileName="receipt.jpg"
                                                            onError={onUploadError}
                                                            onSuccess={onUploadSuccess}
                                                            useUniqueFileName={true}
                                                            className="hidden"
                                                        />
                                                    </label>
                                                    <Input {...field} placeholder="Receipt URL will appear here" readOnly />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <p className="text-sm text-muted-foreground">
                                            After payment and upload, click "Place Order". We will confirm your payment and process your order.
                                    </p>
                                    </CardContent>
                                </Card>
                            </form>
                        </Form>
                    </div>
                    <div className="sticky top-24">
                        <Card>
                            <CardHeader>
                                <CardTitle className='font-headline text-2xl'>Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {cart.map((item) => (
                                            <div key={item.id} className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="relative h-16 w-12 rounded overflow-hidden">
                                                        {item.imageUrl && <Image src={item.imageUrl} alt={item.name} fill className="object-cover"/>}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold">{item.name}</p>
                                                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                                    </div>
                                                </div>
                                                <p>{formatCurrency(item.price * item.quantity)}</p>
                                            </div>
                                        )
                                    )}
                                </div>
                                <Separator className="my-4" />
                                <div className="flex justify-between font-bold text-lg">
                                    <p>Total</p>
                                    <p>{formatCurrency(cartTotal)}</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Button type="submit" form="shipping-form" className="w-full mt-6" size="lg" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? 'Placing Order...' : 'Place Order'}
                        </Button>
                    </div>
                </div>
            </div>
        </IKContext>
    );
}
