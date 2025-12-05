
import type { Product, User, Order, Article } from './types';

// This file contains mock data and is no longer the primary source of truth for products and articles.
// The application now fetches this data from Firestore.
// You can leave this data here for reference or for fallback scenarios if you wish.

export const mockProducts: Product[] = [];
export const mockUsers: User[] = [];
export const mockOrders: Order[] = [];
export const mockArticles: Article[] = [];
