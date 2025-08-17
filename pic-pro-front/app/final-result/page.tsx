"use client";

import LoadingSpinner from "@/src/components/LoadingSpinner";
import { db } from "@/src/lib/firebase/client";
import { Player, Room } from "@/src/types/room";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function FinalResult() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomId = searchParams.get("roomId");

  const [room, setRoom] = useState<Room | null>(null);
  const [ranking, setRanking] = useState<Player[]>([]);
  const [showRoundDialog, setShowRoundDialog] = useState(false);
  const [additionalRounds, setAdditionalRounds] = useState(1);
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    if (!roomId) {
      router.push("/");
      return;
    }

    const roomRef = doc(db, "rooms", roomId);
    const unsubscribe = onSnapshot(roomRef, (doc) => {
      if (doc.exists()) {
        const roomData = doc.data() as Room;
        setRoom(roomData);
        const sortedPlayers = Object.values(roomData.players).sort(
          (a, b) => b.score - a.score
        );
        setRanking(sortedPlayers);
      } else {
        router.push("/");
      }
    });

    return () => unsubscribe();
  }, [roomId, router]);

  if (!room || ranking.length === 0) {
    return <LoadingSpinner />;
  }

  const winner = ranking[0];

  const getRankEmoji = (index: number) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return (
      <>
        {index + 1}
        <ruby>
          位<rt>い</rt>
        </ruby>
        :
      </>
    );
  };

  const handleContinueGame = async () => {
    if (!roomId || !room) return;

    setIsStarting(true);

    try {
      const roomRef = doc(db, "rooms", roomId);
      const newTotalRounds = (room.totalRounds || 0) + additionalRounds;
      const newCurrentRound = (room.currentRound || 1) + 1;

      await updateDoc(roomRef, {
        totalRounds: newTotalRounds,
        currentRound: newCurrentRound,
        rounds: newTotalRounds, // rounds プロパティも更新
        status: "starting", // ステータスを描画中に更新
      });

      const functions = getFunctions();
      const generateGameTheme = httpsCallable(
        functions,
        "generateGameThemeFlow"
      );
      await generateGameTheme({ roomId });

      // ダイアログを閉じてテーマ選択画面に遷移
      setShowRoundDialog(false);
      router.push(`/input-prompt?roomId=${roomId}`);
    } catch (error) {
      console.error("Error updating room rounds:", error);
      alert("ラウンド数の更新に失敗しました。もう一度お試しください。");
    } finally {
      setIsStarting(false);
    }
  };

  if (isStarting) {
    return <LoadingSpinner />;
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 overflow-hidden">
      <div className="container mx-auto text-center">
        <div className="mb-8">
          <h1
            className="reveal-up-animation text-4xl md:text-5xl font-bold text-white"
            style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
          >
            <ruby>
              優勝<rt>ゆうしょう</rt>
            </ruby>
            は…
          </h1>

          <div
            className="pop-in-animation mt-8 inline-block bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-2xl border-2 border-white relative"
            style={{ animationDelay: "0.5s" }}
          >
            <div className="text-6xl absolute -top-8 left-1/2 -translate-x-1/2">
              👑
            </div>
            <p className="text-4xl md:text-5xl font-bold text-pink-500">
              {winner.name}さん！
            </p>
            <p className="text-2xl text-gray-700 mt-2">
              {winner.score}
              <ruby>
                点<rt>てん</rt>
              </ruby>
            </p>
          </div>
        </div>

        <div
          className="reveal-up-animation w-full max-w-md mx-auto bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg border-2 border-white"
          style={{ animationDelay: "1s" }}
        >
          <h2 className="text-2xl font-bold text-slate-800 mb-4 drop-shadow-lg">
            <ruby>
              最終<rt>さいしゅう</rt>
            </ruby>
            ランキング
          </h2>
          <div className="space-y-2 text-lg text-left">
            {ranking.map((player, index) => (
              <p
                key={index}
                className={`p-2 rounded-lg font-semibold ${
                  index === 0
                    ? "bg-yellow-200 text-yellow-900"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                {getRankEmoji(index)} {player.name} ({player.score}
                <ruby>
                  点<rt>てん</rt>
                </ruby>
                )
              </p>
            ))}
          </div>
        </div>

        <div
          className="reveal-up-animation mt-8 space-y-4 sm:space-y-0 sm:flex sm:gap-4 sm:justify-center"
          style={{ animationDelay: "1.2s" }}
        >
          <button
            onClick={() => setShowRoundDialog(true)}
            className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-xl text-lg shadow-lg transition-transform transform hover:scale-105"
          >
            もう
            <ruby>
              少<rt>すこ</rt>
            </ruby>
            し
            <ruby>
              遊<rt>あそ</rt>
            </ruby>
            ぶ
          </button>
          <Link href="/">
            <button className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-xl text-lg shadow-lg transition-transform transform hover:scale-105">
              <ruby>
                最初<rt>さいしょ</rt>
              </ruby>
              から
              <ruby>
                遊<rt>あそ</rt>
              </ruby>
              ぶ
            </button>
          </Link>
        </div>
      </div>

      {/* ラウンド追加ダイアログ */}
      {showRoundDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
              <ruby>
                追加<rt>ついか</rt>
              </ruby>
              ラウンド
              <ruby>
                数<rt>すう</rt>
              </ruby>
            </h3>

            <div className="flex items-center justify-center gap-4 mb-6">
              <button
                onClick={() =>
                  setAdditionalRounds(Math.max(1, additionalRounds - 1))
                }
                className="w-12 h-12 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-xl font-bold text-gray-700 transition-colors"
              >
                −
              </button>

              <div className="bg-gray-100 px-6 py-3 rounded-lg">
                <span className="text-2xl font-bold text-gray-800">
                  {additionalRounds}
                </span>
              </div>

              <button
                onClick={() => setAdditionalRounds(additionalRounds + 1)}
                className="w-12 h-12 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-xl font-bold text-gray-700 transition-colors"
              >
                ＋
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowRoundDialog(false)}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-xl transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={handleContinueGame}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-xl transition-colors"
              >
                <ruby>
                  追加<rt>ついか</rt>
                </ruby>
                する
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
