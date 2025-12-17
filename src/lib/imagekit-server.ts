import ImageKit from 'imagekit';

let imagekitInstance: ImageKit | null = null;

// This function should only be called on the server
export function getImageKitInstance() {
    if (imagekitInstance) {
        return imagekitInstance;
    }
    
    // Ensure all required environment variables are present
    if (!process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || !process.env.IMAGEKIT_PRIVATE_KEY || !process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT) {
        console.error("ImageKit credentials are not fully set in the environment variables.");
        throw new Error("ImageKit credentials are not configured properly on the server.");
    }
    
    imagekitInstance = new ImageKit({
        publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
        urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
    });

    return imagekitInstance;
}
