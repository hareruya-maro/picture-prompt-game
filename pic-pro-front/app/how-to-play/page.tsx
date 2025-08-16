import Image from "next/image";
import Link from "next/link";

export default function HowToPlay() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-3xl shadow-2xl border-2 border-white">
        <div className="text-center mb-6">
          <Image
            src="/icon.png"
            alt="ピクプロ！アイコン"
            width={64}
            height={64}
            className="mx-auto mb-4"
          />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            あそびかた
          </h1>
        </div>

        <div className="space-y-6 text-gray-700">
          <div className="bg-yellow-100 p-4 rounded-xl border-l-4 border-yellow-500">
            <h2 className="text-xl font-bold mb-2 text-yellow-700">
              🎯 ゲームの目的
            </h2>
            <p className="text-sm sm:text-base">
              お題の画像を見て、その内容を説明するプロンプトを考えます。
              <br />
              各プレイヤーが考えたプロンプトからAIで画像を生成して、どれだけ元の画像に近づけるかを競います！
            </p>
          </div>

          <div className="bg-blue-100 p-4 rounded-xl border-l-4 border-blue-500">
            <h2 className="text-xl font-bold mb-3 text-blue-700">
              📋 ゲームの流れ
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-sm sm:text-base">
              <li>
                <strong>ルーム作成・参加：</strong>
                誰かがルームを作り、他のプレイヤーがコードで参加
              </li>
              <li>
                <strong>お題画像決定：</strong>
                ランダムに選ばれたお題の画像が表示されます
              </li>
              <li>
                <strong>プロンプト入力：</strong>
                表示された画像を見て、その内容を説明するプロンプトを入力
              </li>
              <li>
                <strong>画像生成：</strong>
                各プレイヤーのプロンプトからAIが画像を生成
              </li>
              <li>
                <strong>投票：</strong>
                生成された画像の中から、最も元の画像に近いと思うものに投票
              </li>
              <li>
                <strong>結果発表：</strong>投票結果と正解を発表！
              </li>
            </ol>
          </div>

          <div className="bg-green-100 p-4 rounded-xl border-l-4 border-green-500">
            <h2 className="text-xl font-bold mb-2 text-green-700">
              💡 プロンプトのコツ
            </h2>
            <ul className="list-disc list-inside space-y-1 text-sm sm:text-base">
              <li>
                画像の<strong>具体的な内容</strong>を詳しく説明しよう
              </li>
              <li>
                <strong>色や形、位置関係</strong>も重要なポイント
              </li>
              <li>
                <strong>画風やスタイル</strong>も指定すると効果的
              </li>
              <li>短すぎず、長すぎない適度な長さで</li>
            </ul>
          </div>

          <div className="bg-pink-100 p-4 rounded-xl border-l-4 border-pink-500">
            <h2 className="text-xl font-bold mb-2 text-pink-700">
              🏆 勝利条件
            </h2>
            <p className="text-sm sm:text-base">
              最も多くの票を集めた画像を生成したプレイヤーが勝利！
              <br />
              みんなで楽しく創造力を競い合いましょう。
            </p>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link href="/">
            <button className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-xl text-base transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-300">
              トップページにもどる
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
