"use client";

import { useAuth } from "@/src/hooks/useAuth";
import { db } from "@/src/lib/firebase/client";
import { doc, setDoc } from "firebase/firestore";
import { nanoid } from "nanoid";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateRoom() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [hostName, setHostName] = useState("");
  const [voteMode, setVoteMode] = useState("anonymous");
  const [rounds, setRounds] = useState(3);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateRoom = async () => {
    console.log("Creating room with:", {
      hostName,
      voteMode,
      rounds,
    });
    if (!hostName.trim() || !user) {
      alert("なまえをいれてください");
      return;
    }
    setIsCreating(true);

    const roomId = nanoid(6);
    try {
      await setDoc(doc(db, "rooms", roomId), {
        hostId: user.uid,
        hostName: hostName,
        voteMode: voteMode,
        rounds: rounds,
        status: "waiting",
        currentRound: 1,
        players: {
          [user.uid]: {
            name: hostName,
            score: 0,
          },
        },
        createdAt: new Date(),
      });
      router.push(`/waiting-room/${roomId}`);
    } catch (error) {
      console.error("Error creating room: ", error);
      alert("ルームの作成に失敗しました。もう一度お試しください。");
      setIsCreating(false);
    }
  };

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
              value={hostName}
              onChange={(e) => setHostName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-pink-500 focus:ring-pink-500 transition text-gray-800"
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
                  checked={voteMode === "anonymous"}
                  onChange={() => setVoteMode("anonymous")}
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
                  checked={voteMode === "named"}
                  onChange={() => setVoteMode("named")}
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
                onClick={() => setRounds(Math.max(1, rounds - 1))}
                className="text-2xl font-bold text-gray-600 w-12 h-12 rounded-lg hover:bg-gray-300 transition"
              >
                -
              </button>
              <span className="text-3xl font-bold text-gray-800 w-24 text-center">
                {rounds}
              </span>
              <button
                onClick={() => setRounds(rounds + 1)}
                className="text-2xl font-bold text-gray-600 w-12 h-12 rounded-lg hover:bg-gray-300 transition"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <button
            onClick={handleCreateRoom}
            disabled={isCreating || loading}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-xl text-lg shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading
              ? "準備中..."
              : isCreating
              ? "作成中..."
              : "この設定でルームをつくる！"}
          </button>
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
