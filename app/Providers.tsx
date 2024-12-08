"use client";

import {  useEffect, type PropsWithChildren } from "react";

import { LiveblocksProvider } from "@liveblocks/react";
import useStore from "@/Store/Store";


export function Providers({ children }: PropsWithChildren) {
  const { roomLink } = useStore();

  console.log("Providers roomlink main thing", roomLink);
  useEffect(() => {
    const getId = async() => {
      try {
        const response = await fetch("/api/liveblocks-auth", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({roomLink})
        })
      if(!response.ok) {
        console.log("failed to send the data to server");
      }else {
        const data = await response.json();
        console.log("server response", data);
      }

      }catch(err) {
        console.log("Something went wrong while sending the roomId", err);
      }

    }
    getId();
  }, [roomLink])

  return (
          <LiveblocksProvider
          authEndpoint={`api/liveblocks-auth`}
          throttle={50}
        >
          {children}
        </LiveblocksProvider>
  );
}
