"use client";

import { useAuth } from "@/src/hooks/useAuth";
import { db } from "@/src/lib/firebase/client";
import { Room } from "@/src/types/room";
import { collection, doc, onSnapshot, setDoc } from "firebase/firestore";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function InputPrompt() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomId = searchParams.get("roomId");

  const [room, setRoom] = useState<Room | null>(null);
  const [prompt, setPrompt] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<
    Record<string, boolean>
  >({});
  const [currentRound, setCurrentRound] = useState<number | null>(null);

  useEffect(() => {
    if (!roomId) {
      router.push("/");
      return;
    }

    const roomRef = doc(db, "rooms", roomId);
    const unsubscribeRoom = onSnapshot(roomRef, (doc) => {
      if (doc.exists()) {
        const roomData = doc.data() as Room;

        // 新しいラウンドが始まった場合、状態をリセット
        if (currentRound !== null && roomData.currentRound !== currentRound) {
          setPrompt("");
          setIsSubmitted(false);
          setSubmissionStatus({});
        }

        setRoom(roomData);
        setCurrentRound(roomData.currentRound || null);

        if (roomData.status === "drawing") {
          // statusが'drawing'になったら自動的に次の段階へ
          // drawing状態の表示は後で処理
        } else if (roomData.status === "voting") {
          router.push(`/vote?roomId=${roomId}`);
        }
      } else {
        alert("Room not found");
        router.push("/");
      }
    });

    return () => {
      unsubscribeRoom();
    };
  }, [roomId, router, currentRound]);

  // プロンプトの監視を別のuseEffectで行う
  useEffect(() => {
    if (!roomId || !room || !user) return;

    const promptsRef = collection(db, "rooms", roomId, "prompts");
    const unsubscribePrompts = onSnapshot(promptsRef, (snapshot) => {
      const status: Record<string, boolean> = {};
      const currentRound = room.currentRound || 1;

      snapshot.forEach((doc) => {
        const data = doc.data();
        // 現在のラウンドのプロンプトのみを対象にする（1回目は後方互換性のためroundフィールドなしも許可）
        if (
          data.round === currentRound ||
          (!data.round && currentRound === 1)
        ) {
          const userId = data.userId || doc.id; // userId field or fallback to doc.id
          status[userId] = true;

          // 自分がsubmitしたかどうかチェック（新しいID形式に対応）
          if (
            data.userId === user.uid ||
            doc.id === `${user.uid}_round_${currentRound}` ||
            (doc.id === user.uid && currentRound === 1)
          ) {
            setIsSubmitted(true);
          }
        }
      });
      setSubmissionStatus(status);
    });

    return () => {
      unsubscribePrompts();
    };
  }, [roomId, room, user]);

  // ラウンドが変わった時に状態をリセット
  useEffect(() => {
    if (room && currentRound !== null && room.currentRound !== currentRound) {
      setPrompt("");
      setIsSubmitted(false);
      setSubmissionStatus({});
      setCurrentRound(room.currentRound || null);
    }
  }, [room?.currentRound, currentRound]);

  const handleSubmitPrompt = async () => {
    if (!prompt.trim() || !user || !roomId || isSubmitted || !room) return;

    try {
      // Use round-specific document ID to avoid overwriting
      const currentRound = room.currentRound || 1;
      const promptId = `${user.uid}_round_${currentRound}`;
      const promptRef = doc(db, "rooms", roomId, "prompts", promptId);
      await setDoc(promptRef, {
        prompt: prompt.trim(),
        authorName: room?.players[user.uid]?.name || "Unknown",
        submittedAt: new Date(),
        round: currentRound,
        userId: user.uid, // Add userId field for identification
      });
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting prompt:", error);
      alert("プロンプトの送信に失敗しました。もう一度お試しください。");
    }
  };

  if (!room) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto"></div>
          <p className="text-white text-xl mt-4">読み込み中...</p>
        </div>
      </main>
    );
  }

  // お絵かきタイム（drawing状態）の表示
  if (room.status === "drawing") {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-2xl mx-auto text-center bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border-2 border-white">
          <div className="mb-6">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-500 border-t-transparent mx-auto mb-4"></div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              🎨 みんなの絵をかいてるよ...！
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              AIがそれぞれのプロンプトから素敵な絵を生成しています。
              <br />
              少しだけお待ちください...
            </p>
          </div>

          {/* 提出状況の表示 */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              プロンプト提出状況
            </h3>
            <div className="space-y-2">
              {Object.entries(room.players).map(([playerId, player]) => (
                <div
                  key={playerId}
                  className="flex items-center justify-between"
                >
                  <span className="text-gray-700">{player.name}</span>
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      submissionStatus[playerId]
                        ? "bg-green-200 text-green-800"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {submissionStatus[playerId] ? "✓ 提出済み" : "待機中..."}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  const totalPlayers = Object.keys(room.players).length;
  const submittedCount = Object.keys(submissionStatus).length;

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        {/* お題表示エリア */}
        <div className="text-center mb-8">
          <h1
            className="text-3xl md:text-4xl font-bold text-white mb-4"
            style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
          >
            🎯 今回のお題
          </h1>

          {/* お手本の絵の表示 */}
          {room.sampleImageUrl && (
            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl shadow-2xl border-2 border-white mb-6 mx-auto max-w-2xl">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                お手本の絵
              </h2>
              <div className="relative">
                <img
                  src={room.sampleImageUrl}
                  alt="お手本の絵"
                  className="w-full max-w-md mx-auto rounded-xl shadow-lg"
                  style={{ maxHeight: "400px", objectFit: "contain" }}
                />
              </div>
            </div>
          )}
        </div>

        {/* プロンプト入力エリア */}
        <div className="bg-white/90 backdrop-blur-sm p-6 sm:p-8 rounded-3xl shadow-2xl border-2 border-white max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 text-center">
            ✏️ あなたのプロンプトを入力してね！
          </h2>

          <p className="text-gray-600 mb-6 text-center">
            上のお手本の絵と同じような絵を描いてもらうために、
            <br />
            AIにどんな指示を出しますか？
          </p>

          {!isSubmitted ? (
            <div className="space-y-4">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="例: 青い空の下で、笑顔の女の子が赤い花を持っている絵"
                className="w-full h-32 p-4 border-2 border-gray-300 rounded-xl text-lg resize-none focus:border-pink-500 focus:outline-none text-gray-800 placeholder-gray-400"
                maxLength={500}
              />

              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>{prompt.length}/500文字</span>
              </div>

              <button
                onClick={handleSubmitPrompt}
                disabled={!prompt.trim()}
                className={`w-full py-4 px-6 rounded-xl text-xl font-bold transition-all transform ${
                  prompt.trim()
                    ? "bg-pink-500 hover:bg-pink-600 text-white shadow-lg hover:scale-105"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                プロンプトを送信！
              </button>
            </div>
          ) : (
            <div className="text-center">
              <div className="bg-green-100 border-2 border-green-500 rounded-xl p-6">
                <h3 className="text-xl font-bold text-green-800 mb-2">
                  ✅ プロンプトを送信しました！
                </h3>
                <p className="text-green-700">
                  他のプレイヤーの入力を待っています...
                </p>
              </div>
            </div>
          )}

          {/* 提出状況 */}
          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-700 mb-3 text-center">
              提出状況 ({submittedCount}/{totalPlayers})
            </h3>
            <div className="space-y-2">
              {Object.entries(room.players).map(([playerId, player]) => (
                <div
                  key={playerId}
                  className="flex items-center justify-between"
                >
                  <span className="text-gray-700">{player.name}</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      submissionStatus[playerId]
                        ? "bg-green-200 text-green-800"
                        : "bg-yellow-200 text-yellow-800"
                    }`}
                  >
                    {submissionStatus[playerId] ? "✓ 完了" : "⏳ 入力中"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
