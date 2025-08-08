import Link from "next/link";

export default function Theme() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 overflow-hidden">
      <div className="w-full max-w-lg mx-auto text-center">
        <div className="reveal-animation" style={{ animationDelay: "0s" }}>
          <h1
            className="text-4xl md:text-5xl font-bold text-white text-shadow mb-4"
            style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
          >
            第1ラウンド
          </h1>
          <h2
            className="text-5xl md:text-6xl font-bold text-white text-shadow"
            style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
          >
            お題発表！
          </h2>
        </div>

        <div
          className="mt-8 reveal-animation"
          style={{ animationDelay: "0.5s" }}
        >
          <div className="bg-white p-4 rounded-3xl shadow-2xl border-4 border-white">
            <Link href="/input-prompt">
              <img
                src="https://placehold.co/600x400/f6ad55/ffffff?text=おてほんの絵"
                alt="お手本の絵"
                className="w-full h-auto rounded-xl"
              />
            </Link>
          </div>
        </div>

        <p
          className="mt-6 text-white text-shadow reveal-animation"
          style={{
            animationDelay: "1s",
            textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
          }}
        >
          プロンプト入力画面にうつるよ…
        </p>
      </div>
    </main>
  );
}
