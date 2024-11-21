"use client";

import { type PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { LiveblocksProvider } from "@liveblocks/react";
const queryClient = new QueryClient();

export function Providers({ children }: PropsWithChildren) {

  return (
    <QueryClientProvider client={queryClient}>
    
          <LiveblocksProvider
          authEndpoint={`api/liveblocks-auth`}
          throttle={50}
        >
          {children}
        </LiveblocksProvider>

    
    </QueryClientProvider>
  );
}
