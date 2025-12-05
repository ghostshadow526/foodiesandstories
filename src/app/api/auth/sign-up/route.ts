
import { NextResponse, type NextRequest } from 'next/server';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// This is the one-and-only admin email address
const ADMIN_EMAIL = 'abbas@gmail.com';

// Initialize Firebase Admin SDK
// Make sure to upload your service account key to your deployment environment
// and set the GOOGLE_APPLICATION_CREDENTIALS environment variable.
if (!getApps().length) {
  initializeApp({
    // If you're using Vercel or a similar platform, you can store your
    // service account key as a JSON environment variable.
    credential: process.env.GOOGLE_APPLICATION_CREDENTIALS 
      ? cert(JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS as string))
      : undefined
  });
}

const db = getFirestore();

export async function POST(request: NextRequest) {
  try {
    const { uid, email } = await request.json();

    if (!uid || !email) {
      return NextResponse.json({ message: 'Missing uid or email in request body' }, { status: 400 });
    }

    // Check if the signing up user is the designated admin
    if (email === ADMIN_EMAIL) {
      // Add the user's UID to the 'admins' collection
      const adminRef = db.collection('admins').doc(uid);
      await adminRef.set({ isAdmin: true, joinedAt: new Date() });
      console.log(`User ${email} with UID ${uid} has been made an admin.`);
    } else {
      console.log(`User ${email} with UID ${uid} is a regular user.`);
      // You could potentially create a 'users' document here for non-admins if needed
    }

    return NextResponse.json({ message: 'User processed successfully' }, { status: 200 });

  } catch (error: any) {
    console.error('Error in sign-up API route:', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}
