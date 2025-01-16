'use client';

import { useState } from 'react';
import NavBar from '@/components/NavBar';
import WalletBalance from '@/components/WalletBalance';
import Image from 'next/image';
import { playGame } from '@/services';

export default function GamePage() {
    const [result, setResult] = useState<string | null>(null);
    const [balance, setBalance] = useState<number>(0);
    const [previousBalance, setPreviousBalance] = useState<number>(0);
    const [amount, setAmount] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);
    const [coinFace, setCoinFace] = useState<'head' | 'tail' | null>(null);
    const [spinning, setSpinning] = useState<boolean>(false);

    const handlePlayGame = async () => {
        setError(null);

        try {
            setPreviousBalance(balance);
            setSpinning(true);

            const response = await playGame(amount, coinFace as 'head' | 'tail');
            setBalance(response.balance);
            setResult(response.outcome);
            setAmount(0);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setSpinning(false);
        }
    };

    const handleCoinSelection = (choice: 'head' | 'tail') => {
        setResult('');
        setCoinFace(choice);
    };

    const amountWon = balance - previousBalance;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4 sm:px-0">
            <NavBar />
            <WalletBalance balance={balance} setBalance={setBalance} />
      
            <div className="w-full sm:w-96 p-6 sm:p-8 shadow-lg rounded-lg bg-white mt-8 sm:mt-12">
                <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-4 sm:mb-6">
                Coin Game
                </h2>
                <p className="text-gray-700 mb-4 sm:mb-6 text-center text-sm sm:text-base">
                Flip a coin to win or lose virtual crypto! <br /> Choose head or tail below
                </p>
        
                <div className="flex justify-between mb-4">
                    <button
                        onClick={() => handleCoinSelection('head')}
                        className={`w-[45%] sm:w-24 py-2 rounded-lg ${
                        coinFace === 'head' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                        }`}
                    >
                        Head
                    </button>
                    <button
                        onClick={() => handleCoinSelection('tail')}
                        className={`w-[45%] sm:w-24 py-2 rounded-lg ${
                        coinFace === 'tail' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                        }`}
                    >
                        Tail
                    </button>
                </div>
        
                <input
                    type="number"
                    value={amount > 0 ? amount : ''}
                    onChange={(e) => setAmount(Number(e.target.value) || 0)}
                    placeholder="Enter amount to play"
                    className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                />
        
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        
                <button
                    onClick={handlePlayGame}
                    className="w-full bg-blue-500 font-semibold text-white py-2 sm:py-3 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                    disabled={spinning}
                >
                {spinning ? 'Spinning...' : 'Play'}
                </button>
        
                <div className="mt-6 flex justify-center">
                    {spinning ? (
                        <div className="coin spinning">
                        <div className={`coin-side tail`}>
                            <span className="text-3xl sm:text-4xl">T</span>
                        </div>
                        <div className={`coin-side head`}>
                            <span className="text-3xl sm:text-4xl">H</span>
                        </div>
                        </div>
                    ) : (
                        <div className="coin text-black">
                        {result === 'tail' ? (
                            <div className="coin-side tail">
                            <span className="text-3xl sm:text-4xl">T</span>
                            </div>
                        ) : (
                            <div className="coin-side head">
                            <span className="text-3xl sm:text-4xl">H</span>
                            </div>
                        )}
                        </div>
                    )}
                </div>
        
                {result && !spinning && (
                <p className="flex justify-center mt-2 text-gray-800 font-semibold text-sm sm:text-base">
                    {result === coinFace ? (
                    <span className="flex items-center text-black">
                        You won
                        <Image
                            src="/btc.png"
                            alt="Bitcoin Icon"
                            width={18}
                            height={18}
                            className="ml-[6px] mr-[2px] pb-[2px]"
                        />
                        {amountWon}!
                    </span>
                    ) : (
                    'Oh no! You lost!'
                    )}
                </p>
                )}
            </div>
        </div>
    );
}
