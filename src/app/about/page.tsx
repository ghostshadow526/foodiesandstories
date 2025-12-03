import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function AboutPage() {
  const aboutImage = PlaceHolderImages.find(img => img.id === 'about-us-image');

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">About ICESTORES</h1>
        <p className="mt-2 text-lg text-muted-foreground">The intersection of literary art and curated excellence.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="prose prose-lg max-w-none text-foreground">
          <p>
            Welcome to <strong>ICESTORES</strong>, your premier destination for curated literary works and exclusive articles. Founded on the principle that reading is a luxurious experience, we dedicate ourselves to sourcing books that are not just stories, but treasures. Our collection is a testament to the power of the written word, featuring timeless classics, groundbreaking contemporary fiction, and profound non-fiction.
          </p>
          <p>
            Our mission is to connect discerning readers with extraordinary literature. We believe in the transformative power of books to inspire, challenge, and enlighten. Every title on our virtual shelves has been handpicked by our team of passionate bibliophiles, ensuring a catalog of unparalleled quality and significance.
          </p>
          <p>
            At ICESTORES, we offer more than just books; we offer an entry into a world of intellectual and aesthetic delight. We are committed to providing a seamless and elegant shopping experience, from discovery to delivery. Join our community of readers and embark on a journey through the finest pages ever written.
          </p>
        </div>
        <div className="aspect-video w-full relative rounded-lg overflow-hidden shadow-xl">
            {aboutImage && (
                <Image 
                    src={aboutImage.imageUrl} 
                    alt={aboutImage.description} 
                    fill 
                    className="object-cover" 
                    data-ai-hint={aboutImage.imageHint}
                />
            )}
        </div>
      </div>
    </div>
  );
}
