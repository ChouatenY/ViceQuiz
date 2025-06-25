"use client";
import React from "react";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import LocalUserProvider from "./LocalUserProvider";

const queryClient = new QueryClient();

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers = ({ children }: ProvidersProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <LocalUserProvider>{children}</LocalUserProvider>
    </QueryClientProvider>
  );
};

export default Providers;
