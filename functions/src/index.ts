import { googleAI } from "@genkit-ai/googleai";
import vertexAI from "@genkit-ai/vertexai";
import * as admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { onCallGenkit } from "firebase-functions/https";
import { defineSecret } from "firebase-functions/params";
import {
  onDocumentCreated,
  onDocumentUpdated,
} from "firebase-functions/v2/firestore";
import { genkit } from "genkit";
import { z } from "zod";

admin.initializeApp();

const googleAIapiKey = defineSecret("GEMINI_API_KEY");

const ai = genkit({
  plugins: [googleAI(), vertexAI({ location: "us-central1" })],
});

const db = getFirestore();
const storage = getStorage().bucket();

// Generate theme and sample image when game starts
const _generateGameThemeFlow = ai.defineFlow(
  {
    name: "generateGameThemeFlow",
    inputSchema: z.object({ roomId: z.string() }),
    outputSchema: z.object({ success: z.boolean(), themePrompt: z.string() }),
  },
  async ({ roomId }) => {
    // Generate random keywords for the theme
    const keywords = [
      "人",
      "犬",
      "猫",
      "車",
      "家",
      "木",
      "花",
      "山",
      "海",
      "空",
      "笑顔",
      "悲しい",
      "怒っている",
      "驚いた",
      "眠い",
      "走る",
      "飛ぶ",
      "泳ぐ",
      "歌う",
      "踊る",
      "赤い",
      "青い",
      "大きい",
      "小さい",
      "美しい",
    ];

    const selectedKeywords = [];
    for (let i = 0; i < 3; i++) {
      const randomIndex = Math.floor(Math.random() * keywords.length);
      selectedKeywords.push(keywords[randomIndex]);
    }

    const themePrompt = `${selectedKeywords.join("、")}を含む絵`;

    // Generate sample image
    const imageResponse = await ai.generate({
      prompt: themePrompt,
      model: vertexAI.model("imagen-4.0-fast-generate-001"),
      config: {
        height: 512,
        width: 512,
      },
    });

    const generatedImage = imageResponse.media;
    if (!generatedImage) {
      throw new Error("Failed to generate theme image");
    }

    // Save theme image to Storage
    const imagePath = `themes/${roomId}/sample_${Date.now()}.png`;
    const file = storage.file(imagePath);

    const response = await fetch(generatedImage.url);
    const imageBuffer = await response.arrayBuffer();

    await file.save(Buffer.from(imageBuffer), {
      contentType: generatedImage.contentType || "image/png",
    });

    // Get image URL based on environment (emulator vs production)
    let imageUrl: string;
    if (process.env.FUNCTIONS_EMULATOR === "true") {
      // For Firebase Storage Emulator
      imageUrl = `http://localhost:9199/v0/b/${
        storage.name
      }/o/${encodeURIComponent(imagePath)}?alt=media`;
    } else {
      // For production
      const [signedUrl] = await file.getSignedUrl({
        action: "read",
        expires: "03-09-2491",
      });
      imageUrl = signedUrl;
    }

    // Save theme info to Firestore
    await db.collection("rooms").doc(roomId).update({
      themePrompt: themePrompt,
      sampleImageUrl: imageUrl,
      status: "input-prompt",
    });

    return { success: true, themePrompt };
  }
);

export const generateGameThemeFlow = onCallGenkit(
  {
    secrets: [googleAIapiKey],
    cors: true,
  },
  _generateGameThemeFlow
);

const _generateThemeFlow = ai.defineFlow(
  {
    name: "generateThemeFlow",
    inputSchema: z.object({ subject: z.string().default("fantasy") }),
    outputSchema: z.object({ theme: z.string() }),
  },
  async ({ subject }) => {
    const prompt = `Generate a creative and unique theme for a picture prompt game based on the following subject: ${subject}. The theme should be a single word or a short phrase.`;
    const { text } = await ai.generate({
      prompt: prompt,
      model: "googleai/gemini-2.0-flash-exp",
      config: {
        temperature: 0.7,
      },
    });
    return { theme: text };
  }
);

export const generateThemeFlow = onCallGenkit(
  {
    secrets: [googleAIapiKey],
    cors: true,
  },
  _generateThemeFlow
);

export const onPromptSubmitted = onDocumentCreated(
  "rooms/{roomId}/prompts/{userId}",
  async (event) => {
    const { roomId } = event.params;
    const roomRef = db.collection("rooms").doc(roomId);
    const roomSnap = await roomRef.get();

    if (!roomSnap.exists) return;

    const roomData = roomSnap.data()!;
    const playerCount = Object.keys(roomData.players).length;
    const currentRound = roomData.currentRound || 1;

    console.log(
      `[onPromptSubmitted] Room ${roomId}, Round ${currentRound}, Players: ${playerCount}`
    );

    // Check if all players have submitted their prompts for the current round
    // For the first round, prompts might not have a round field, so we check both conditions
    const promptsSnap = await db
      .collection("rooms")
      .doc(roomId)
      .collection("prompts")
      .get();

    console.log(
      `[onPromptSubmitted] Total prompts in collection: ${promptsSnap.size}`
    );

    const currentRoundPrompts = promptsSnap.docs.filter((doc) => {
      const data = doc.data();
      // For round 1, also include prompts without round field (backward compatibility)
      const isCurrentRound =
        data.round === currentRound || (!data.round && currentRound === 1);
      console.log(
        `[onPromptSubmitted] Prompt ${doc.id}: round=${data.round}, isCurrentRound=${isCurrentRound}`
      );
      return isCurrentRound;
    });

    console.log(
      `[onPromptSubmitted] Current round prompts: ${currentRoundPrompts.length}/${playerCount}`
    );

    if (currentRoundPrompts.length >= playerCount) {
      // All prompts are submitted, start drawing phase
      console.log(
        `[onPromptSubmitted] All prompts submitted for round ${currentRound}, updating status to 'drawing'`
      );
      await roomRef.update({ status: "drawing" });
    }
  }
);

export const onGameStart = onDocumentUpdated(
  "rooms/{roomId}",
  async (event) => {
    const before = event.data?.before.data();
    const after = event.data?.after.data();

    if (!before || !after) return;

    // Trigger when status changes to 'waiting-theme' (game start or next round)
    if (before.status === "waiting-theme" || after.status !== "waiting-theme") {
      return;
    }

    const { roomId } = event.params;

    // Auto-generate theme and sample image
    await _generateGameThemeFlow.run({ roomId });
  }
);

export const onStartDrawing = onDocumentUpdated(
  "rooms/{roomId}",
  async (event) => {
    const before = event.data?.before.data();
    const after = event.data?.after.data();

    if (!before || !after) return;

    // Trigger only when status changes to 'drawing'
    if (before.status === "drawing" || after.status !== "drawing") {
      return;
    }

    const { roomId } = event.params;
    const currentRound = after.currentRound || 1;

    const promptsSnap = await db
      .collection("rooms")
      .doc(roomId)
      .collection("prompts")
      .get();

    // Filter prompts for the current round (backward compatibility for round 1)
    const currentRoundPrompts = promptsSnap.docs.filter((doc) => {
      const data = doc.data();
      return data.round === currentRound || (!data.round && currentRound === 1);
    });

    const drawingPromises = currentRoundPrompts.map(async (promptDoc) => {
      const promptData = promptDoc.data();
      const userId = promptData.userId || promptDoc.id; // Use userId field or fallback to doc.id

      console.log(
        `Generating image for user ${userId} with prompt:`,
        promptData.prompt
      );

      const imageResponse = await ai.generate({
        prompt: promptData.prompt,
        model: vertexAI.model("imagen-4.0-fast-generate-001"),
        config: {
          height: 512,
          width: 512,
        },
      });
      const generatedImage = imageResponse.media;

      if (!generatedImage) {
        throw new Error("Failed to generate image");
      }

      const imagePath = `results/${roomId}/${userId}_${Date.now()}.png`;
      const file = storage.file(imagePath);

      // Download the image from the URL and save to Firebase Storage
      const response = await fetch(generatedImage.url);
      const imageBuffer = await response.arrayBuffer();

      await file.save(Buffer.from(imageBuffer), {
        contentType: generatedImage.contentType || "image/png",
      });

      // Get image URL based on environment (emulator vs production)
      let imageUrl: string;
      if (process.env.FUNCTIONS_EMULATOR === "true") {
        // For Firebase Storage Emulator
        imageUrl = `http://localhost:9199/v0/b/${
          storage.name
        }/o/${encodeURIComponent(imagePath)}?alt=media`;
      } else {
        // For production
        const [signedUrl] = await file.getSignedUrl({
          action: "read",
          expires: "03-09-2491",
        });
        imageUrl = signedUrl;
      }

      // Save the result in a new subcollection
      // Use round-specific document ID to avoid overwriting
      const resultId = `${userId}_round_${currentRound}`;
      console.log(
        `[onStartDrawing] Saving result for user ${userId}, round ${currentRound}, resultId: ${resultId}`
      );

      await db
        .collection("rooms")
        .doc(roomId)
        .collection("results")
        .doc(resultId)
        .set({
          imageUrl: imageUrl,
          prompt: promptData.prompt,
          authorName: promptData.authorName,
          round: currentRound,
          userId: userId, // Keep userId for identification
          votes: [],
        });

      console.log(`[onStartDrawing] Result saved successfully for ${resultId}`);
    });

    await Promise.all(drawingPromises);

    // Update room status to 'voting'
    await db.collection("rooms").doc(roomId).update({ status: "voting" });
  }
);

export const onVote = onDocumentUpdated(
  "rooms/{roomId}/results/{userId}",
  async (event) => {
    const { roomId } = event.params;
    const roomRef = db.collection("rooms").doc(roomId);
    const roomSnap = await roomRef.get();

    if (!roomSnap.exists) return;

    const roomData = roomSnap.data()!;
    const playerCount = Object.keys(roomData.players).length;
    const currentRound = roomData.currentRound || 1;

    const resultsSnap = await db
      .collection("rooms")
      .doc(roomId)
      .collection("results")
      .get();

    // Filter results for the current round (backward compatibility for round 1)
    const currentRoundResults = resultsSnap.docs.filter((doc) => {
      const data = doc.data();
      return data.round === currentRound || (!data.round && currentRound === 1);
    });

    const totalVotes = currentRoundResults.reduce(
      (acc, doc) => acc + doc.data().votes.length,
      0
    );

    if (totalVotes >= playerCount) {
      // Calculate scores for this round
      const newScores = { ...roomData.players };
      currentRoundResults.forEach((doc) => {
        const resultData = doc.data();
        const authorId = doc.id;
        if (newScores[authorId]) {
          newScores[authorId].score += resultData.votes.length;
        }
      });

      const currentRound = roomData.currentRound || 1;
      const totalRounds = roomData.totalRounds || 1;

      if (currentRound < totalRounds) {
        // More rounds to go, update to result status first
        await roomRef.update({
          status: "result",
          players: newScores,
          currentRound: currentRound,
        });
      } else {
        // Final round, go to final result
        await roomRef.update({
          status: "final-result",
          players: newScores,
          currentRound: currentRound,
        });
      }
    }
  }
);

// Function to start next round
const _nextRoundFlow = ai.defineFlow(
  {
    name: "nextRoundFlow",
    inputSchema: z.object({ roomId: z.string() }),
    outputSchema: z.object({ success: z.boolean() }),
  },
  async ({ roomId }) => {
    const roomRef = db.collection("rooms").doc(roomId);
    const roomSnap = await roomRef.get();

    if (!roomSnap.exists) {
      throw new Error("Room not found");
    }

    const roomData = roomSnap.data()!;
    const currentRound = roomData.currentRound || 1;
    const nextRound = currentRound + 1;

    // Clear previous round data
    const promptsSnap = await db
      .collection("rooms")
      .doc(roomId)
      .collection("prompts")
      .get();
    const resultsSnap = await db
      .collection("rooms")
      .doc(roomId)
      .collection("results")
      .get();

    const batch = db.batch();
    promptsSnap.docs.forEach((doc) => batch.delete(doc.ref));
    resultsSnap.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();

    // Update room for next round
    await roomRef.update({
      currentRound: nextRound,
      status: "waiting-theme",
    });

    return { success: true };
  }
);

export const nextRoundFlow = onCallGenkit(
  {
    secrets: [googleAIapiKey],
    cors: true,
  },
  _nextRoundFlow
);
