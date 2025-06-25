"use client";
import React, { useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Lightbulb } from "lucide-react";
// Define our own Question type since we're not using Prisma
type Question = {
  id: string;
  question: string;
  answer: string;
  userAnswer?: string;
  isCorrect?: boolean;
  percentageCorrect?: number;
  questionType: 'mcq' | 'open_ended';
};

type Props = {
  questions: Question[];
};

const QuestionsList = ({ questions }: Props) => {
  const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(new Set());
  const [explanations, setExplanations] = useState<Map<number, string>>(new Map());
  const [loadingExplanations, setLoadingExplanations] = useState<Set<number>>(new Set());

  const toggleQuestion = async (index: number) => {
    const newExpanded = new Set(expandedQuestions);

    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);

      // Generate explanation if not already generated
      if (!explanations.has(index)) {
        setLoadingExplanations(prev => new Set(prev).add(index));

        try {
          const question = questions[index];
          const response = await axios.post('/api/explanation', {
            question: question.question,
            correctAnswer: question.answer,
            userAnswer: question.userAnswer || "No answer provided",
            questionType: question.questionType,
          });

          setExplanations(prev => new Map(prev).set(index, response.data.explanation));
        } catch (error) {
          console.error('Error generating explanation:', error);
          setExplanations(prev => new Map(prev).set(index, "Unable to generate explanation at this time."));
        } finally {
          setLoadingExplanations(prev => {
            const newSet = new Set(prev);
            newSet.delete(index);
            return newSet;
          });
        }
      }
    }

    setExpandedQuestions(newExpanded);
  };

  return (
    <div className="mt-8 space-y-4">
      <h3 className="text-2xl font-bold text-primary mb-6">Question Review</h3>

      {questions.map((question, index) => {
        const isExpanded = expandedQuestions.has(index);
        const isLoading = loadingExplanations.has(index);
        const explanation = explanations.get(index);

        return (
          <Card key={index} className="border-2 border-secondary/30 hover:border-primary/30 transition-colors duration-200">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                    <h4 className="text-lg font-semibold text-primary">Question {index + 1}</h4>
                  </div>

                  <p className="text-base mb-4 text-gray-700">{question.question}</p>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-600">Correct Answer:</p>
                      <p className="text-base font-semibold text-green-600 bg-green-50 p-3 rounded-lg border border-green-200">
                        {question.answer}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-600">Your Answer:</p>
                      <p className={`text-base font-semibold p-3 rounded-lg border ${
                        question.questionType === "mcq"
                          ? question.isCorrect
                            ? "text-green-600 bg-green-50 border-green-200"
                            : "text-red-600 bg-red-50 border-red-200"
                          : "text-blue-600 bg-blue-50 border-blue-200"
                      }`}>
                        {question.userAnswer || "No answer provided"}
                      </p>
                    </div>
                  </div>

                  {question.questionType === "open_ended" && question.percentageCorrect !== undefined && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-600 mb-2">Accuracy Score:</p>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-primary h-3 rounded-full transition-all duration-500"
                            style={{ width: `${question.percentageCorrect}%` }}
                          ></div>
                        </div>
                        <span className="text-lg font-bold text-primary">{question.percentageCorrect}%</span>
                      </div>
                    </div>
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleQuestion(index)}
                  className="ml-4 border-primary text-primary hover:bg-primary hover:text-white transition-colors duration-200"
                >
                  <Lightbulb className="w-4 h-4 mr-2" />
                  {isExpanded ? "Hide" : "Explain"}
                  {isExpanded ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
                </Button>
              </div>

              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-secondary/30">
                  <div className="bg-secondary/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Lightbulb className="w-5 h-5 text-primary" />
                      <h5 className="font-semibold text-primary">AI Explanation</h5>
                    </div>

                    {isLoading ? (
                      <div className="flex items-center gap-3">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                        <p className="text-gray-600">Generating explanation...</p>
                      </div>
                    ) : (
                      <p className="text-gray-700 leading-relaxed">{explanation}</p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default QuestionsList;
