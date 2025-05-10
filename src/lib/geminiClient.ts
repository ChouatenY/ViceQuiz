import axios from 'axios';

// The Gemini API key
const GEMINI_API_KEY = "AIzaSyC3p0HW2dXQAjwKOHVoP7j_Y2uvvSVRjVY";

// Fallback MCQ questions
const mcqFallbackQuestions = [
  {
    question: "What is a key feature of TOPIC?",
    answer: "It's widely used in modern applications",
    option1: "It's no longer maintained",
    option2: "It's only used in legacy systems",
    option3: "It's only available on Windows"
  },
  {
    question: "Which of the following is true about TOPIC?",
    answer: "It has a large community of developers",
    option1: "It was created in 2020",
    option2: "It's only used for gaming applications",
    option3: "It requires specialized hardware"
  },
  {
    question: "What is a common use case for TOPIC?",
    answer: "Building interactive web applications",
    option1: "Mining cryptocurrency",
    option2: "Operating system development",
    option3: "Hardware diagnostics"
  },
  {
    question: "Which company is most associated with TOPIC?",
    answer: "It depends on the specific technology",
    option1: "Only Microsoft",
    option2: "Only Apple",
    option3: "Only Google"
  },
  {
    question: "What is a benefit of using TOPIC?",
    answer: "Improved developer productivity",
    option1: "Reduced security",
    option2: "Slower performance",
    option3: "Limited compatibility"
  }
];

// Function to generate MCQ questions
export async function generateMCQQuestions(topic: string, amount: number = 3, difficulty: string = "intermediate") {
  try {
    console.log(`Generating ${amount} MCQ questions about ${topic}`);

    // Create topic-specific fallback questions
    const topicFallbackQuestions = mcqFallbackQuestions.map(q => ({
      question: q.question.replace('TOPIC', topic),
      answer: q.answer,
      option1: q.option1,
      option2: q.option2,
      option3: q.option3
    }));

    try {
      const prompt = `Generate ${amount} ${difficulty}-level multiple-choice questions about ${topic}.
      Each question should have 1 correct answer and 3 incorrect options.
      The difficulty level is ${difficulty}, so make sure the questions are appropriate for that level.

      For beginner level: Questions should cover basic concepts and be easy to answer.
      For intermediate level: Questions should require deeper understanding and some specific knowledge.
      For professional level: Questions should be challenging and require expert knowledge.

      Format the response as a JSON array with objects having the following structure:
      {
        "question": "The question text",
        "answer": "The correct answer",
        "option1": "First incorrect option",
        "option2": "Second incorrect option",
        "option3": "Third incorrect option"
      }
      Only return the JSON array, nothing else.`;

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
        {
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          }
        }
      );

      // Extract the text from the response
      const text = response.data.candidates[0].content.parts[0].text;
      console.log('Gemini API response received');

      // Try to parse the JSON array
      try {
        // Find anything that looks like a JSON array
        const jsonMatch = text.match(/\[\s*\{[\s\S]*\}\s*\]/);
        if (jsonMatch) {
          const parsedQuestions = JSON.parse(jsonMatch[0]);
          return parsedQuestions.slice(0, amount);
        }
      } catch (error) {
        console.error('Error parsing Gemini response:', error);
      }

      // If we couldn't parse the response, return fallback questions
      console.log('Using fallback questions due to parsing error');
      return topicFallbackQuestions.slice(0, amount);
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      console.log('Using fallback questions due to API error');
      return topicFallbackQuestions.slice(0, amount);
    }
  } catch (error) {
    console.error('Error in generateMCQQuestions:', error);
    // Return generic fallback questions as a last resort
    return [
      {
        question: "What is JavaScript primarily used for?",
        answer: "Web development",
        option1: "Database management",
        option2: "Operating system development",
        option3: "Hardware control"
      },
      {
        question: "Which of these is a JavaScript framework?",
        answer: "React",
        option1: "Python",
        option2: "Java",
        option3: "C++"
      },
      {
        question: "What does HTML stand for?",
        answer: "HyperText Markup Language",
        option1: "High-Level Text Management Language",
        option2: "Hyper Transfer Markup Language",
        option3: "Home Tool Markup Language"
      }
    ].slice(0, amount);
  }
}

// Fallback open-ended questions
const openEndedFallbackQuestions = [
  {
    question: "What are the main advantages of using TOPIC?",
    answer: "Improved efficiency, better user experience, and wider compatibility."
  },
  {
    question: "How has TOPIC evolved over the past few years?",
    answer: "It's become more user-friendly, feature-rich, and widely adopted."
  },
  {
    question: "What are some common challenges when working with TOPIC?",
    answer: "Learning curve, compatibility issues, and performance optimization."
  },
  {
    question: "Why is TOPIC important in modern development?",
    answer: "It enables faster development, better user experiences, and cross-platform compatibility."
  },
  {
    question: "What future developments do you expect for TOPIC?",
    answer: "More AI integration, improved performance, and wider adoption."
  }
];

// Function to generate open-ended questions
export async function generateOpenEndedQuestions(topic: string, amount: number = 3, difficulty: string = "intermediate") {
  try {
    console.log(`Generating ${amount} open-ended questions about ${topic}`);

    // Create topic-specific fallback questions
    const topicFallbackQuestions = openEndedFallbackQuestions.map(q => ({
      question: q.question.replace('TOPIC', topic),
      answer: q.answer
    }));

    try {
      const prompt = `Generate ${amount} ${difficulty}-level open-ended questions about ${topic}.
      Each question should have a short answer (15 words or less).
      The difficulty level is ${difficulty}, so make sure the questions are appropriate for that level.

      For beginner level: Questions should cover basic concepts and be easy to answer.
      For intermediate level: Questions should require deeper understanding and some specific knowledge.
      For professional level: Questions should be challenging and require expert knowledge.

      Format the response as a JSON array with objects having the following structure:
      {
        "question": "The question text",
        "answer": "The answer text (15 words or less)"
      }
      Only return the JSON array, nothing else.`;

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
        {
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          }
        }
      );

      // Extract the text from the response
      const text = response.data.candidates[0].content.parts[0].text;
      console.log('Gemini API response received');

      // Try to parse the JSON array
      try {
        // Find anything that looks like a JSON array
        const jsonMatch = text.match(/\[\s*\{[\s\S]*\}\s*\]/);
        if (jsonMatch) {
          const parsedQuestions = JSON.parse(jsonMatch[0]);
          return parsedQuestions.slice(0, amount);
        }
      } catch (error) {
        console.error('Error parsing Gemini response:', error);
      }

      // If we couldn't parse the response, return fallback questions
      console.log('Using fallback questions due to parsing error');
      return topicFallbackQuestions.slice(0, amount);
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      console.log('Using fallback questions due to API error');
      return topicFallbackQuestions.slice(0, amount);
    }
  } catch (error) {
    console.error('Error in generateOpenEndedQuestions:', error);
    // Return generic fallback questions as a last resort
    return [
      {
        question: "What are the key principles of web design?",
        answer: "Usability, accessibility, responsiveness, and visual hierarchy."
      },
      {
        question: "How does JavaScript differ from Java?",
        answer: "Different languages; JavaScript for web, Java for applications."
      },
      {
        question: "What is the purpose of CSS in web development?",
        answer: "To style and layout web pages."
      }
    ].slice(0, amount);
  }
}
