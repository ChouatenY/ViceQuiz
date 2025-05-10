import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import HistoryComponent from "../HistoryComponent";

type Props = {};

const RecentActivityCard = async (props: Props) => {
  // We're using a default count since we've removed the database
  const games_count = 0;

  return (
    <Card className="col-span-4 lg:col-span-3">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          <Link href="/history">Recent Activity</Link>
        </CardTitle>
        <CardDescription>
          You have played a total of {games_count} quizzes.
        </CardDescription>
      </CardHeader>
      <CardContent className="max-h-[580px] overflow-scroll">
        <div className="space-y-8">
          <p>Start a quiz to see your activity here!</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivityCard;
