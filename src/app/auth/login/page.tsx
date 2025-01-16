'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loginUser } from '@/services';

export default function LoginPage() {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
    
        try {
            const { token, user } = await loginUser(username, password);
            
            document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24};`;
            document.cookie = `isAdmin=${user.isAdmin}; path=/; max-age=${60 * 60 * 24 * 7};`;
            
            router.push('/game');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="w-96 p-8 shadow-lg rounded-lg bg-white"
            >
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                    Login
                </h2>

                <div className="mb-6">
                    <label className="block mb-2 font-medium text-gray-700">
                    Username
                    </label>
                    <input
                        type="text"
                        className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block mb-2 font-medium text-gray-700">
                        Password
                    </label>
                    <input
                        type="password"
                        className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                <button
                    className="w-full bg-blue-500 font-semibold text-white py-3 rounded-lg hover:bg-blue-600 transition-colors mb-4 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'Login'}
                </button>

                <p className="text-center text-sm text-gray-600">
                    Don’t have an account?{' '}
                    <Link href="/auth/register" className="text-blue-500 hover:underline">
                    Register
                    </Link>
                </p>
            </form>
        </div>
    );
}
