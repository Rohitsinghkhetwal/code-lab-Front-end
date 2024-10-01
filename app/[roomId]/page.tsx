"use client";

import React, { useEffect } from "react";
import { Room } from "../Room";
import { useParams } from "next/navigation";
import { TextEditor } from "@/components/TextEditor";
import useStore from "@/Store/Store";

const DynamicPage = () => {
  const { createRoom } = useStore();
  const { roomId: id } = useParams();

  const handleCreateRoom = async (Id: string) => {
    try {
      const res = await createRoom(Id);
      console.log("this is a roomID", res);
    } catch (err) {
      console.log("this is the error", err);
    }
  };

  

 

  return (
    <div className="flex items-center justify-center bg-green-500">
      <h1 className="text-6 font-bold text-center">Your RoomID: {id}</h1>
      <Room roomId={id as string}>
        <TextEditor />
      </Room>
    </div>
  );
};

export default DynamicPage;
