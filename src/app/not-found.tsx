import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex bg-gray-100 text-black flex-col items-center justify-center h-screen px-4 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">404 - Page Not Found</h1>
            <p className="mb-6 text-lg sm:text-xl">
                The page you're looking for doesn't exist.
            </p>
            <Link
                href="/"
                className="text-blue-500 hover:underline text-base sm:text-lg"
            >
                Go back home
            </Link>
        </div>
    );
}
  