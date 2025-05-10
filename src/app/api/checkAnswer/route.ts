import { checkAnswerSchema } from "@/schemas/questions";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import stringSimilarity from "string-similarity";

export const runtime = "nodejs";
export const maxDuration = 60; // Maximum allowed on Vercel hobby plan

// Simple in-memory storage for answers
const answers = new Map<string, { isCorrect?: boolean, percentageCorrect?: number }>();

export async function POST(req: Request, res: Response) {
  try {
    console.log("CheckAnswer API: Starting POST request");

    const body = await req.json();
    console.log("CheckAnswer API: Request body", body);

    const { questionId, userInput, correctAnswer, questionType } = body;
    console.log("CheckAnswer API: Parsed input", { questionId, userInput, questionType });

    // Check if we've already processed this question
    const existingAnswer = answers.get(questionId);
    if (existingAnswer) {
      console.log("CheckAnswer API: Using cached result", existingAnswer);

      if (existingAnswer.isCorrect !== undefined) {
        return NextResponse.json({
          isCorrect: existingAnswer.isCorrect,
        });
      } else if (existingAnswer.percentageCorrect !== undefined) {
        return NextResponse.json({
          percentageSimilar: existingAnswer.percentageCorrect,
        });
      }
    }

    // Process based on question type
    if (questionType === "mcq") {
      // For MCQ, compare the user input with the correct answer
      const isCorrect = userInput.toLowerCase().trim() === correctAnswer.toLowerCase().trim();

      // Store the result
      answers.set(questionId, { isCorrect });

      console.log("CheckAnswer API: MCQ result", { isCorrect });
      return NextResponse.json({
        isCorrect,
      });
    } else if (questionType === "open_ended") {
      // For open-ended, calculate the similarity
      let percentageSimilar = stringSimilarity.compareTwoStrings(
        correctAnswer.toLowerCase().trim(),
        userInput.toLowerCase().trim()
      );
      percentageSimilar = Math.round(percentageSimilar * 100);

      // Store the result
      answers.set(questionId, { percentageCorrect: percentageSimilar });

      console.log("CheckAnswer API: Open-ended result", { percentageSimilar });
      return NextResponse.json({
        percentageSimilar,
      });
    }

    // If we get here, something went wrong
    return NextResponse.json(
      {
        message: "Invalid question type",
      },
      {
        status: 400,
      }
    );
  } catch (error) {
    console.error("CheckAnswer API: Error in POST handler", error);

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
