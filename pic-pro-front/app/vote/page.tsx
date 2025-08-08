import Link from "next/link";

export default function Vote() {
  return (
    <main className="min-h-screen p-4">
      <div className="container mx-auto">
        <h1
          className="text-3xl md:text-4xl font-bold text-white text-center mb-4"
          style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
        >
          いちばんにてるのはどれ？
        </h1>

        <div className="mb-6 sticky top-4 z-10">
          <div className="max-w-xs mx-auto bg-white/80 backdrop-blur-sm p-2 rounded-2xl shadow-lg border-2 border-white">
            <p className="text-center text-sm text-gray-600 mb-1">おてほんの絵</p>
            <img
              src="https://placehold.co/600x400/f6ad55/ffffff?text=おてほんの絵"
              alt="お手本の絵"
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div className="bg-white/80 backdrop-blur-sm p-3 rounded-2xl shadow-lg border-2 border-white text-center transition-transform transform hover:scale-105">
            <img
              src="https://placehold.co/400x400/81e6d9/ffffff?text=みんなの絵+1"
              alt="プレイヤー1の絵"
              className="w-full h-auto rounded-lg mb-3 cursor-pointer"
            />
            <Link href="/result">
              <button className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-lg text-lg shadow-md transition">
                とうひょう！
              </button>
            </Link>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-3 rounded-2xl shadow-lg border-2 border-white text-center transition-transform transform hover:scale-105">
            <img
              src="https://placehold.co/400x400/d6bcfa/ffffff?text=みんなの絵+2"
              alt="プレイヤー2の絵"
              className="w-full h-auto rounded-lg mb-3 cursor-pointer"
            />
            <Link href="/result">
              <button className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-lg text-lg shadow-md transition">
                とうひょう！
              </button>
            </Link>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-3 rounded-2xl shadow-lg border-2 border-white text-center transition-transform transform hover:scale-105">
            <img
              src="https://placehold.co/400x400/fbb6ce/ffffff?text=みんなの絵+3"
              alt="プレイヤー3の絵"
              className="w-full h-auto rounded-lg mb-3 cursor-pointer"
            />
            <Link href="/result">
              <button className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-lg text-lg shadow-md transition">
                とうひょう！
              </button>
            </Link>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-3 rounded-2xl shadow-lg border-2 border-white text-center transition-transform transform hover:scale-105">
            <img
              src="https://placehold.co/400x400/a0aec0/ffffff?text=みんなの絵+4"
              alt="プレイヤー4の絵"
              className="w-full h-auto rounded-lg mb-3 cursor-pointer"
            />
            <Link href="/result">
              <button className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-lg text-lg shadow-md transition">
                とうひょう！
              </button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
