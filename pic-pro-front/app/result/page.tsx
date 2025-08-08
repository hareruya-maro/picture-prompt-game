import Link from "next/link";

export default function Result() {
  return (
    <main className="min-h-screen p-4">
      <div className="container mx-auto">
        <h1
          className="text-3xl md:text-4xl font-bold text-white text-center mb-4"
          style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
        >
          けっか発表！
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-lg border-2 border-white text-center">
            <img
              src="https://placehold.co/400x400/81e6d9/ffffff?text=みんなの絵+1"
              alt="プレイヤー1の絵"
              className="w-full h-auto rounded-lg mb-3"
            />
            <p className="font-bold text-lg text-gray-800">さとう</p>
            <p className="text-pink-500 font-bold text-xl">3票</p>
            <p className="text-sm text-gray-600 mt-2 bg-gray-100 p-2 rounded-lg">
              「かわいい猫、宇宙服を着て、星空を飛んでいる」
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-lg border-2 border-white text-center">
            <img
              src="https://placehold.co/400x400/d6bcfa/ffffff?text=みんなの絵+2"
              alt="プレイヤー2の絵"
              className="w-full h-auto rounded-lg mb-3"
            />
            <p className="font-bold text-lg text-gray-800">すずき</p>
            <p className="text-pink-500 font-bold text-xl">1票</p>
            <p className="text-sm text-gray-600 mt-2 bg-gray-100 p-2 rounded-lg">
              「宇宙を旅する猫」
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-lg border-2 border-white text-center">
            <img
              src="https://placehold.co/400x400/fbb6ce/ffffff?text=みんなの絵+3"
              alt="プレイヤー3の絵"
              className="w-full h-auto rounded-lg mb-3"
            />
            <p className="font-bold text-lg text-gray-800">たなか</p>
            <p className="text-pink-500 font-bold text-xl">0票</p>
            <p className="text-sm text-gray-600 mt-2 bg-gray-100 p-2 rounded-lg">
              「ねこ」
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/final-result">
            <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-xl text-lg shadow-lg transition-transform transform hover:scale-105">
              最終結果へ
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
