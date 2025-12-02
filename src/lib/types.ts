
export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  author: string;
  category: string;
  imageId: string;
};

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  slug: string;
  imageId: string;
};

export type Order = {
    id: string;
    userId: string;
    items: CartItem[];
    total: number;
    status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
    paymentReceiptUrl?: string;
    receiptAnalysis?: {
        isCompliant: boolean;
        violations: string[];
        confidenceScore: number;
    };
    createdAt: Date;
    userName: string;
};

export type User = {
    id: string;
    name: string;
    email: string;
    role: 'customer' | 'admin';
    avatarId: string;
};
