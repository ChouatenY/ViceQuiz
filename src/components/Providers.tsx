"use client";
import React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import LocalUserProvider from "./LocalUserProvider";
const queryClient = new QueryClient();

const Providers = ({ children }: ThemeProviderProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
        <LocalUserProvider>{children}</LocalUserProvider>
      </NextThemesProvider>
    </QueryClientProvider>
  );
};

export default Providers;
