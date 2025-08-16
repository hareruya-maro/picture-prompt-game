"use client";

import { useAuth } from "@/src/hooks/useAuth";
import { db } from "@/src/lib/firebase/client";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AccessRoom() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [guestName, setGuestName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  const handleJoinRoom = async () => {
    if (!guestName.trim() || !roomId.trim() || !user) {
      alert("なまえとルームIDをいれてください");
      return;
    }
    setIsJoining(true);

    const roomRef = doc(db, "rooms", roomId);
    try {
      const roomSnap = await getDoc(roomRef);
      if (!roomSnap.exists()) {
        alert("ルームが見つかりません。ルームIDをかくにんしてください。");
        setIsJoining(false);
        return;
      }

      await updateDoc(roomRef, {
        [`players.${user.uid}`]: {
          name: guestName,
          score: 0,
        },
      });

      router.push(`/waiting-room/${roomId}`);
    } catch (error) {
      console.error("Error joining room: ", error);
      alert("ルームへの参加に失敗しました。もう一度お試しください。");
      setIsJoining(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto text-center bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-3xl shadow-2xl border-2 border-white">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
          ルームにはいる
        </h1>

        <div className="space-y-6 text-left">
          <div>
            <label
              htmlFor="guest-name"
              className="block text-gray-700 font-bold mb-2"
            >
              あなたのなまえ
            </label>
            <input
              type="text"
              id="guest-name"
              placeholder="なまえをいれてね"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition"
            />
          </div>

          <div>
            <label
              htmlFor="room-id"
              className="block text-gray-700 font-bold mb-2"
            >
              ルームID
            </label>
            <input
              type="text"
              id="room-id"
              placeholder="ホストにおしえてもらってね"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value.trim())}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition"
            />
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <button
            onClick={handleJoinRoom}
            disabled={isJoining || loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-xl text-lg shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading
              ? "準備中..."
              : isJoining
              ? "はいっています..."
              : "このルームにはいる！"}
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
