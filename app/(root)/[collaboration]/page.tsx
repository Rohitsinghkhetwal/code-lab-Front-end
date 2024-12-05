"use client";
import { Room } from "@/app/Room";
import { CollaborativeEditor } from "@/components/CollaborativeEditor";
import { useParams } from "next/navigation";
import Chats from "../chats/page";

const Collaborations = () => {
  const { collaboration } = useParams();

  const NormalRoomID = Array.isArray(collaboration)
    ? collaboration[0]
    : collaboration;

  return (
    <div className="flex min-h-screen w-full ">
      <main className="flex-1 bg-black-200 w-[60%]">
        <Room roomId={NormalRoomID}>
          <CollaborativeEditor />
        </Room>
      </main>

      <aside className="w-[26%] p-4 border-l">
        <Chats />
      </aside>
    </div>
  );
};

export default Collaborations;
