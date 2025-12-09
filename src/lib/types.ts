

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  author: string;
  category: string;
  imageId: string;
  imageUrl: string;
};

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  slug: string;
  imageId: string;
  imageUrl: string;
};

export type Order = {
    id: string;
    name: string;
    email: string;
    address: string;
    city: string;
    country: string;
    items: {
        id: string;
        name: string;
        price: number;
        quantity: number;
    }[];
    total: number;
    createdAt: {
        seconds: number;
        nanoseconds: number;
    } | Date;
    status: 'Pending' | 'Paid' | 'Shipped' | 'Delivered' | 'Cancelled';
};

export type User = {
    id: string;
    name: string;
    email: string;
    role: 'customer' | 'admin';
    avatarId: string;
};

export type Article = {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string; // Added content field
    imageUrl: string;
    imageHint: string;
    author: string;
    publishedAt: string;
    likes?: number;
};
