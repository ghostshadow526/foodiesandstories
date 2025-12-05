'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { useAuth } from '../provider';

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
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!auth) {
            setLoading(false);
            return;
        };

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                setUser({
                    ...firebaseUser,
                    isAdmin: false
                });
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [auth]);

    return (
        <UserContext.Provider value={{ user, loading }}>
            {children}
        </UserContext.Provider>
    );
};
