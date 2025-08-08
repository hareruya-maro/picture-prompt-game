import Link from "next/link";

export default function CreateRoom() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto text-center bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-3xl shadow-2xl border-2 border-white">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
          ルームをつくる
        </h1>

        <div className="space-y-6 text-left">
          <div>
            <label
              htmlFor="host-name"
              className="block text-gray-700 font-bold mb-2"
            >
              あなたのなまえ
            </label>
            <input
              type="text"
              id="host-name"
              placeholder="なまえをいれてね"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-pink-500 focus:ring-pink-500 transition"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2">
              とうひょうモード
            </label>
            <div className="flex bg-gray-200 rounded-xl p-1">
              <div className="w-1/2 relative">
                <input
                  type="radio"
                  id="mode-anonymous"
                  name="vote-mode"
                  className="peer sr-only"
                  defaultChecked
                />
                <label
                  htmlFor="mode-anonymous"
                  className="block text-center w-full py-2 rounded-lg cursor-pointer transition peer-checked:bg-green-400 peer-checked:text-white text-gray-600"
                >
                  だれのかな？
                </label>
              </div>
              <div className="w-1/2 relative">
                <input
                  type="radio"
                  id="mode-named"
                  name="vote-mode"
                  className="peer sr-only"
                />
                <label
                  htmlFor="mode-named"
                  className="block text-center w-full py-2 rounded-lg cursor-pointer transition peer-checked:bg-green-400 peer-checked:text-white text-gray-600"
                >
                  みんなの絵
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2">
              なんかい勝負？
            </label>
            <div className="flex items-center justify-center bg-gray-200 rounded-xl p-1">
              <button
                id="rounds-minus"
                className="text-2xl font-bold text-gray-600 w-12 h-12 rounded-lg hover:bg-gray-300 transition"
              >
                -
              </button>
              <span
                id="rounds-display"
                className="text-3xl font-bold text-gray-800 w-24 text-center"
              >
                3
              </span>
              <button
                id="rounds-plus"
                className="text-2xl font-bold text-gray-600 w-12 h-12 rounded-lg hover:bg-gray-300 transition"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <Link href="/waiting-room">
            <button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-xl text-lg shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300">
              この設定でルームをつくる！
            </button>
          </Link>
          <Link href="/">
            <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-6 rounded-xl text-base mt-2 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-300">
              もどる
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
