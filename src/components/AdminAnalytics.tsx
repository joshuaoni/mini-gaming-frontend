import { Analytics } from '@/types';
import Image from 'next/image';

export default function AdminAnalytics({
    analytics,
}: {
    analytics: Analytics | null;
}) {
    return (
        <>
            {analytics && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                    <div className="p-6 shadow-lg rounded-lg bg-white flex flex-col justify-between">
                        <h2 className="text-lg font-semibold text-gray-700">
                            Total Transactions
                        </h2>
                        <p className="text-3xl font-bold text-blue-600">
                            {analytics.totalTransactions}
                        </p>
                    </div>
                    <div className="p-6 shadow-lg rounded-lg bg-white flex flex-col justify-between">
                        <h2 className="text-lg font-semibold text-gray-700">
                            Transactions in Last 24 Hours
                        </h2>
                        <p className="text-3xl font-bold text-blue-600">
                            {analytics.transactionsInLast24h}
                        </p>
                    </div>
                    <div className="p-6 shadow-lg rounded-lg bg-white flex flex-col justify-between">
                        <h2 className="text-lg font-semibold text-gray-700">
                            Transactions by Type
                        </h2>
                        <p className="text-gray-600">
                            Deposits: {analytics.transactionsByType.deposit}
                        </p>
                        <p className="text-gray-600">
                            Withdrawals: {analytics.transactionsByType.withdrawal}
                        </p>
                        <p className="text-gray-600">
                            Games: {analytics.transactionsByType.game}
                        </p>
                    </div>
                    <div className="p-6 shadow-lg rounded-lg bg-white flex flex-col justify-between">
                        <h2 className="text-lg font-semibold text-gray-700">
                            Top 3 Depositors
                        </h2>
                        <ul className="text-gray-600">
                            {analytics.topDepositors.map((depositor, index) => (
                                <li key={index} className="flex items-center text-gray-700">
                                {depositor.username}:{' '}
                                <span className="flex items-center text-blue-600">
                                    <Image
                                        src="/btc.png"
                                        alt="Bitcoin Icon"
                                        width={18}
                                        height={18}
                                        className="ml-2 mr-1 pb-[2px]"
                                    />
                                    {depositor.totalWon}
                                </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="p-6 shadow-lg rounded-lg bg-white flex flex-col justify-between">
                        <h2 className="text-lg font-semibold text-gray-700">
                        Total Deposits
                        </h2>
                        <p className="flex items-center text-3xl font-bold text-green-600">
                        <Image
                            src="/btc.png"
                            alt="Bitcoin Icon"
                            width={25}
                            height={25}
                            className="mr-1"
                        />
                        {analytics.totalDeposits}
                        </p>
                    </div>
                    <div className="p-6 shadow-lg rounded-lg bg-white flex flex-col justify-between">
                        <h2 className="text-lg font-semibold text-gray-700">
                        Total Withdrawals
                        </h2>
                        <p className="flex items-center text-3xl font-bold text-red-600">
                        <Image
                            src="/btc.png"
                            alt="Bitcoin Icon"
                            width={25}
                            height={25}
                            className="mr-1"
                        />
                        {analytics.totalWithdrawals}
                        </p>
                    </div>
                    <div className="p-6 shadow-lg rounded-lg bg-white flex flex-col justify-between">
                        <h2 className="text-lg font-semibold text-gray-700">
                        Total Games Played
                        </h2>
                        <p className="text-3xl font-bold text-indigo-600">
                        {analytics.totalGamesPlayed}
                        </p>
                    </div>
                    <div className="p-6 shadow-lg rounded-lg bg-white flex flex-col justify-between">
                        <h2 className="text-lg font-semibold text-gray-700">
                        Average Transaction Amount
                        </h2>
                        <p className="flex items-center text-3xl font-bold text-purple-600">
                        <Image
                            src="/btc.png"
                            alt="Bitcoin Icon"
                            width={25}
                            height={25}
                            className="mr-1"
                        />
                        {analytics.averageTransactionAmount.toFixed(2)}
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}
