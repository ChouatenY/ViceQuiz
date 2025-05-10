// This is a simple in-memory store for games
// In a real application, you would use a database

// Type definitions
export interface Question {
  id: string;
  gameId: string;
  question: string;
  answer: string;
  options?: string;
  questionType: 'mcq' | 'open_ended';
  userAnswer?: string;
  isCorrect?: boolean;
  percentageCorrect?: number;
}

export interface Game {
  id: string;
  userId: string;
  topic: string;
  gameType: 'mcq' | 'open_ended';
  timeStarted: string;
  questions: Question[];
}

// Global store for games
// This is a hack for development purposes only
// In a real application, you would use a database
const games: Record<string, Game> = {};

// Function to add a game to the store
export function addGame(game: Game): void {
  games[game.id] = game;
}

// Function to get a game from the store
export function getGame(gameId: string): Game | undefined {
  return games[gameId];
}

// Function to update a question in a game
export function updateQuestion(gameId: string, questionId: string, updates: Partial<Question>): boolean {
  const game = games[gameId];
  if (!game) return false;
  
  const questionIndex = game.questions.findIndex(q => q.id === questionId);
  if (questionIndex === -1) return false;
  
  game.questions[questionIndex] = {
    ...game.questions[questionIndex],
    ...updates
  };
  
  return true;
}

// Function to find a question by ID
export function findQuestion(questionId: string): { game: Game, question: Question } | undefined {
  for (const gameId in games) {
    const game = games[gameId];
    const question = game.questions.find(q => q.id === questionId);
    if (question) {
      return { game, question };
    }
  }
  return undefined;
}

// Export the games object for debugging
export function getAllGames(): Record<string, Game> {
  return games;
}
