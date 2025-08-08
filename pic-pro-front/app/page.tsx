import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto text-center bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-3xl shadow-2xl border-2 border-white">
        <div className="mb-4">
          <svg
            className="w-24 h-24 mx-auto text-pink-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 1-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 1 3.09-3.09L12 5.25l2.846.813a4.5 4.5 0 0 1 3.09 3.09L21.75 12l-2.846.813a4.5 4.5 0 0 1-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18.25 2.25l.52 1.036a3.375 3.375 0 0 0 2.455 2.455L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.5 13.5h3.375v3.375h-3.375V13.5Z"
            />
          </svg>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
          ピクプロ！
        </h1>
        <p className="text-gray-600 mb-8 text-sm sm:text-base">
          ひらめきで、お題の絵を完全再現！
        </p>

        <div className="space-y-4">
          <Link href="/create-room">
            <button className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-4 px-6 rounded-xl text-lg shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-pink-300">
              ルームをつくる
            </button>
          </Link>
          <Link href="/access-room">
            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-xl text-lg shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300">
              ルームにはいる
            </button>
          </Link>
          <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-6 rounded-xl text-base mt-4 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-300">
            あそびかた
          </button>
        </div>
      </div>
    </main>
  );
}