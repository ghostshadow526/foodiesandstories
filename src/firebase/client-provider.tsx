'use client';

import { initializeFirebase } from '.';
import { FirebaseProvider } from './provider';
import { UserProvider } from './auth/use-user';

export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
    const { firebaseApp, auth, firestore } = initializeFirebase();
    return (
        <FirebaseProvider firebaseApp={firebaseApp} auth={auth} firestore={firestore}>
            <UserProvider>
                {children}
            </UserProvider>
        </FirebaseProvider>
    )
}
