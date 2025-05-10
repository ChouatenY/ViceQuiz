import { endGameSchema } from "@/schemas/game";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { getGame } from "@/lib/gameStore";

export const runtime = "nodejs";
export const maxDuration = 60; // Maximum allowed on Vercel hobby plan

export async function POST(req: Request, res: Response) {
  try {
    console.log("EndGame API: Starting POST request");

    const body = await req.json();
    console.log("EndGame API: Request body", body);

    const { gameId } = endGameSchema.parse(body);
    console.log("EndGame API: Parsed schema", { gameId });

    // Check if the game exists
    const game = getGame(gameId);
    if (!game) {
      console.log("EndGame API: Game not found", { gameId });
      return NextResponse.json(
        {
          message: "Game not found",
        },
        {
          status: 404,
        }
      );
    }

    // In a real app, we would update the game in the database
    // But for now, we'll just return success
    console.log("EndGame API: Game ended", { gameId });

    return NextResponse.json({
      success: true,
      message: "Game ended",
    });
  } catch (error) {
    console.error("EndGame API: Error in POST handler", error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          message: error.issues,
        },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json(
      {
        message: "An unexpected error occurred",
        details: error instanceof Error ? error.message : String(error),
      },
      {
        status: 500,
      }
    );
  }
}
