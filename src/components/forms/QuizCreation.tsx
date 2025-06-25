"use client";
import { quizCreationSchema } from "@/schemas/forms/quiz";
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { BookOpen, CopyCheck } from "lucide-react";
import { Separator } from "../ui/separator";
import axios, { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LoadingQuestions from "../LoadingQuestions";
import { v4 as uuidv4 } from 'uuid';
import { generateMCQQuestions, generateOpenEndedQuestions } from "@/lib/aiQuestions";

type Props = {
  topic: string;
};

type Input = z.infer<typeof quizCreationSchema>;

const QuizCreation = ({ topic: topicParam }: Props) => {
  const router = useRouter();
  const [showLoader, setShowLoader] = React.useState(false);
  const [finishedLoading, setFinishedLoading] = React.useState(false);
  const { toast } = useToast();
  const { mutate: getQuestions, isLoading } = useMutation({
    mutationFn: async ({ amount, topic, type }: Input) => {
      console.log("Submitting quiz creation request:", { amount, topic, type });
      try {
        const response = await axios.post("/api/game", { amount, topic, type });
        console.log("Quiz creation response:", response.data);
        return response.data;
      } catch (error) {
        console.error("Quiz creation error:", error);
        if (axios.isAxiosError(error) && error.response) {
          console.error("Error response data:", error.response.data);
        }
        throw error;
      }
    },
  });

  const form = useForm<Input>({
    resolver: zodResolver(quizCreationSchema),
    defaultValues: {
      topic: topicParam,
      type: "mcq",
      amount: 3,
      difficulty: "intermediate",
    },
  });

  const onSubmit = async (data: Input) => {
    try {
      setShowLoader(true);

      // Generate a unique ID for the game
      const gameId = uuidv4();

      // Generate questions based on the topic, type, and difficulty
      let questions;
      if (data.type === "mcq") {
        questions = await generateMCQQuestions(data.topic, data.amount, data.difficulty);
      } else {
        questions = await generateOpenEndedQuestions(data.topic, data.amount, data.difficulty);
      }

      // Format the questions for the game
      const formattedQuestions = data.type === "mcq"
        ? questions.map(q => ({
            id: uuidv4(),
            gameId,
            question: q.question,
            answer: q.answer,
            options: [q.option1, q.option2, q.option3, q.answer].sort(() => Math.random() - 0.5),
            questionType: "mcq" as const
          }))
        : questions.map(q => ({
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
        topic: data.topic,
        gameType: data.type,
        timeStarted: new Date().toISOString(),
        questions: formattedQuestions
      };

      // Encode the game data as a JSON string
      const gameData = encodeURIComponent(JSON.stringify(game));

      // Show the loading animation for a moment
      setFinishedLoading(true);

      // After a short delay, redirect to the appropriate game page with the game data
      setTimeout(() => {
        if (data.type === "mcq") {
          router.push(`/play/mcq/${game.id}?data=${gameData}`);
        } else if (data.type === "open_ended") {
          router.push(`/play/open-ended/${game.id}?data=${gameData}`);
        }
      }, 1500);
    } catch (error) {
      console.error("Error generating quiz:", error);
      setShowLoader(false);

      toast({
        title: "Error Creating Quiz",
        description: "An error occurred while generating questions. Please try again with a different topic.",
        variant: "destructive",
      });
    }
  };
  form.watch();

  if (showLoader) {
    return <LoadingQuestions finished={finishedLoading} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/20 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm animate-in fade-in-0 zoom-in-95 duration-500">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-3xl font-bold text-primary mb-2">Create Your Quiz</CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              Generate AI-powered questions on any topic
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-base font-semibold text-primary">Topic</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter a topic (e.g., React, World History, Mathematics)"
                          {...field}
                          className="h-12 text-base border-2 border-secondary focus:border-primary transition-colors duration-200"
                        />
                      </FormControl>
                      <FormDescription className="text-sm text-muted-foreground">
                        Enter any topic you'd like to be quizzed on. The AI will generate relevant questions.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-base font-semibold text-primary">Number of Questions</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter number (1-10)"
                          type="number"
                          {...field}
                          onChange={(e) => {
                            form.setValue("amount", parseInt(e.target.value));
                          }}
                          min={1}
                          max={10}
                          className="h-12 text-base border-2 border-secondary focus:border-primary transition-colors duration-200"
                        />
                      </FormControl>
                      <FormDescription className="text-sm text-muted-foreground">
                        Choose between 1-10 questions for your quiz.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="difficulty"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <FormLabel className="text-base font-semibold text-primary">Difficulty Level</FormLabel>
                      <div className="w-full space-y-3">
                        <div className="grid grid-cols-3 gap-3">
                          <Button
                            type="button"
                            variant={field.value === "beginner" ? "default" : "outline"}
                            className={`h-12 transition-all duration-300 transform hover:scale-105 ${
                              field.value === "beginner"
                                ? "bg-primary hover:bg-primary/90 text-white shadow-lg"
                                : "border-2 border-primary text-primary hover:bg-secondary/30"
                            }`}
                            onClick={() => form.setValue("difficulty", "beginner")}
                          >
                            🌱 Beginner
                          </Button>
                          <Button
                            type="button"
                            variant={field.value === "intermediate" ? "default" : "outline"}
                            className={`h-12 transition-all duration-300 transform hover:scale-105 ${
                              field.value === "intermediate"
                                ? "bg-primary hover:bg-primary/90 text-white shadow-lg"
                                : "border-2 border-primary text-primary hover:bg-secondary/30"
                            }`}
                            onClick={() => form.setValue("difficulty", "intermediate")}
                          >
                            🎯 Intermediate
                          </Button>
                          <Button
                            type="button"
                            variant={field.value === "professional" ? "default" : "outline"}
                            className={`h-12 transition-all duration-300 transform hover:scale-105 ${
                              field.value === "professional"
                                ? "bg-primary hover:bg-primary/90 text-white shadow-lg"
                                : "border-2 border-primary text-primary hover:bg-secondary/30"
                            }`}
                            onClick={() => form.setValue("difficulty", "professional")}
                          >
                            🚀 Professional
                          </Button>
                        </div>
                      </div>
                      <FormDescription className="text-sm text-muted-foreground">
                        Choose the difficulty level that matches your expertise.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <label className="text-base font-semibold text-primary">Quiz Type</label>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant={
                        form.getValues("type") === "mcq" ? "default" : "secondary"
                      }
                      className={`h-16 transition-all duration-300 transform hover:scale-105 ${
                        form.getValues("type") === "mcq"
                          ? "bg-primary hover:bg-primary/90 text-white shadow-lg"
                          : "bg-secondary hover:bg-secondary/80 text-primary border-2 border-primary/20"
                      }`}
                      onClick={() => {
                        form.setValue("type", "mcq");
                      }}
                      type="button"
                    >
                      <div className="flex flex-col items-center space-y-1">
                        <CopyCheck className="w-5 h-5" />
                        <span className="text-sm font-medium">Multiple Choice</span>
                      </div>
                    </Button>
                    <Button
                      variant={
                        form.getValues("type") === "open_ended"
                          ? "default"
                          : "secondary"
                      }
                      className={`h-16 transition-all duration-300 transform hover:scale-105 ${
                        form.getValues("type") === "open_ended"
                          ? "bg-primary hover:bg-primary/90 text-white shadow-lg"
                          : "bg-secondary hover:bg-secondary/80 text-primary border-2 border-primary/20"
                      }`}
                      onClick={() => form.setValue("type", "open_ended")}
                      type="button"
                    >
                      <div className="flex flex-col items-center space-y-1">
                        <BookOpen className="w-5 h-5" />
                        <span className="text-sm font-medium">Open Ended</span>
                      </div>
                    </Button>
                  </div>
                </div>

                <Button
                  disabled={isLoading}
                  type="submit"
                  className="w-full h-14 bg-primary hover:bg-primary/90 text-white text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Creating Quiz...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>🚀 Create Quiz</span>
                    </div>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuizCreation;
