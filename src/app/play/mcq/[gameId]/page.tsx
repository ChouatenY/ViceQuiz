"use client";

import MCQ from "@/components/MCQ";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

type Props = {
  params: {
    gameId: string;
  };
};

const MCQPage = ({ params: { gameId } }: Props) => {
  const searchParams = useSearchParams();
  const [game, setGame] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Get the game data from the URL
      const gameDataParam = searchParams.get('data');
      
      if (!gameDataParam) {
        setError("No game data found. Please create a new quiz.");
        setLoading(false);
        return;
      }
      
      // Decode the game data
      const gameData = JSON.parse(decodeURIComponent(gameDataParam));
      
      // Validate the game data
      if (!gameData || !gameData.id || gameData.id !== gameId || gameData.gameType !== 'mcq') {
        setError("Invalid game data. Please create a new quiz.");
        setLoading(false);
        return;
      }
      
      // Set the game data
      setGame(gameData);
      setLoading(false);
    } catch (error) {
      console.error("Error parsing game data:", error);
      setError("Error loading quiz. Please create a new quiz.");
      setLoading(false);
    }
  }, [gameId, searchParams]);

  if (loading) {
    return (
      <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-2xl font-bold">Loading quiz...</h1>
          <div className="w-10 h-10 border-t-2 border-b-2 border-gray-900 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-2xl font-bold">Error</h1>
          <p className="text-red-500">{error}</p>
          <a href="/quiz" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Create New Quiz
          </a>
        </div>
      </div>
    );
  }

  return <MCQ game={game} />;
};

export default MCQPage;
