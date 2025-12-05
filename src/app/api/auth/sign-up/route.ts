
import { NextResponse, type NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { uid, email } = await request.json();

    if (!uid || !email) {
      return NextResponse.json({ message: 'Missing uid or email in request body' }, { status: 400 });
    }

    console.log(`User ${email} with UID ${uid} signed up.`);
    // All logged in users are admins, so no special action is needed here.

    return NextResponse.json({ message: 'User processed successfully' }, { status: 200 });

  } catch (error: any) {
    console.error('Error in sign-up API route:', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}
