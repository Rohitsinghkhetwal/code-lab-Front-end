"use client";
import AudioCall from "@/components/AudioCall";
import React from "react";

const Chats = ({
  roomId,
  userId,
  name,
}: {
  roomId: string;
  userId: string;
  name: string | null;
}) => {
  return (
    <div className="h-fit">
      <AudioCall roomId={roomId} userId={userId} username={name} />
    </div>
  );
};

export default Chats;
