"use client";


import { ReactNode } from "react";

import { RoomProvider } from "@liveblocks/react/suspense";


import { ClientSideSuspense } from "@liveblocks/react";

import { DocumentSpinner } from "@/primitives/Spinner";



export function Room({ children, roomId}: { children: ReactNode, roomId: string}) {

  console.log("this is the roomid from roomProvider", roomId)

  return (

    <RoomProvider

      id={roomId}

      initialPresence={{

        cursor: null,

      }}
      

    >

      <ClientSideSuspense fallback={<DocumentSpinner />}>

        {children}

      </ClientSideSuspense>

    </RoomProvider>

  );

}

