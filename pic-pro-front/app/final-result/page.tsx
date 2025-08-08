import Link from "next/link";

export default function FinalResult() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 overflow-hidden">
      <div className="container mx-auto text-center">
        <div className="mb-8">
          <h1
            className="reveal-up-animation text-4xl md:text-5xl font-bold text-white"
            style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
          >
            ゆうしょうは…
          </h1>

          <div
            className="pop-in-animation mt-4 inline-block bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-2xl border-2 border-white relative"
            style={{ animationDelay: "0.5s" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-16 h-16 text-yellow-400 absolute -top-8 left-1/2 -translate-x-1/2"
            >
              <path
                fillRule="evenodd"
                d="M5.25 2.25a3 3 0 0 0-3 3v4.303a3 3 0 0 0 .879 2.121l1.027 1.028a.75.75 0 0 0 1.06 0l1.028-1.028a3 3 0 0 0 .879-2.121V5.25a3 3 0 0 0-3-3Zm-1.5 5.25a1.5 1.5 0 0 1 1.5-1.5h.008a1.5 1.5 0 0 1 1.5 1.5v.293a1.5 1.5 0 0 1-.44 1.06l-.624.624a.75.75 0 0 0-1.06 0l-.625-.624a1.5 1.5 0 0 1-.44-1.06v-.293Zm1.5-3.75a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-1.5 0V4.5a.75.75 0 0 1 .75-.75ZM12 2.25a3 3 0 0 0-3 3v4.303a3 3 0 0 0 .879 2.121l1.027 1.028a.75.75 0 0 0 1.06 0l1.028-1.028a3 3 0 0 0 .879-2.121V5.25a3 3 0 0 0-3-3Zm-1.5 5.25a1.5 1.5 0 0 1 1.5-1.5h.008a1.5 1.5 0 0 1 1.5 1.5v.293a1.5 1.5 0 0 1-.44 1.06l-.624.624a.75.75 0 0 0-1.06 0l-.625-.624a1.5 1.5 0 0 1-.44-1.06v-.293Zm1.5-3.75a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-1.5 0V4.5a.75.75 0 0 1 .75-.75ZM18.75 2.25a3 3 0 0 0-3 3v4.303a3 3 0 0 0 .879 2.121l1.027 1.028a.75.75 0 0 0 1.06 0l1.028-1.028a3 3 0 0 0 .879-2.121V5.25a3 3 0 0 0-3-3Zm-1.5 5.25a1.5 1.5 0 0 1 1.5-1.5h.008a1.5 1.5 0 0 1 1.5 1.5v.293a1.5 1.5 0 0 1-.44 1.06l-.624.624a.75.75 0 0 0-1.06 0l-.625-.624a1.5 1.5 0 0 1-.44-1.06v-.293Zm1.5-3.75a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-1.5 0V4.5a.75.75 0 0 1 .75-.75Z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-4xl md:text-5xl font-bold text-pink-500">
              さとうさん！
            </p>
            <p className="text-2xl text-gray-700 mt-2">15点</p>
          </div>
        </div>

        <div
          className="reveal-up-animation w-full max-w-md mx-auto bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border-2 border-white"
          style={{ animationDelay: "1s" }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            さいしゅうランキング
          </h2>
          <div className="space-y-2 text-lg text-left">
            <p className="p-2 rounded-lg bg-yellow-200">🥇 1位: さとう (15点)</p>
            <p className="p-2 rounded-lg bg-gray-200">🥈 2位: すずき (11点)</p>
            <p className="p-2 rounded-lg bg-orange-200">🥉 3位: たなか (8点)</p>
            <p className="p-2 rounded-lg">4位: わたなべ (5点)</p>
          </div>
        </div>

        <div
          className="reveal-up-animation mt-8 space-y-4 sm:space-y-0 sm:flex sm:gap-4 sm:justify-center"
          style={{ animationDelay: "1.2s" }}
        >
          <Link href="/">
            <button className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-xl text-lg shadow-lg transition-transform transform hover:scale-105">
              もういちどあそぶ！
            </button>
          </Link>
          <Link href="/">
            <button className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-4 px-8 rounded-xl text-lg shadow-lg transition-transform transform hover:scale-105">
              トップにもどる
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
