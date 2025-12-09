
import { NextResponse } from 'next/server';
import ImageKit from 'imagekit';

// Initialize imagekit inside the handler to avoid build-time errors
// when environment variables are not present.
function getImageKitInstance() {
    if (!process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || !process.env.IMAGEKIT_PRIVATE_KEY || !process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT) {
        throw new Error("ImageKit credentials are not set in the environment variables.");
    }

    return new ImageKit({
        publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
        urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
    });
}

export async function GET(request: Request) {
  try {
    const imagekit = getImageKitInstance();
    const authenticationParameters = imagekit.getAuthenticationParameters();
    return NextResponse.json(authenticationParameters);
  } catch (error) {
    console.error("Error getting ImageKit auth params:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { message: "Error generating ImageKit signature", error: errorMessage },
      { status: 500 }
    );
  }
}
