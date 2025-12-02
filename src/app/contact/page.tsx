import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">Contact Us</h1>
        <p className="mt-2 text-lg text-muted-foreground">We'd love to hear from you. Reach out with any questions or comments.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-8">
            <div className="flex items-start gap-4">
                <div className="bg-primary text-primary-foreground p-3 rounded-md">
                    <Mail className="h-6 w-6" />
                </div>
                <div>
                    <h3 className="font-headline text-xl font-semibold">Email</h3>
                    <p className="text-muted-foreground">For general inquiries and support.</p>
                    <a href="mailto:support@prestigepages.com" className="text-primary hover:underline">support@prestigepages.com</a>
                </div>
            </div>
             <div className="flex items-start gap-4">
                <div className="bg-primary text-primary-foreground p-3 rounded-md">
                    <Phone className="h-6 w-6" />
                </div>
                <div>
                    <h3 className="font-headline text-xl font-semibold">Phone</h3>
                    <p className="text-muted-foreground">Mon-Fri from 9am to 5pm.</p>
                    <a href="tel:+23412345678" className="text-primary hover:underline">+234 123 456 78</a>
                </div>
            </div>
             <div className="flex items-start gap-4">
                <div className="bg-primary text-primary-foreground p-3 rounded-md">
                    <MapPin className="h-6 w-6" />
                </div>
                <div>
                    <h3 className="font-headline text-xl font-semibold">Office</h3>
                    <p className="text-muted-foreground">123 Luxury Avenue, Lagos, Nigeria</p>
                </div>
            </div>
        </div>

        <div>
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Your Name" />
                </div>
                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Your Email" />
                </div>
            </div>
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" placeholder="Subject of your message" />
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" placeholder="Your message..." rows={6} />
            </div>
            <Button type="submit" className="w-full">Send Message</Button>
          </form>
        </div>
      </div>
    </div>
  );
}
