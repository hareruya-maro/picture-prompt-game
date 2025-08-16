"use client";

import { useAuth } from "@/src/hooks/useAuth";
import { db } from "@/src/lib/firebase/client";
import { Room } from "@/src/types/room";
import {
  arrayUnion,
  collection,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Result {
  id: string;
  imageUrl: string;
  prompt: string;
  authorName: string;
  votes: string[];
}

export default function Vote() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomId = searchParams.get("roomId");

  const [room, setRoom] = useState<Room | null>(null);
  const [results, setResults] = useState<Result[]>([]);
  const [voted, setVoted] = useState(false);

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
        if (roomData.status === "result") {
          router.push(`/result?roomId=${roomId}`);
        }
      }
    });

    const resultsRef = collection(db, "rooms", roomId, "results");
    const unsubscribeResults = onSnapshot(resultsRef, (snapshot) => {
      const resultsData = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Result)
      );
      setResults(resultsData);
      // Check if current user has already voted
      if (user && resultsData.some((r) => r.votes.includes(user.uid))) {
        setVoted(true);
      }
    });

    return () => {
      unsubscribeRoom();
      unsubscribeResults();
    };
  }, [roomId, router, user]);

  const handleVote = async (resultId: string) => {
    if (!user || !roomId || voted) return;
    const resultRef = doc(db, "rooms", roomId, "results", resultId);
    await updateDoc(resultRef, { votes: arrayUnion(user.uid) });
  };

  if (!room) {
    return <div>Loading...</div>;
  }

  return (
    <main className="min-h-screen p-4">
      <div className="container mx-auto">
        <h1
          className="text-3xl md:text-4xl font-bold text-white text-center mb-4"
          style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
        >
          {voted
            ? "みんなのとうひょうをまってるよ！"
            : "いちばんにてるのはどれ？"}
        </h1>

        <div className="mb-6 sticky top-4 z-10">
          <div className="max-w-xs mx-auto bg-white/80 backdrop-blur-sm p-2 rounded-2xl shadow-lg border-2 border-white">
            <p className="text-center text-sm text-gray-600 mb-1">
              おてほんの絵
            </p>
            <img
              src={room.sampleImageUrl}
              alt="お手本の絵"
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {results.map((result) => (
            <div
              key={result.id}
              className="bg-white/80 backdrop-blur-sm p-3 rounded-2xl shadow-lg border-2 border-white text-center transition-transform transform hover:scale-105"
            >
              <img
                src={result.imageUrl}
                alt={`プレイヤーの絵`}
                className="w-full h-auto rounded-lg mb-3"
              />
              {room.voteMode === "named" && (
                <p className="font-bold mb-2">{result.authorName}</p>
              )}
              <button
                onClick={() => handleVote(result.id)}
                disabled={voted}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-lg text-lg shadow-md transition disabled:bg-gray-400"
              >
                {voted ? `(${result.votes.length})` : "とうひょう！"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
