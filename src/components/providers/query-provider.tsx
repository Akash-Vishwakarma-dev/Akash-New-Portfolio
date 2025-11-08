"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Cache data for 5 minutes
        staleTime: 5 * 60 * 1000,
        // Keep unused data in cache for 10 minutes
        gcTime: 10 * 60 * 1000,
        // Don't refetch on window focus (better UX for portfolio)
        refetchOnWindowFocus: false,
        // Retry failed requests twice
        retry: 2,
        // Exponential backoff
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        // Refetch on mount if data is stale
        refetchOnMount: true,
        // Don't refetch on reconnect automatically
        refetchOnReconnect: false,
      },
      mutations: {
        // Retry mutations once
        retry: 1,
        // On error, show toast notification
        onError: (error) => {
          console.error("Mutation error:", error);
        },
      },
    },
  });
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(createQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
