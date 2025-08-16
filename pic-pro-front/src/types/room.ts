export interface Player {
  name: string;
  score: number;
}

export interface Room {
  players: Record<string, Player>;
  status: string;
  themePrompt?: string;
  sampleImageUrl?: string;
  currentRound?: number;
  totalRounds?: number;
  // waiting-roomページで使用されるプロパティ
  hostId?: string;
  hostName?: string;
  voteMode?: string;
  rounds?: number; // totalRoundsと同等
  // voteページで使用されるプロパティ
  theme?: {
    imageUrl: string;
  };
}
