import Link from "next/link";

export default function InputPrompt() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-xl mx-auto bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-3xl shadow-2xl border-2 border-white">
        <div className="mb-4">
          <p className="text-center text-gray-600 mb-2">
            この絵になるようにプロンプトを考えてね！
          </p>
          <img
            src="https://placehold.co/600x400/f6ad55/ffffff?text=おてほんの絵"
            alt="お手本の絵"
            className="w-full h-auto rounded-xl shadow-lg border-2 border-white"
          />
        </div>

        <div className="relative mb-4">
          <textarea
            id="prompt-input"
            rows={3}
            className="w-full px-4 py-3 pr-16 rounded-xl border-2 border-gray-300 focus:border-pink-500 focus:ring-pink-500 transition"
            placeholder="どんなプロンプトかな？"
          ></textarea>
          <button className="absolute top-1/2 right-4 transform -translate-y-1/2 p-2 rounded-full bg-pink-500 hover:bg-pink-600 transition">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="white"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m12 0v-1.5a6 6 0 0 0-6-6v0a6 6 0 0 0-6 6v1.5m12 0v-1.5a6 6 0 0 0-6-6v0a6 6 0 0 0-6 6v1.5m0 9.75v-1.5a6 6 0 0 0-6-6m0 0v-1.5a6 6 0 0 1 6-6v0a6 6 0 0 1 6 6v1.5m0 0a6 6 0 0 0 6 6m-12-3v3"
              />
            </svg>
          </button>
        </div>

        <Link href="/vote">
          <button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-xl text-lg shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300 mb-6">
            このプロンプトで決定！
          </button>
        </Link>

        <div>
          <h3 className="text-center text-gray-700 font-bold mb-2">
            みんなのじょうきょう
          </h3>
          <div className="flex flex-wrap justify-center gap-2 text-sm">
            <span className="py-1 px-3 rounded-full bg-green-200 text-green-800 shadow">
              さとう: OK!
            </span>
            <span className="py-1 px-3 rounded-full bg-gray-200 text-gray-600 shadow">
              たなか: 考え中...
            </span>
            <span className="py-1 px-3 rounded-full bg-green-200 text-green-800 shadow">
              すずき: OK!
            </span>
            <span className="py-1 px-3 rounded-full bg-gray-200 text-gray-600 shadow">
              わたなべ: 考え中...
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
