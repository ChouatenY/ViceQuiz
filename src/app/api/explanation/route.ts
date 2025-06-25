import { NextResponse } from "next/server";
import { generateExplanation } from "@/lib/gemini";
import { z } from "zod";

export const runtime = "nodejs";
export const maxDuration = 60; // Maximum allowed on Vercel hobby plan

const explanationSchema = z.object({
  question: z.string(),
  correctAnswer: z.string(),
  userAnswer: z.string(),
  questionType: z.enum(["mcq", "open_ended"]),
});

export async function POST(req: Request) {
  try {
    console.log("Explanation API: Starting POST request");
    
    const body = await req.json();
    console.log("Explanation API: Request body", body);
    
    const { question, correctAnswer, userAnswer, questionType } = explanationSchema.parse(body);
    
    let prompt = "";
    
    if (questionType === "mcq") {
      prompt = `Question: ${question}
Correct Answer: ${correctAnswer}
User's Answer: ${userAnswer}

Please provide a clear and educational explanation of why "${correctAnswer}" is the correct answer and why "${userAnswer}" ${userAnswer === correctAnswer ? "is also correct" : "is incorrect"}. Keep the explanation concise but informative, suitable for learning.`;
    } else {
      prompt = `Question: ${question}
Correct Answer: ${correctAnswer}
User's Answer: ${userAnswer}

Please provide a clear and educational explanation comparing the user's answer with the correct answer. Highlight what the user got right (if anything) and what could be improved. Keep the explanation constructive and educational.`;
    }
    
    const explanation = await generateExplanation(prompt);
    
    console.log("Explanation API: Generated explanation");
    
    return NextResponse.json({
      explanation,
    });
  } catch (error) {
    console.error("Explanation API: Error in POST handler", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: error.issues,
        },
        {
          status: 400,
        }
      );
    }
    
    return NextResponse.json(
      {
        error: "An unexpected error occurred",
        details: error instanceof Error ? error.message : String(error),
      },
      {
        status: 500,
      }
    );
  }
}
