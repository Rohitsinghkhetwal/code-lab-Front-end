"use client";

import { useEffect, type PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { LiveblocksProvider } from "@liveblocks/react";
import useStore from "@/Store/Store";
const queryClient = new QueryClient();

export function Providers({ children }: PropsWithChildren) {
  const { roomLink } = useStore();
  console.log("ROOMLINK FROM THE PROVIDER", roomLink);

  useEffect(() => {
    if(!roomLink){
      console.log("roomLink is not set properly !")
    }

  },[roomLink])

  return (
    <QueryClientProvider client={queryClient}>
      {
        roomLink ? (
          <LiveblocksProvider
        authEndpoint={`api/liveblocks-auth?roomId=${roomLink}`}
        throttle={100}
      >
        {children}
      </LiveblocksProvider>

        ): (
          <div>
            <h1>Loading...</h1>

          </div>
        )
      }
      
    </QueryClientProvider>
  );
}
