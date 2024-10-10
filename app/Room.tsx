"use client";


import { ReactNode, useMemo, useState } from "react";

import { RoomProvider } from "@liveblocks/react/suspense";

import { useSearchParams } from "next/navigation";

import { ClientSideSuspense } from "@liveblocks/react";

import { DocumentSpinner } from "@/primitives/Spinner";

import useStore from "@/Store/Store";


export function Room({ children}: { children: ReactNode }) {
  const { rooms } = useStore(); // coming from zustand 
  console.log("this is the rooms", rooms)

  const joinRoom = rooms.map((items) => {
    return {
      roomId: items.roomId,
      accessToken: items.AccessToken,
      Joiner: items.JoinerName

    }
  })
  // get the last room the user joined 

  const lastIndex = joinRoom.length - 1;
  const recentlyJoinedUser = joinRoom[lastIndex]

  const {roomId, accessToken, Joiner} = recentlyJoinedUser || {};
  console.log("this is the user", roomId)

  // const roomID = useExampleRoomId(
  //   roomId
  // );
  //"liveblocks:examples:nextjs-yjs-tiptap-advanced"

  // google it and make it working !!
  


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


/**

 * This function is used when deploying an example on liveblocks.io.

 * You can ignore it completely if you run the example locally.

 */

function useExampleRoomId(roomId: string) {

  const params = useSearchParams();

  const exampleId = params?.get("exampleId");


  const exampleRoomId = useMemo(() => {

    return exampleId ? `${roomId}-${exampleId}` : roomId;

  }, [roomId, exampleId]);


  return exampleRoomId;

}
