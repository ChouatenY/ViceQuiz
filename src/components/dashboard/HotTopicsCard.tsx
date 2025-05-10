import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import WordCloud from "../WordCloud";

type Props = {};

const HotTopicsCard = async (props: Props) => {
  // Default topics in case of database error
  let formattedTopics = [
    { text: "JavaScript", value: 5 },
    { text: "React", value: 4 },
    { text: "TypeScript", value: 3 },
    { text: "Node.js", value: 2 },
    { text: "HTML", value: 2 },
    { text: "CSS", value: 1 },
  ];

  // We're using default topics since we've removed the database
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Hot Topics</CardTitle>
        <CardDescription>
          Click on a topic to start a quiz on it.
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <WordCloud formattedTopics={formattedTopics} />
      </CardContent>
    </Card>
  );
};

export default HotTopicsCard;
