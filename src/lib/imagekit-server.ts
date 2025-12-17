
import ImageKit from 'imagekit';

let imagekitInstance: ImageKit | null = null;

export function getImageKitInstance() {
    if (imagekitInstance) {
        return imagekitInstance;
    }

    if (!process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || !process.env.IMAGEKIT_PRIVATE_KEY || !process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT) {
        throw new Error("ImageKit credentials are not set in the environment variables.");
    }
    
    imagekitInstance = new ImageKit({
        publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
        urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
    });

    return imagekitInstance;
}
