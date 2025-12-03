import type { Product, User, Order, Article } from './types';

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
        createdAt: new Date('2033-09-15T14:30:00Z'),
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
        createdAt: new Date('2033-10-28T11:00:00Z'),
    }
];

export const mockArticles: Article[] = [
  {
    id: 'article-1',
    slug: 'the-enduring-power-of-classic-literature',
    title: 'The Enduring Power of Classic Literature',
    excerpt: 'Discover why the classics remain relevant and powerful in our modern world, and how they continue to shape our understanding of ourselves and society.',
    content: 'Classic literature holds a timeless appeal, offering profound insights into the human condition that resonate across generations. These works, from the epics of Homer to the novels of Jane Austen, provide more than just compelling stories; they are a mirror to our own lives and societies. By exploring universal themes of love, loss, ambition, and morality, classics help us to understand ourselves and our place in the world. They challenge our perspectives, expand our empathy, and connect us to the vast tapestry of human experience. In an age of fleeting digital content, the enduring wisdom of classic literature is more valuable than ever, providing a foundation of cultural and intellectual nourishment.',
    imageUrl: 'https://picsum.photos/seed/journal1/600/400',
    imageHint: 'reading writer',
    author: 'Jane Austen',
    publishedAt: 'October 15, 2023',
  },
  {
    id: 'article-2',
    slug: 'an-interview-with-a-modern-wordsmith',
    title: 'An Interview with a Modern Wordsmith',
    excerpt: 'We sit down with a bestselling author to discuss their creative process, the challenges of modern storytelling, and their advice for aspiring writers.',
    content: 'In our exclusive interview, acclaimed author XYZ discusses the intricate art of storytelling in the 21st century. "The biggest challenge," they explain, "is cutting through the noise. We are competing for attention with streaming services, social media, and a thousand other distractions." Their advice for new writers is to focus on authentic, character-driven narratives. "Technology changes, but human nature doesn\'t. A story that speaks to a fundamental truth will always find an audience." They also share their daily writing routine, the importance of a dedicated workspace, and how they overcome writer\'s block, offering a rare glimpse into the mind of a master storyteller.',
    imageUrl: 'https://picsum.photos/seed/journal2/600/400',
    imageHint: 'author interview',
    author: 'Leo Tolstoy',
    publishedAt: 'October 10, 2023',
  },
  {
    id: 'article-3',
    slug: 'creating-the-perfect-reading-nook',
    title: 'Creating the Perfect Reading Nook',
    excerpt: 'Tips and tricks for designing a cozy and inviting space in your home that encourages you to get lost in the pages of a good book.',
    content: 'A dedicated reading nook is a sanctuary for any book lover. To create your own, start with a comfortable chair—something you can sink into for hours. Good lighting is crucial; a soft, warm, adjustable lamp will prevent eye strain. Add a small table for your cup of tea and a stack of books. Personalize the space with a plush blanket, a few cushions, and perhaps a piece of art that inspires you. The key is to create a corner of your home that is free from distractions, a place where the outside world fades away and the world of the story can come to life. Even a small apartment can accommodate a cozy nook with a little creativity.',
    imageUrl: 'https://picsum.photos/seed/journal3/600/400',
    imageHint: 'cozy library',
    author: 'Virginia Woolf',
    publishedAt: 'October 5, 2023',
  },
   {
    id: 'article-4',
    slug: 'the-art-of-the-book-cover',
    title: 'The Art of the Book Cover',
    excerpt: 'A deep dive into the design and psychology of book covers. How do they influence our reading choices? What makes a cover iconic?',
    content: 'A book cover is more than just a protective wrapper; it is a piece of art, a marketing tool, and the first handshake between the author\'s world and the reader. This article explores the delicate balance of typography, imagery, and color that goes into creating a compelling cover. We analyze iconic designs, from the minimalist "The Great Gatsby" to the evocative art of the "Harry Potter" series, to understand how they capture a book\'s essence. Designers and marketing experts weigh in on how covers influence purchasing decisions and how the rise of digital reading has changed the game. It’s a celebration of the unsung artists who give a book its face.',
    imageUrl: 'https://picsum.photos/seed/journal4/600/400',
    imageHint: 'book cover design',
    author: 'Jorge Luis Borges',
    publishedAt: 'September 28, 2023',
  },
   {
    id: 'article-5',
    slug: 'literary-tourism-walking-in-the-footsteps-of-giants',
    title: 'Literary Tourism: Walking in the Footsteps of Giants',
    excerpt: 'Explore famous literary landmarks around the world, from Shakespeare\'s Globe to Hemingway\'s Havana. A travel guide for the bookish soul.',
    content: 'Embark on a journey to the places where literature was born. This guide to literary tourism takes you from the misty moors of the Brontë sisters to the bustling streets of Dickens\'s London. We provide itineraries, maps, and travel tips for visiting the homes of famous authors, the settings of classic novels, and the literary cafes where history was written. Discover the real-life inspirations behind your favorite stories and gain a deeper appreciation for the worlds your literary heroes created. Whether it\'s a weekend trip or a globetrotting adventure, walking in the footsteps of literary giants is an unforgettable experience for any bibliophile.',
    imageUrl: 'https://picsum.photos/seed/journal5/600/400',
    imageHint: 'historic library',
    author: 'Italo Calvino',
    publishedAt: 'September 21, 2023',
  },
   {
    id: 'article-6',
    slug: 'the-evolution-of-the-novel',
    title: 'The Evolution of the Novel',
    excerpt: 'Trace the history of the novel from its earliest forms to the contemporary experimental narratives of today. A journey through literary history.',
    content: 'The novel, as we know it, is a relatively modern invention. This article traces its evolution from early prose narratives like "Don Quixote" to the rise of the realist novel in the 19th century and the modernist experiments of the 20th. We examine how societal changes, technological advancements like the printing press, and shifting philosophical ideas have shaped the form and function of the novel. From epistolary novels to postmodern metafiction, the journey of the novel is a story of constant innovation and redefinition. Understanding this history enriches our reading of contemporary fiction and reveals the enduring power of long-form storytelling.',
    imageUrl: 'https://picsum.photos/seed/journal6/600/400',
    imageHint: 'old books',
    author: 'Umberto Eco',
    publishedAt: 'September 14, 2023',
  },
];
