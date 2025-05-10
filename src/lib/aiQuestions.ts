import axios from 'axios';

// The Gemini API key
const GEMINI_API_KEY = "AIzaSyC3p0HW2dXQAjwKOHVoP7j_Y2uvvSVRjVY";

// Function to generate MCQ questions using Gemini API
export async function generateMCQQuestions(topic: string, amount: number = 3, difficulty: string = "intermediate") {
  console.log(`Generating ${amount} ${difficulty} MCQ questions about ${topic}`);

  // Create a detailed prompt for the AI
  const prompt = `Generate ${amount} unique multiple-choice questions about "${topic}" at ${difficulty} difficulty level.

  For each question:
  - Make sure it's specifically about ${topic} with detailed, accurate information
  - The difficulty should be ${difficulty} (beginner = basic knowledge, intermediate = deeper understanding, professional = expert knowledge)
  - Provide 1 correct answer and 3 incorrect but plausible options
  - Ensure all questions and answers are factually accurate
  - Make questions interesting and educational
  - Cover different aspects of ${topic}

  Format your response as a JSON array with this structure:
  [
    {
      "question": "Detailed question about ${topic}?",
      "answer": "The correct answer",
      "option1": "First incorrect option",
      "option2": "Second incorrect option",
      "option3": "Third incorrect option"
    },
    ...more questions...
  ]

  Only return the JSON array, nothing else.`;

  // Make multiple attempts to get a valid response
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      console.log(`Attempt ${attempt} to generate MCQ questions`);

      // Call the Gemini API
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
        {
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.9,  // Higher temperature for more creativity
            maxOutputTokens: 2048,
          }
        }
      );

      // Extract and parse the response
      const text = response.data.candidates[0].content.parts[0].text;
      console.log("Received response from Gemini API");

      // Extract JSON array from the response
      const jsonMatch = text.match(/\[\s*\{[\s\S]*\}\s*\]/);
      if (jsonMatch) {
        try {
          const parsedQuestions = JSON.parse(jsonMatch[0]);
          if (parsedQuestions.length > 0) {
            return parsedQuestions.slice(0, amount);
          }
        } catch (parseError) {
          console.error("Error parsing JSON:", parseError);
        }
      }

      console.log("Failed to get valid questions, retrying...");
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error);
    }
  }

  // If all attempts fail, create emergency questions about the topic
  console.error("All attempts to generate questions failed, creating emergency questions");
  return createEmergencyMCQQuestions(topic, amount, difficulty);
}

// Function to generate open-ended questions using Gemini API
export async function generateOpenEndedQuestions(topic: string, amount: number = 3, difficulty: string = "intermediate") {
  console.log(`Generating ${amount} ${difficulty} open-ended questions about ${topic}`);

  // Create a detailed prompt for the AI
  const prompt = `Generate ${amount} unique open-ended questions about "${topic}" at ${difficulty} difficulty level.

  For each question:
  - Make sure it's specifically about ${topic} with detailed, accurate information
  - The difficulty should be ${difficulty} (beginner = basic knowledge, intermediate = deeper understanding, professional = expert knowledge)
  - Provide a concise answer (15 words or less)
  - Ensure all questions and answers are factually accurate
  - Make questions interesting and educational
  - Cover different aspects of ${topic}

  Format your response as a JSON array with this structure:
  [
    {
      "question": "Detailed question about ${topic}?",
      "answer": "Concise answer (15 words or less)"
    },
    ...more questions...
  ]

  Only return the JSON array, nothing else.`;

  // Make multiple attempts to get a valid response
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      console.log(`Attempt ${attempt} to generate open-ended questions`);

      // Call the Gemini API
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
        {
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.9,  // Higher temperature for more creativity
            maxOutputTokens: 2048,
          }
        }
      );

      // Extract and parse the response
      const text = response.data.candidates[0].content.parts[0].text;
      console.log("Received response from Gemini API");

      // Extract JSON array from the response
      const jsonMatch = text.match(/\[\s*\{[\s\S]*\}\s*\]/);
      if (jsonMatch) {
        try {
          const parsedQuestions = JSON.parse(jsonMatch[0]);
          if (parsedQuestions.length > 0) {
            return parsedQuestions.slice(0, amount);
          }
        } catch (parseError) {
          console.error("Error parsing JSON:", parseError);
        }
      }

      console.log("Failed to get valid questions, retrying...");
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error);
    }
  }

  // If all attempts fail, create emergency questions about the topic
  console.error("All attempts to generate questions failed, creating emergency questions");
  return createEmergencyOpenEndedQuestions(topic, amount, difficulty);
}

// Create emergency MCQ questions when AI generation fails
function createEmergencyMCQQuestions(topic: string, amount: number, difficulty: string) {
  // Create dynamic questions based on the topic
  const difficultyWord = difficulty === 'beginner' ? 'basic' :
                         difficulty === 'professional' ? 'advanced' : 'intermediate';

  // Generate questions with the topic directly in them
  const questions = [
    {
      question: `What is one of the most important aspects of ${topic} to understand?`,
      answer: `The fundamental principles that make ${topic} work`,
      option1: `The history of how ${topic} was discovered`,
      option2: `The people who invented ${topic}`,
      option3: `The cost of implementing ${topic}`
    },
    {
      question: `For someone studying ${topic} at a ${difficultyWord} level, what should they focus on?`,
      answer: `Understanding the core concepts and practical applications`,
      option1: `Memorizing all the terminology`,
      option2: `Learning about unrelated fields`,
      option3: `Focusing only on theoretical aspects`
    },
    {
      question: `Which of these statements about ${topic} is most accurate?`,
      answer: `${topic} continues to evolve with new developments`,
      option1: `${topic} has remained unchanged for decades`,
      option2: `${topic} is no longer relevant in modern contexts`,
      option3: `${topic} is impossible to learn without formal education`
    },
    {
      question: `What approach would be most effective when learning about ${topic}?`,
      answer: `A combination of theory and practical application`,
      option1: `Memorization without understanding`,
      option2: `Focusing only on historical aspects`,
      option3: `Avoiding all difficult concepts`
    },
    {
      question: `How might ${topic} be different in five years?`,
      answer: `It will likely incorporate new technologies and methodologies`,
      option1: `It will be exactly the same as today`,
      option2: `It will be completely replaced by something else`,
      option3: `It will no longer be studied or used`
    }
  ];

  // Add difficulty-specific questions
  if (difficulty === 'beginner') {
    questions.push({
      question: `What's a good first step for beginners learning about ${topic}?`,
      answer: `Understanding the basic terminology and concepts`,
      option1: `Immediately trying advanced techniques`,
      option2: `Skipping the fundamentals`,
      option3: `Focusing only on obscure details`
    });
  } else if (difficulty === 'professional') {
    questions.push({
      question: `At a professional level, what distinguishes experts in ${topic}?`,
      answer: `Deep understanding of both theory and practical applications`,
      option1: `Only knowing the history`,
      option2: `Avoiding new developments`,
      option3: `Focusing on only one narrow aspect`
    });
  }

  return questions.slice(0, amount);
}

// Create emergency open-ended questions when AI generation fails
function createEmergencyOpenEndedQuestions(topic: string, amount: number, difficulty: string) {
  // Create dynamic questions based on the topic
  const difficultyWord = difficulty === 'beginner' ? 'basic' :
                         difficulty === 'professional' ? 'advanced' : 'intermediate';

  // Generate questions with the topic directly in them
  const questions = [
    {
      question: `What are the most important concepts to understand about ${topic} at a ${difficultyWord} level?`,
      answer: `Core principles, practical applications, and current developments.`
    },
    {
      question: `How would you explain ${topic} to someone who has never heard of it?`,
      answer: `A field that focuses on solving problems through specialized knowledge and techniques.`
    },
    {
      question: `What makes ${topic} relevant in today's world?`,
      answer: `Its applications to current challenges and ongoing innovation.`
    },
    {
      question: `What are the biggest challenges when working with ${topic}?`,
      answer: `Complexity, keeping up with changes, and practical implementation.`
    },
    {
      question: `How do you expect ${topic} to evolve in the next few years?`,
      answer: `Integration with new technologies and expanding applications.`
    }
  ];

  // Add difficulty-specific questions
  if (difficulty === 'beginner') {
    questions.push({
      question: `What resources would you recommend for a beginner learning about ${topic}?`,
      answer: `Introductory books, online courses, and hands-on practice.`
    });
  } else if (difficulty === 'professional') {
    questions.push({
      question: `What advanced concepts in ${topic} are most valuable for professionals?`,
      answer: `Specialized techniques, integration strategies, and optimization methods.`
    });
  }

  return questions.slice(0, amount);
}
