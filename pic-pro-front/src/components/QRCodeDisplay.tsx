"use client";

import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";

interface QRCodeDisplayProps {
  url: string;
  roomId: string;
}

export default function QRCodeDisplay({ url, roomId }: QRCodeDisplayProps) {
  const [showQR, setShowQR] = useState(false);

  const copyUrl = () => {
    navigator.clipboard.writeText(url);
    alert("URLをコピーしました！");
  };

  return (
    <div className="mb-6 text-center">
      <p className="text-gray-600 text-sm mb-2">みんなでゲームに参加しよう！</p>

      <div className="space-y-3">
        <button
          onClick={() => setShowQR(!showQR)}
          className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-4 rounded-xl text-sm transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300"
        >
          {showQR ? "QRコードをかくす" : "QRコードをみせる"}
        </button>

        {showQR && (
          <div className="bg-white rounded-lg p-4 mx-auto inline-block shadow-lg border-2 border-purple-200">
            <QRCodeSVG
              value={url}
              size={200}
              level="M"
              includeMargin={true}
              bgColor="#ffffff"
              fgColor="#000000"
            />
            <p className="text-xs text-gray-600 mt-2">
              このQRコードをスキャンしてね！
            </p>
          </div>
        )}

        <div className="bg-gray-100 rounded-lg p-3">
          <p className="text-xs text-gray-600 mb-1">参加用URL</p>
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-800 break-all flex-1">{url}</p>
            <button
              onClick={copyUrl}
              className="p-2 rounded-lg bg-white hover:bg-gray-50 transition shrink-0"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-4 h-4 text-gray-600"
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
      </div>
    </div>
  );
}
