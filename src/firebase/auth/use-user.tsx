'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { useAuth, useFirestore } from '../provider';
import { doc, getDoc } from 'firebase/firestore';

export type User = FirebaseUser & {
    isAdmin: boolean;
};

export interface UserContextType {
    user: User | null;
    loading: boolean;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const auth = useAuth();
    const firestore = useFirestore();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!auth || !firestore) {
            setLoading(false);
            return;
        };

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const adminDocRef = doc(firestore, 'admins', firebaseUser.uid);
                const adminDoc = await getDoc(adminDocRef);
                const isAdmin = adminDoc.exists();
                
                setUser({
                    ...firebaseUser,
                    isAdmin: isAdmin
                });
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [auth, firestore]);

    return (
        <UserContext.Provider value={{ user, loading }}>
            {children}
        </UserContext.Provider>
    );
};
