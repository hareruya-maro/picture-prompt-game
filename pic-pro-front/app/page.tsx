import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto text-center bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-3xl shadow-2xl border-2 border-white">
        <div className="mb-4">
          <Image
            src="/icon.png"
            alt="ピクプロ！アイコン"
            width={96}
            height={96}
            className="mx-auto"
          />
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
          ピクプロ！
        </h1>
        <p className="text-gray-600 mb-8 text-sm sm:text-base">
          ひらめきで、お題の絵を完全再現！
        </p>

        <div className="space-y-4">
          <Link href="/create-room">
            <button className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold my-4 py-4 px-6 rounded-xl text-lg shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-pink-300">
              ルームをつくる
            </button>
          </Link>
          <Link href="/access-room">
            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold my-4 py-4 px-6 rounded-xl text-lg shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300">
              ルームにはいる
            </button>
          </Link>
          <Link href="/how-to-play">
            <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-6 rounded-xl text-base mt-4 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-300">
              あそびかた
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
