import DetailsDialog from "@/components/DetailsDialog";
import HistoryCard from "@/components/dashboard/HistoryCard";
import HotTopicsCard from "@/components/dashboard/HotTopicsCard";
import QuizMeCard from "@/components/dashboard/QuizMeCard";
import RecentActivityCard from "@/components/dashboard/RecentActivityCard";
import { getAuthSession } from "@/lib/nextauth";
import React from "react";

type Props = {};

export const metadata = {
  title: "Dashboard | Quizzzy",
  description: "Quiz yourself on anything!",
};

const Dasboard = async (props: Props) => {
  // Get the local user session
  const session = await getAuthSession();

  return (
    <main className="min-h-screen bg-gradient-to-br from-secondary/10 to-white p-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-4xl font-bold tracking-tight text-primary mb-2">Dashboard</h2>
            <p className="text-lg text-muted-foreground">Welcome back! Ready for your next quiz?</p>
          </div>
          <DetailsDialog />
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <QuizMeCard />
          <HistoryCard />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <HotTopicsCard />
          <RecentActivityCard />
        </div>
      </div>
    </main>
  );
};

export default Dasboard;
