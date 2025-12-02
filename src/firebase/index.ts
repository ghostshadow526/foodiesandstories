import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { firebaseConfig } from './config';

function initializeFirebaseServices() {
    const isInitialized = getApps().length > 0;
    const firebaseApp = isInitialized ? getApp() : initializeApp(firebaseConfig);
    const auth = getAuth(firebaseApp);
    const firestore = getFirestore(firebaseApp);
    return { firebaseApp, auth, firestore };
}

// This is a hack to workaround https://github.com/firebase/firebase-js-sdk/issues/8223
let firebaseServices: {
    firebaseApp: FirebaseApp;
    auth: Auth;
    firestore: Firestore;
};

export function initializeFirebase() {
    if (!firebaseServices) {
        firebaseServices = initializeFirebaseServices();
    }
    return firebaseServices;
}


export * from './provider';
export * from './client-provider';
export * from './auth/use-user';
