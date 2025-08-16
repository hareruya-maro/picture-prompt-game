"use client";

import { db } from "@/src/lib/firebase/client";
import { Room } from "@/src/types/room";
import { collection, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Result {
  id: string;
  imageUrl: string;
  prompt: string;
  authorName: string;
  votes: string[];
  round?: number;
}

export default function ResultPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomId = searchParams.get("roomId");

  const [room, setRoom] = useState<Room | null>(null);
  const [results, setResults] = useState<Result[]>([]);
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    if (!roomId) {
      router.push("/");
      return;
    }

    const roomRef = doc(db, "rooms", roomId);
    const unsubscribeRoom = onSnapshot(roomRef, (doc) => {
      if (doc.exists()) {
        const roomData = doc.data() as Room;
        setRoom(roomData);

        // Handle navigation based on room status
        if (roomData.status === "starting") {
          // Game is starting, show loading state but stay on this page
          return;
        } else if (roomData.status === "input-prompt") {
          router.push(`/input-prompt?roomId=${roomId}`);
        }
      }
    });

    return () => {
      unsubscribeRoom();
    };
  }, [roomId, router]);

  useEffect(() => {
    if (!roomId || !room) return;

    const resultsRef = collection(db, "rooms", roomId, "results");
    const unsubscribeResults = onSnapshot(resultsRef, (snapshot) => {
      const currentRound = room.currentRound || 1;
      const resultsData = snapshot.docs
        .filter((doc) => {
          const data = doc.data();
          return (data.round || 1) === currentRound;
        })
        .map((doc) => ({ id: doc.id, ...doc.data() } as Result));
      // Sort by votes
      resultsData.sort((a, b) => b.votes.length - a.votes.length);
      setResults(resultsData);
    });

    return () => {
      unsubscribeResults();
    };
  }, [roomId, room]);

  const handleNextRound = async () => {
    if (!roomId || !room) return;
    const nextRound = (room.currentRound || 0) + 1;
    const totalRounds = room.rounds || room.totalRounds || 1;

    if (nextRound > totalRounds) {
      await updateDoc(doc(db, "rooms", roomId), { status: "final-result" });
      router.push(`/final-result?roomId=${roomId}`);
    } else {
      setIsStarting(true);
      try {
        // Update room status to indicate next round is starting
        const roomRef = doc(db, "rooms", roomId);
        await updateDoc(roomRef, {
          status: "starting",
          currentRound: nextRound,
          theme: null, // Reset theme
        });

        const functions = getFunctions();
        const generateGameTheme = httpsCallable(
          functions,
          "generateGameThemeFlow"
        );
        await generateGameTheme({ roomId });
        // The onSnapshot listener will handle the redirect
      } catch (error) {
        console.error("Error starting next round:", error);
        alert("次のラウンドの開始に失敗しました。");
        setIsStarting(false);
      }
    }
  };

  if (!room || results.length === 0) {
    return <div>Loading...</div>;
  }

  const isFinalRound =
    room.currentRound === (room.rounds || room.totalRounds || 1);

  return (
    <main className="min-h-screen p-4">
      <div className="container mx-auto">
        <h1
          className="text-3xl md:text-4xl font-bold text-white text-center mb-4"
          style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
        >
          けっか発表！
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((result) => (
            <div
              key={result.id}
              className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-lg border-2 border-white text-center"
            >
              <img
                src={result.imageUrl}
                alt={`${result.authorName}の絵`}
                className="w-full h-auto rounded-lg mb-3"
              />
              <p className="font-bold text-lg text-gray-800">
                {result.authorName}
              </p>
              <p className="text-pink-500 font-bold text-xl">
                {result.votes.length}票
              </p>
              <p className="text-sm text-gray-600 mt-2 bg-gray-100 p-2 rounded-lg">
                {result.prompt}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={handleNextRound}
            disabled={isStarting}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-xl text-lg shadow-lg transition-transform transform hover:scale-105 disabled:bg-gray-400"
          >
            {isStarting
              ? "次のラウンドをはじめています..."
              : isFinalRound
              ? "最終結果へ"
              : "次のラウンドへ"}
          </button>
        </div>
      </div>
    </main>
  );
}
