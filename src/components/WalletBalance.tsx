import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Loader from './Loader';
import { WalletBalanceProps } from '@/types';
import { fetchBalance } from '@/services';

export default function WalletBalance({
    balance,
    setBalance,
}: 
    WalletBalanceProps
    ) {
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

    return (
        <div
            className="absolute top-2 right-3 flex items-center bg-gray-100 border rounded-full px-4 py-2 text-black shadow cursor-pointer"
            onClick={() => router.push('/wallet')}
        >
        Wallet:{' '}
        {loading ? (
            <Loader
            height="15px"
            width="15px"
            border="2px"
            marginLeft="25px"
            marginRight="0px"
            />
        ) : (
            <>
                <div style={{ backgroundColor: 'transparent' }}>
                    <Image
                        src="/btc.png"
                        alt="Bitcoin Icon"
                        width={18}
                        height={18}
                        className="ml-2 mr-1 pb-[2px]"
                    />
                </div>
                {balance}
            </>
        )}
        </div>
    );
}
