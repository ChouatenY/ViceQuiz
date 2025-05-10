"use client";

import { buttonVariants } from "@/components/ui/button";
import { LucideLayoutDashboard } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import ResultsCard from "@/components/statistics/ResultsCard";
import AccuracyCard from "@/components/statistics/AccuracyCard";
import TimeTakenCard from "@/components/statistics/TimeTakenCard";
import QuestionsList from "@/components/statistics/QuestionsList";

type Props = {
  params: {
    gameId: string;
  };
};

const Statistics = ({ params: { gameId } }: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [game, setGame] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [accuracy, setAccuracy] = useState(0);

  useEffect(() => {
    try {
      // Get the game data from the URL
      const gameDataParam = searchParams.get('data');
      
      if (!gameDataParam) {
        router.push('/dashboard');
        return;
      }
      
      // Decode the game data
      const gameData = JSON.parse(decodeURIComponent(gameDataParam));
      
      // Validate the game data
      if (!gameData || !gameData.id || gameData.id !== gameId) {
        router.push('/dashboard');
        return;
      }
      
      // Set the game data
      setGame(gameData);
      
      // Calculate accuracy
      let accuracyValue = 0;
      
      if (gameData.gameType === "mcq") {
        let totalCorrect = gameData.questions.reduce((acc: number, question: any) => {
          if (question.isCorrect) {
            return acc + 1;
          }
          return acc;
        }, 0);
        accuracyValue = (totalCorrect / gameData.questions.length) * 100;
      } else if (gameData.gameType === "open_ended") {
        let totalPercentage = gameData.questions.reduce((acc: number, question: any) => {
          return acc + (question.percentageCorrect ?? 0);
        }, 0);
        accuracyValue = totalPercentage / gameData.questions.length;
      }
      
      accuracyValue = Math.round(accuracyValue * 100) / 100;
      setAccuracy(accuracyValue);
      setLoading(false);
    } catch (error) {
      console.error("Error parsing game data:", error);
      router.push('/dashboard');
    }
  }, [gameId, searchParams, router]);

  if (loading) {
    return (
      <div className="p-8 mx-auto max-w-7xl">
        <div className="flex items-center justify-center h-screen">
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-2xl font-bold">Loading statistics...</h1>
            <div className="w-10 h-10 border-t-2 border-b-2 border-gray-900 rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-8 mx-auto max-w-7xl">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Summary</h2>
          <div className="flex items-center space-x-2">
            <Link href="/dashboard" className={buttonVariants()}>
              <LucideLayoutDashboard className="mr-2" />
              Back to Dashboard
            </Link>
          </div>
        </div>

        <div className="grid gap-4 mt-4 md:grid-cols-7">
          <ResultsCard accuracy={accuracy} />
          <AccuracyCard accuracy={accuracy} />
          <TimeTakenCard
            timeEnded={new Date()}
            timeStarted={new Date(game.timeStarted)}
          />
        </div>
        <QuestionsList questions={game.questions} />
      </div>
    </>
  );
};

export default Statistics;
