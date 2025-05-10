import { v4 as uuidv4 } from 'uuid';

// Fallback questions for MCQ
export const mcqFallbackQuestions = [
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
export const openEndedFallbackQuestions = [
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

// Function to generate a game with questions
export function generateGame(topic: string, type: 'mcq' | 'open_ended', amount: number) {
  const gameId = uuidv4();
  
  // Get questions based on the type
  const questions = type === "mcq" 
    ? mcqFallbackQuestions.slice(0, amount).map(q => ({
        id: uuidv4(),
        gameId,
        question: q.question,
        answer: q.answer,
        options: [q.option1, q.option2, q.option3, q.answer].sort(() => Math.random() - 0.5),
        questionType: "mcq" as const
      }))
    : openEndedFallbackQuestions.slice(0, amount).map(q => ({
        id: uuidv4(),
        gameId,
        question: q.question,
        answer: q.answer,
        questionType: "open_ended" as const
      }));
  
  // Create a game object
  const game = {
    id: gameId,
    userId: "local-user",
    topic,
    gameType: type,
    timeStarted: new Date().toISOString(),
    questions
  };
  
  return game;
}
