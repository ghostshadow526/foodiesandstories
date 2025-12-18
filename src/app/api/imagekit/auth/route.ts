
import { NextResponse } from 'next/server';
import { getImageKitInstance } from '@/lib/imagekit-server';

const allowedOrigins = [
  'http://localhost:9002', // Local dev
  'https://www.foodiesandstories.com',
  // Add any Firebase Studio preview URLs if needed, e.g., 'https://*.web.app'
];

export async function GET(request: Request) {
  const requestOrigin = request.headers.get('origin');
  let origin = '';

  if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
    origin = requestOrigin;
  } else if (process.env.NODE_ENV === 'development') {
    // Looser policy for local development if origin is not standard
    origin = requestOrigin || '*';
  } else {
    // For production, default to the main site if origin doesn't match
    origin = 'https://www.foodiesandstories.com';
  }

  const headers = {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  try {
    const imagekit = getImageKitInstance();
    const authenticationParameters = imagekit.getAuthenticationParameters();
    return NextResponse.json(authenticationParameters, { headers });
  } catch (error) {
    console.error("Error getting ImageKit auth params:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { message: "Error generating ImageKit signature", error: errorMessage },
      { status: 500, headers }
    );
  }
}

// Handle preflight requests
export async function OPTIONS(request: Request) {
  const requestOrigin = request.headers.get('origin');
  let origin = '';
  if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
    origin = requestOrigin;
  } else if (process.env.NODE_ENV === 'development' && requestOrigin?.startsWith('http://localhost')) {
    origin = requestOrigin;
  }
  
  if (!origin) {
      return new NextResponse('Not allowed', { status: 403 });
  }

  const headers = {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
  return new NextResponse(null, { headers });
}
