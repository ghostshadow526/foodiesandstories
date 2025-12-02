import type { Product, User, Order } from './types';

export const mockProducts: Product[] = [
  {
    id: 'prod_1',
    name: 'The Gilded Hour',
    slug: 'the-gilded-hour',
    description: 'A sweeping, unforgettable novel from the New York Times bestselling author of The Winter Sea. In the autumn of 1883, life is peaceful for the Allworth family. But when a new, militant superintendent of the New York Society for the Suppression of Vice sets his sights on them, the Allworths and their friends must fight for their lives.',
    price: 8500,
    author: 'Sara Donati',
    category: 'Historical Fiction',
    imageId: 'book-cover-1',
  },
  {
    id: 'prod_2',
    name: 'Cosmic Queries',
    slug: 'cosmic-queries',
    description: 'In this thought-provoking book, Neil deGrasse Tyson tackles the biggest questions about the universe. With his signature wit and charm, he guides us through a cosmic journey from the Big Bang to the search for extraterrestrial life.',
    price: 12000,
    author: 'Neil deGrasse Tyson',
    category: 'Science',
    imageId: 'book-cover-8',
  },
  {
    id: 'prod_3',
    name: 'Principles of Economics',
    slug: 'principles-of-economics',
    description: 'A comprehensive introduction to the principles of economics, covering both micro and macroeconomics. This book is perfect for students and anyone interested in understanding the modern economy.',
    price: 15000,
    author: 'N. Gregory Mankiw',
    category: 'Economics',
    imageId: 'book-cover-7',
  },
  {
    id: 'prod_4',
    name: 'The Art of Stillness',
    slug: 'the-art-of-stillness',
    description: 'In a world of constant movement and distraction, Pico Iyer celebrates the pleasures and importance of standing still. A beautifully written meditation on the power of stillness in a restless world.',
    price: 6500,
    author: 'Pico Iyer',
    category: 'Philosophy',
    imageId: 'book-cover-2',
  },
  {
    id: 'prod_5',
    name: 'Where the Crawdads Sing',
    slug: 'where-the-crawdads-sing',
    description: 'A heartbreaking coming-of-age story and a surprising tale of possible murder. For years, rumors of the "Marsh Girl" have haunted Barkley Cove, a quiet town on the North Carolina coast.',
    price: 7800,
    author: 'Delia Owens',
    category: 'Fiction',
    imageId: 'book-cover-5',
  },
  {
    id: 'prod_6',
    name: 'Sapiens: A Brief History of Humankind',
    slug: 'sapiens-a-brief-history-of-humankind',
    description: 'From a renowned historian comes a groundbreaking narrative of humanity’s creation and evolution—a #1 international bestseller that explores the ways in which biology and history have defined us and enhanced our understanding of what it means to be “human.”',
    price: 11500,
    author: 'Yuval Noah Harari',
    category: 'History',
    imageId: 'book-cover-6',
  },
  {
    id: 'prod_7',
    name: 'The Vanishing Half',
    slug: 'the-vanishing-half',
    description: 'The Vignes twin sisters will always be identical. But after growing up together in a small, southern black community and running away at age sixteen, it\'s not just the shape of their daily lives that is different as adults, it\'s everything: their families, their communities, their racial identities.',
    price: 8200,
    author: 'Brit Bennett',
    category: 'Fiction',
    imageId: 'book-cover-4',
  },
  {
    id: 'prod_8',
    name: 'A Gentleman in Moscow',
    slug: 'a-gentleman-in-moscow',
    description: 'In 1922, Count Alexander Rostov is deemed an unrepentant aristocrat by a Bolshevik tribunal, and is sentenced to house arrest in the Metropol, a grand hotel across the street from the Kremlin. Rostov, an indomitable man of erudition and wit, has never worked a day in his life, and must now live in an attic room while some of the most tumultuous decades in Russian history are unfolding outside the hotel’s doors.',
    price: 9500,
    author: 'Amor Towles',
    category: 'Historical Fiction',
    imageId: 'book-cover-3',
  },
];

export const mockUsers: User[] = [
    {
        id: 'user_1',
        name: 'Charles Emenike',
        email: 'charles@example.com',
        role: 'admin',
        avatarId: 'user-avatar-1',
    },
    {
        id: 'user_2',
        name: 'Ada Lovelace',
        email: 'ada@example.com',
        role: 'customer',
        avatarId: 'user-avatar-2'
    }
];

export const mockOrders: Order[] = [
    {
        id: 'order_1',
        userId: 'user_2',
        userName: 'Ada Lovelace',
        items: [
            { id: 'prod_1', name: 'The Gilded Hour', price: 8500, quantity: 1, slug: 'the-gilded-hour', imageId: 'book-cover-1' },
            { id: 'prod_2', name: 'Cosmic Queries', price: 12000, quantity: 1, slug: 'cosmic-queries', imageId: 'book-cover-8' }
        ],
        total: 20500,
        status: 'Pending',
        createdAt: new Date('2023-10-26T10:00:00Z'),
        paymentReceiptUrl: 'https://ik.imagekit.io/lwr4hqcxw/receipts/sample-receipt.jpg',
        receiptAnalysis: {
            isCompliant: true,
            violations: [],
            confidenceScore: 0.95,
        }
    },
    {
        id: 'order_2',
        userId: 'user_2',
        userName: 'Ada Lovelace',
        items: [
            { id: 'prod_4', name: 'The Art of Stillness', price: 6500, quantity: 2, slug: 'the-art-of-stillness', imageId: 'book-cover-2' }
        ],
        total: 13000,
        status: 'Delivered',
        createdAt: new Date('2023-09-15T14:30:00Z'),
        paymentReceiptUrl: 'https://ik.imagekit.io/lwr4hqcxw/receipts/sample-receipt.jpg'
    },
    {
        id: 'order_3',
        userId: 'user_1',
        userName: 'Charles Emenike',
        items: [
            { id: 'prod_3', name: 'Principles of Economics', price: 15000, quantity: 1, slug: 'principles-of-economics', imageId: 'book-cover-7' }
        ],
        total: 15000,
        status: 'Processing',
        createdAt: new Date('2023-10-28T11:00:00Z'),
    }
];
