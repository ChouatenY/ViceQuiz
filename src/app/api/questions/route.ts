import { generateQuestions } from "@/lib/gemini";
import { getAuthSession } from "@/lib/nextauth";
import { getQuestionsSchema } from "@/schemas/questions";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export const runtime = "nodejs";
export const maxDuration = 500;

export async function POST(req: Request, res: Response) {
  try {
    const session = await getAuthSession();
    // if (!session?.user) {
    //   return NextResponse.json(
    //     { error: "You must be logged in to create a game." },
    //     {
    //       status: 401,
    //     }
    //   );
    // }
    const body = await req.json();
    const { amount, topic, type } = getQuestionsSchema.parse(body);
    let questions: any;
    if (type === "open_ended") {
      const prompt = `Generate a random hard open-ended question about ${topic}. The answer should not be more than 15 words.`;
      questions = await generateQuestions(
        prompt,
        {
          question: "question",
          answer: "answer with max length of 15 words",
        },
        amount
      );
    } else if (type === "mcq") {
      const prompt = `Generate a random hard multiple-choice question about ${topic}. The answer and options should not be more than 15 words each. Make sure the answer is different from the options.`;
      questions = await generateQuestions(
        prompt,
        {
          question: "question",
          answer: "answer with max length of 15 words",
          option1: "option1 with max length of 15 words",
          option2: "option2 with max length of 15 words",
          option3: "option3 with max length of 15 words",
        },
        amount
      );
    }
    return NextResponse.json(
      {
        questions: questions,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.issues },
        {
          status: 400,
        }
      );
    } else {
      console.error("Gemini API error:", error);
      return NextResponse.json(
        {
          error: "An unexpected error occurred.",
          details: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined
        },
        {
          status: 500,
        }
      );
    }
  }
}
