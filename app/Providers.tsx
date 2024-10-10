"use client";

import type { PropsWithChildren } from "react";

import { LiveblocksProvider } from "@liveblocks/react";
import useStore from "@/Store/Store";
import axios from "axios";

declare type CustomAuth = {
  token: string;
  error?: never
} | {
  token?: never
  error: "forbidden";
  reason: string;
} | {
  token?: never;
  error: string;
  reason: string
}

export function Providers({ children }: PropsWithChildren) {

  const authEndPoint = async(room: string): Promise<CustomAuth> => {
    try {
      const url = "http://localhost:9000/api/v1/room/create-room"
      const response = await axios.post(url, {
        roomId: room
      },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json"
        }
      }
    )

    return {
      token: response.data,
    }
    }catch(err) {
      console.log(" error Authenticating room ", err);
    }
    return {
      error: "error",
      reason: "Failed to authenticate room"
    }

  }

  return (
    <LiveblocksProvider
      authEndpoint={authEndPoint}

    >
      {children}
    </LiveblocksProvider>
  );
}
