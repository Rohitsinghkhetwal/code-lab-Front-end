"use client";

import {  useEffect, type PropsWithChildren } from "react";

import { LiveblocksProvider } from "@liveblocks/react";
import useStore from "@/Store/Store";


export function Providers({ children }: PropsWithChildren) {
  const { roomLink } = useStore();

  useEffect(() => {
    const getId = async() => {
      try {
        if(!roomLink) {
          return;
        }
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
         await response.json();
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
