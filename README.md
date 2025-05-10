# Quizzy - AI-Powered Quiz Application

Quizzy is an interactive quiz application that generates custom quizzes on any topic using AI. Users can choose between multiple-choice and open-ended questions, select difficulty levels, and track their performance.

## Features

- Generate custom quizzes on any topic
- Choose between multiple-choice and open-ended questions
- Select difficulty level (Beginner, Intermediate, Professional)
- Track quiz history and statistics
- Responsive design for all devices
- Dark mode support

## Tech Stack

- Next.js 13 with App Router
- TypeScript
- Tailwind CSS
- Google Gemini AI API
- Vercel for deployment

## Deployment on Vercel

### Prerequisites

- A Vercel account
- Google Gemini API key

### Steps to Deploy

1. Fork or clone this repository
2. Create a new project on Vercel
3. Connect your GitHub repository to Vercel
4. Set the following environment variables in Vercel:
   - `GEMINI_API_KEY`: Your Google Gemini API key
   - `NEXTAUTH_SECRET`: A random string for session encryption
   - `API_URL`: Will be automatically set by Vercel
5. Deploy the project

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Fquizzy&env=GEMINI_API_KEY,NEXTAUTH_SECRET)

## Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with the following variables:
   ```
   GEMINI_API_KEY=your-gemini-api-key
   API_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## License

MIT
