import Image from 'next/image';

export default function AboutPage() {
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">About the Visionary</h1>
        <p className="mt-2 text-lg text-muted-foreground">The story behind ICESTORIES and its founder.</p>
      </div>

      <div className="grid md:grid-cols-5 gap-12 items-center">
        <div className="md:col-span-3 prose prose-lg max-w-none text-foreground">
          <p className="lead">
            At the heart of ICESTORIES is a singular vision, a profound passion for literature, and an unrelenting drive for excellence, all embodied by its founder, <strong>Emenike Charles Ifunanya</strong>.
          </p>
          <p>
            Emenike is not just an entrepreneur; he is a lifelong bibliophile, a connoisseur of stories, and a firm believer in the transformative power of the written word. His journey began with the simple act of reading, but quickly blossomed into a deep appreciation for the art of storytelling and the craft of book-making. He envisioned a space where literature was not merely sold, but celebrated. A sanctuary for readers who, like him, seek more than just a story—they seek an experience.
          </p>
          <p>
            With a discerning eye and an unyielding commitment to quality, Emenike personally curates the collection at ICESTORIES. He travels, he researches, and he connects with publishers and authors to source books that are not just bestsellers, but timeless treasures. His philosophy is simple: every book on our shelves must be a work of art, capable of inspiring, challenging, and moving the reader.
          </p>
          <p>
            Emenike Charles Ifunanya's passion is the bedrock of ICESTORIES. It is his dedication that shapes our identity and his vision that guides our mission. This store is more than a business; it's the realization of a dream to build a community around the shared love of extraordinary literature. When you shop at ICESTORIES, you are not just buying a book; you are becoming part of Emenike's world, a world where every story matters and every reader is cherished.
          </p>
        </div>
        <div className="md:col-span-2 aspect-square w-full relative rounded-lg overflow-hidden shadow-xl">
            <Image 
                src="https://raw.githubusercontent.com/ghostshadow526/boredape/main/Store.jpg"
                alt="Emenike Charles Ifunanya" 
                fill 
                className="object-cover" 
                data-ai-hint="portrait man"
            />
        </div>
      </div>
    </div>
  );
}
