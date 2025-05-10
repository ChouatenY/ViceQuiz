import React from "react";
import { getAuthSession } from "@/lib/nextauth";
import QuizCreation from "@/components/forms/QuizCreation";

export const metadata = {
  title: "Quiz | Quizzzy",
  description: "Quiz yourself on anything!",
};

interface Props {
  searchParams: {
    topic?: string;
  };
}

const Quiz = async ({ searchParams }: Props) => {
  // Get the local user session
  const session = await getAuthSession();
  return <QuizCreation topic={searchParams.topic ?? ""} />;
};

export default Quiz;
