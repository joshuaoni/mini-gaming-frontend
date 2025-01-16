'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCookie } from '@/utils/cookie';
import Loader from '@/components/Loader';
import NavBar from '@/components/NavBar';
import { TransProps } from '@/types';
import { fetchTransactions } from '@/services';

export default function GamePage() {
    const [transactions, setTransactions] = useState<[TransProps] | []>([]);
    const [offset, setOffset] = useState<number>(0);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);
    const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true); 

    const router = useRouter();

    const loadTransactions = async () => {
        try {
            const token = getCookie('token');
        
            if (!token) {
                router.push('/auth/login');
                return;
            }
    
            setLoading(true);
        
            const limit = 10;

            const { transactions: newTransactions, hasMore: more } = await fetchTransactions(token, offset, limit);
            const updatedTransactions = [...transactions, ...newTransactions];
            setTransactions(updatedTransactions as [TransProps]);
            setHasMore(more);
            setOffset((prev) => prev + limit);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        } finally {
            setLoading(false);
            setIsInitialLoad(false);
        }
    };
    
    useEffect(() => {
        loadTransactions();
    }, [router]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <NavBar />

            <div className="mt-24 mb-16 w-full max-w-3xl bg-white shadow-lg rounded-lg p-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                    Transaction History
                </h1>
                {transactions.length === 0 ? (
                    <>
                    {!isInitialLoad && (
                        <p className="text-gray-600 text-center">
                        No transactions available.
                        </p>
                    )}
                    </>
                ) : (
                    <ul className="divide-y divide-gray-200">
                    {transactions.map((transaction) => (
                        <li
                            key={transaction.id}
                            className="py-4 flex justify-between items-center"
                        >
                        <div>
                            <p className="text-sm font-medium text-gray-900 capitalize">
                            {transaction.type === 'deposit'
                                ? 'Deposit'
                                : transaction.type === 'withdrawal'
                                ? 'Withdrawal'
                                : 'Game'}
                            </p>
                            <p className="text-sm text-gray-500">
                            {new Date(transaction.createdAt).toLocaleString()}
                            </p>
                        </div>
                        <p
                            className={`text-sm font-bold ${
                            transaction.type === 'withdrawal'
                                ? 'text-blue-500'
                                : transaction.amount > 0
                                ? 'text-green-500'
                                : 'text-red-500'
                            }`}
                        >
                            {transaction.type === 'withdrawal' ? '-' : transaction.amount > 0 ? '+' : '-'}$
                            {Math.abs(transaction.amount)}
                        </p>
                        </li>
                    ))}
                    </ul>
                )}
                {!isInitialLoad ? (
                    <>
                    {hasMore && (
                        <div className="text-center mt-4">
                            <button
                                onClick={loadTransactions}
                                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                                disabled={loading}
                            >
                                {loading ? 'Loading...' : 'Show More'}
                            </button>
                        </div>
                    )}
                    </>
                ) : (
                    <Loader
                        width="50px"
                        height="50px"
                        border="5px"
                        marginLeft="0px"
                        marginRight="0px"
                    />
                )}
            </div>
        </div>
    );
}
