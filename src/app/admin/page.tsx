'use client';

import { useUser } from "@/firebase";

export default function AdminDashboardPage() {
    const { user } = useUser();

    return (
        <div>
            <h1 className="text-3xl font-bold mb-4">Welcome, {user?.displayName || user?.email || 'Admin'}!</h1>
            <p className="text-muted-foreground">This is your admin dashboard. Use the navigation on the left to manage your store's content.</p>
        </div>
    )
}
