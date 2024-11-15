"use client";

import { type PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { LiveblocksProvider } from "@liveblocks/react";
import useStore from "@/Store/Store";
const queryClient = new QueryClient();

export function Providers({ children }: PropsWithChildren) {
  const { roomLink } = useStore();
  console.log("ROOMLINK FROM THE PROVIDER", roomLink);

  return (
    <QueryClientProvider client={queryClient}>
      <LiveblocksProvider
        authEndpoint={`api/liveblocks-auth?roomId=${roomLink}`}
        throttle={100}
      >
        {children}
      </LiveblocksProvider>
    </QueryClientProvider>
  );
}
