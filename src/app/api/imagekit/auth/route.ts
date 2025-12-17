
import { NextResponse } from 'next/server';
import { getImageKitInstance } from '@/lib/imagekit-server';

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
