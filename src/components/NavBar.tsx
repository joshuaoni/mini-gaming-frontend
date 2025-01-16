import { getCookie, deleteCookie } from '@/utils/cookie';
import Link from 'next/link';
import {  useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function NavBar() {
    const [isAdmin, setIsAdmin] = useState<string | null>(null);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const admin = getCookie('isAdmin');
        setIsAdmin(admin);
    }, []);

    const handleSignOut = () => {
        deleteCookie('token');
        deleteCookie('isAdmin');
        router.push('/auth/login');
    };

    return (
        <>
            <div className="absolute top-0 h-[75px] w-full p-4 bg-gray-800 text-white flex items-center justify-between sm:justify-start">
                {isAdmin === 'true' && pathname === '/game' && (
                <Link
                    href="/admin"
                    className="text-white hover:underline font-medium"
                >
                    Go to Admin Dashboard
                </Link>
                )}
        
                {pathname === '/game' && (
                <p
                    onClick={handleSignOut}
                    className="ml-4 hover:underline font-medium cursor-pointer"
                >
                    Logout
                </p>
                )}
        
                {(pathname !== '/game' && pathname !== '/transactions') && (
                <Link href="/game" className="text-white hover:underline font-medium">
                    Go Back to Game
                </Link>
                )}
        
                {pathname === '/transactions' && (
                <Link href="/wallet" className="text-white hover:underline font-medium">
                    Go Back to Wallet
                </Link>
                )}
        
                {pathname === '/wallet' && (
                <Link
                    href="/transactions"
                    className="ml-4 text-white hover:underline font-medium"
                >
                    View Transactions
                </Link>
                )}
            </div>
        </>
    ); 
}
