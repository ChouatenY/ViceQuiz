import { NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';
import { quizCreationSchema } from "@/schemas/forms/quiz";
import { z } from "zod";
import { addGame, getGame, Game, Question } from "@/lib/gameStore";

export const runtime = "nodejs";
export const maxDuration = 60; // Maximum allowed on Vercel hobby plan

// Fallback questions for MCQ
const mcqFallbackQuestions = [
  {
    question: "What is the capital of France?",
    answer: "Paris",
    option1: "London",
    option2: "Berlin",
    option3: "Madrid"
  },
  {
    question: "Which planet is known as the Red Planet?",
    answer: "Mars",
    option1: "Venus",
    option2: "Jupiter",
    option3: "Saturn"
  },
  {
    question: "Who wrote 'Romeo and Juliet'?",
    answer: "William Shakespeare",
    option1: "Charles Dickens",
    option2: "Jane Austen",
    option3: "Mark Twain"
  },
  {
    question: "What is the largest ocean on Earth?",
    answer: "Pacific Ocean",
    option1: "Atlantic Ocean",
    option2: "Indian Ocean",
    option3: "Arctic Ocean"
  },
  {
    question: "What is the chemical symbol for gold?",
    answer: "Au",
    option1: "Ag",
    option2: "Fe",
    option3: "Cu"
  }
];

// Fallback questions for open-ended
const openEndedFallbackQuestions = [
  {
    question: "What causes the seasons on Earth?",
    answer: "Earth's axial tilt relative to its orbit around the sun."
  },
  {
    question: "Explain how photosynthesis works.",
    answer: "Plants convert sunlight, water, and carbon dioxide into glucose and oxygen."
  },
  {
    question: "What is the significance of the Magna Carta?",
    answer: "It limited the king's power and established that everyone must follow the law."
  },
  {
    question: "How does a vaccine work?",
    answer: "It stimulates the immune system to recognize and fight specific pathogens."
  },
  {
    question: "What is the difference between weather and climate?",
    answer: "Weather is short-term conditions; climate is long-term patterns in an area."
  }
];

export async function POST(req: Request, res: Response) {
  try {
    console.log("Game API: Starting POST request");

    // Generate a unique ID for the game
    const gameId = uuidv4();
    console.log("Game API: Generated game ID", { gameId });

    // Parse the request body
    const body = await req.json();
    console.log("Game API: Request body", body);

    // Validate the request body
    const { topic, type, amount } = quizCreationSchema.parse(body);
    console.log("Game API: Parsed schema", { topic, type, amount });

    // Get questions based on the type
    const gameQuestions: Question[] = type === "mcq"
      ? mcqFallbackQuestions.slice(0, amount).map(q => ({
          id: uuidv4(),
          gameId,
          question: q.question,
          answer: q.answer,
          options: JSON.stringify([q.option1, q.option2, q.option3, q.answer].sort(() => Math.random() - 0.5)),
          questionType: "mcq"
        }))
      : openEndedFallbackQuestions.slice(0, amount).map(q => ({
          id: uuidv4(),
          gameId,
          question: q.question,
          answer: q.answer,
          questionType: "open_ended"
        }));

    // Create a game object
    const game: Game = {
      id: gameId,
      userId: "local-user",
      topic,
      gameType: type,
      timeStarted: new Date().toISOString(),
      questions: gameQuestions
    };

    // Add the game to the store
    addGame(game);

    console.log("Game API: Game created", { gameId });
    console.log("Game API: Questions created", { count: gameQuestions.length });

    // Return the game ID
    return NextResponse.json({ gameId }, { status: 200 });
  } catch (error) {
    console.error("Game API: Error in POST handler", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues },
        { status: 400 }
      );
    } else {
      console.error("Game creation error:", error);
      return NextResponse.json(
        {
          error: "An unexpected error occurred.",
          details: error instanceof Error ? error.message : String(error)
        },
        { status: 500 }
      );
    }
  }
}

export async function GET(req: Request, res: Response) {
  try {
    console.log("Game API: Starting GET request");

    // Get the game ID from the URL
    const url = new URL(req.url);
    const gameId = url.searchParams.get("gameId");
    console.log("Game API: Game ID from URL", { gameId });

    if (!gameId) {
      return NextResponse.json(
        { error: "You must provide a game id." },
        { status: 400 }
      );
    }

    // Get the game from the store
    const game = getGame(gameId);
    console.log("Game API: Retrieved game", { found: !!game });

    if (!game) {
      return NextResponse.json(
        { error: "Game not found." },
        { status: 404 }
      );
    }

    // Return the game
    return NextResponse.json(
      { game },
      { status: 200 }
    );
  } catch (error) {
    console.error("Game API: Error in GET handler", error);
    return NextResponse.json(
      {
        error: "An unexpected error occurred.",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
