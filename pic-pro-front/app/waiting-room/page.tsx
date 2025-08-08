import Link from "next/link";

export default function WaitingRoom() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-3xl shadow-2xl border-2 border-white">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 text-center">
          みんながそろうまでまってね
        </h1>

        <div className="mb-6 text-center">
          <p className="text-gray-600 text-sm">ルームID</p>
          <div className="bg-gray-200 rounded-lg p-3 mt-1 flex items-center justify-center">
            <p
              id="room-id-display"
              className="text-2xl font-bold text-gray-800 tracking-widest"
            >
              AB12CD
            </p>
            <button className="ml-4 p-2 rounded-lg bg-white hover:bg-gray-100 transition">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6 text-gray-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v3.042m-7.332 0c-.055.194-.084.4-.084.612v3.042m0 0a2.25 2.25 0 0 0 2.25 2.25h3a2.25 2.25 0 0 0 2.25-2.25m-7.5 0h7.5m-7.5 0a2.25 2.25 0 0 0-2.25 2.25v3.75c0 1.243 1.007 2.25 2.25 2.25h3c1.243 0 2.25-1.007 2.25-2.25v-3.75a2.25 2.25 0 0 0-2.25-2.25h-3.03"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-700 mb-2 text-center">
            いまいるメンバー
          </h2>
          <div
            id="player-list"
            className="bg-white/50 rounded-lg p-4 h-40 overflow-y-auto border-2 border-white"
          >
            <p className="py-1 px-2 rounded-md bg-white mb-2 shadow">
              さとう（ホスト）
            </p>
            <p className="py-1 px-2 rounded-md bg-white mb-2 shadow">たなか</p>
            <p className="py-1 px-2 rounded-md bg-white mb-2 shadow">すずき</p>
          </div>
        </div>

        <div className="text-sm text-gray-600 space-y-1 mb-6 text-center">
          <p>
            とうひょうモード:{" "}
            <span className="font-bold text-pink-500">だれのかな？</span>
          </p>
          <p>
            なんかい勝負？: <span className="font-bold text-pink-500">3回</span>
          </p>
        </div>

        <div className="space-y-3">
          <Link href="/theme">
            <button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-xl text-lg shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300">
              ゲームをはじめる！
            </button>
          </Link>
          <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-3 px-6 rounded-xl text-base shadow-md transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-yellow-300">
            ルールかくにん
          </button>
          <Link href="/">
            <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-6 rounded-xl text-sm mt-2 transition-transform transform hover:scale-105">
              ルームからでる
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
