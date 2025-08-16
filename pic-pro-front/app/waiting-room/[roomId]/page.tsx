"use client";

import { useAuth } from "@/src/hooks/useAuth";
import { db } from "@/src/lib/firebase/client";
import { Room } from "@/src/types/room";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function WaitingRoom() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const roomId = params.roomId as string;
  const [room, setRoom] = useState<Room | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    if (!roomId) return;
    const roomRef = doc(db, "rooms", roomId);
    const unsubscribe = onSnapshot(roomRef, (doc) => {
      if (doc.exists()) {
        const roomData = doc.data() as Room;
        setRoom(roomData);
        if (user) {
          setIsHost(user.uid === roomData.hostId);
        }
        if (roomData.status === "starting") {
          // Game is starting, show loading state but stay on this page
          return;
        } else if (roomData.status === "input-prompt") {
          router.push(`/input-prompt?roomId=${roomId}`);
        } else if (roomData.status === "drawing") {
          router.push(`/vote?roomId=${roomId}`);
        } else if (roomData.status === "voting") {
          router.push(`/vote?roomId=${roomId}`);
        } else if (roomData.status === "result") {
          router.push(`/result?roomId=${roomId}`);
        } else if (roomData.status === "final-result") {
          router.push(`/final-result?roomId=${roomId}`);
        }
      } else {
        alert("ルームが見つかりません");
        router.push("/");
      }
    });

    return () => unsubscribe();
  }, [roomId, user, router]);

  const handleStartGame = async () => {
    if (!isHost) return;
    setIsStarting(true);
    try {
      // First update room status to indicate game is starting
      const roomRef = doc(db, "rooms", roomId);
      await updateDoc(roomRef, {
        status: "starting",
        currentRound: 1,
        totalRounds: room?.rounds || 1,
      });

      const functions = getFunctions();
      const generateGameTheme = httpsCallable(
        functions,
        "generateGameThemeFlow"
      );
      await generateGameTheme({ roomId });
      // The onSnapshot listener will handle the redirect
    } catch (error) {
      console.error("Error starting game:", error);
      alert("ゲームの開始に失敗しました。");
      setIsStarting(false);
    }
  };

  const handleLeaveRoom = async () => {
    if (!user) return;
    const roomRef = doc(db, "rooms", roomId);
    const roomSnap = await getDoc(roomRef);
    if (roomSnap.exists()) {
      const roomData = roomSnap.data();
      const newPlayers = { ...roomData.players };
      delete newPlayers[user.uid];
      await updateDoc(roomRef, { players: newPlayers });
      router.push("/");
    }
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    alert("ルームIDをコピーしました！");
  };

  if (!room) {
    return <div>Loading...</div>;
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-3xl shadow-2xl border-2 border-white">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 text-center">
          みんながそろうまでまってね
        </h1>

        <div className="mb-6 text-center">
          <p className="text-gray-600 text-sm">ルームID</p>
          <div className="bg-gray-200 rounded-lg p-3 mt-1 flex items-center justify-center">
            <p className="text-2xl font-bold text-gray-800 tracking-widest">
              {roomId}
            </p>
            <button
              onClick={copyRoomId}
              className="ml-4 p-2 rounded-lg bg-white hover:bg-gray-100 transition"
            >
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
            いまいるメンバー ({Object.keys(room.players).length}人)
          </h2>
          <div className="bg-white/50 rounded-lg p-4 h-40 overflow-y-auto border-2 border-white">
            {Object.entries(room.players).map(([uid, player]) => (
              <p
                key={uid}
                className="py-1 px-2 rounded-md bg-white mb-2 shadow"
              >
                {player.name} {uid === room.hostId && "（ホスト）"}
              </p>
            ))}
          </div>
        </div>

        <div className="text-sm text-gray-600 space-y-1 mb-6 text-center">
          <p>
            とうひょうモード:{" "}
            <span className="font-bold text-pink-500">
              {room.voteMode === "anonymous" ? "だれのかな？" : "みんなの絵"}
            </span>
          </p>
          <p>
            なんかい勝負？:{" "}
            <span className="font-bold text-pink-500">{room.rounds}回</span>
          </p>
        </div>

        <div className="space-y-3">
          {isHost && (
            <button
              onClick={handleStartGame}
              disabled={isStarting}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-xl text-lg shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300 disabled:bg-gray-400"
            >
              {isStarting ? "ゲームをはじめています..." : "ゲームをはじめる！"}
            </button>
          )}
          <button
            onClick={handleLeaveRoom}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-6 rounded-xl text-sm mt-2 transition-transform transform hover:scale-105"
          >
            ルームからでる
          </button>
        </div>
      </div>
    </main>
  );
}
