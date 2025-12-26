'use client';

import { useEffect, useRef } from 'react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function InactivityLogout({ timeoutMinutes = 5 }: { timeoutMinutes?: number }) {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const router = useRouter();

    const logout = async () => {
        await signOut({ redirect: false });
        router.push('/login');
    };

    const resetTimer = () => {
        // Clear existing timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Set new timeout
        timeoutRef.current = setTimeout(() => {
            logout();
        }, timeoutMinutes * 60 * 1000); // Convert minutes to milliseconds
    };

    useEffect(() => {
        // List of events that indicate user activity
        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

        // Reset timer on any activity
        const handleActivity = () => {
            resetTimer();
        };

        // Add event listeners
        events.forEach(event => {
            document.addEventListener(event, handleActivity);
        });

        // Initialize timer
        resetTimer();

        // Cleanup
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            events.forEach(event => {
                document.removeEventListener(event, handleActivity);
            });
        };
    }, [timeoutMinutes]);

    return null; // This component doesn't render anything
}
