'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Loader from '@/components/Loader';
import NavBar from '@/components/NavBar';
import { fetchBalance, handleWalletAction } from '@/services';

export default function WalletPage() {
    const [balance, setBalance] = useState<number>(0);
    const [depositAmount, setDepositAmount] = useState<number>(0);
    const [withdrawAmount, setWithdrawAmount] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);
    const [loadingDeposit, setLoadingDeposit] = useState<boolean>(false);
    const [loadingWithdrawal, setLoadingWithdrawal] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    
    const router = useRouter();

    useEffect(() => {
        const loadBalance = async () => {
            setLoading(true);
            try {
                const fetchedBalance = await fetchBalance();
                setBalance(fetchedBalance);
            } catch (error: any) {
                if (error.message === 'No token provided' || error.message === 'Invalid token') {
                router.push('/auth/login');
                } else {
                console.error('Error fetching balance:', error.message);
                }
            } finally {
                setLoading(false);
            }
        };
        loadBalance();
      }, [router]);

      const handleDeposit = async () => {
        setError(null);
      
        if (depositAmount < 1) {
            return;
        }
      
        setLoadingDeposit(true);
      
        try {
            const { balance: newBalance } = await handleWalletAction('deposit', depositAmount);
            setBalance(newBalance);
            setDepositAmount(0);
        } catch (error: any) {
            if (error.message === 'No token provided' || error.message === 'Invalid token') {
                router.push('/auth/login');
            } else {
                // setError(error.message);
            }
        } finally {
            setLoadingDeposit(false);
        }
      };
      
    const handleWithdraw = async () => {
        setError(null);
        
        if (withdrawAmount < 1) {
            return;
        }
        
        setLoadingWithdrawal(true);
    
        try {
            const { balance: newBalance } = await handleWalletAction('withdraw', withdrawAmount);
            setBalance(newBalance);
            setWithdrawAmount(0);
        } catch (error: any) {
            if (error.message === 'No token provided' || error.message === 'Invalid token') {
                router.push('/auth/login');
            } else {
                setError(error.message);
            }
        } finally {
            setLoadingWithdrawal(false);
        }
    };
      

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <NavBar />

            <div className="w-96 max-w-4xl bg-white shadow-lg rounded-lg p-8 mt-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Wallet</h2>

                <span className="mb-6 flex items-center text-gray-700">
                    <span>Your current balance:</span>
                    {loading ? (
                    <Loader
                        height="20px"
                        width="20px"
                        border="3px"
                        marginLeft="20px"
                        marginRight="0px"
                    />
                    ) : (
                    <span className="flex items-center ml-2">
                        <Image
                            src="/btc.png"
                            alt="Bitcoin Icon"
                            width={18}
                            height={18}
                            className="ml-2 mr-[2px] pb-[2px]"
                        />
                        <span className="text-black-600 font-medium">{balance}</span>
                    </span>
                    )}
                </span>

            <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                Deposit Amount:
                </label>
                <input
                    type="number"
                    value={depositAmount === 0 ? '' : depositAmount} 
                    onChange={(e) => setDepositAmount(Number(e.target.value) || 0)}
                    className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter amount"
                />
                <button
                    onClick={handleDeposit}
                    className="mt-4 w-full bg-green-500 text-white font-semibold py-3 rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                    disabled={loadingDeposit}
                >
                {loadingDeposit ? 'Loading...' : 'Deposit'}
                </button>
            </div>

            <div>
                <label className="block text-gray-700 font-medium mb-2">
                Withdraw Amount:
                </label>
                <input
                    type="number"
                    value={withdrawAmount === 0 ? '' : withdrawAmount}
                    onChange={(e) => setWithdrawAmount(Number(e.target.value) || 0)}
                    className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter amount"
                />

                {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

                <button
                    onClick={handleWithdraw}
                    className="mt-4 w-full bg-red-500 text-white font-semibold py-3 rounded-lg hover:bg-red-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                    disabled={loadingWithdrawal}
                >
                {loadingWithdrawal ? 'Loading...' : 'Withdraw'}
                </button>
            </div>
            </div>
        </div>
    );
}
