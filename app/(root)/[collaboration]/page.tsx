"use client"
import { Room } from "@/app/Room";
import { CollaborativeEditor } from "@/components/CollaborativeEditor";
import { useParams } from "next/navigation";
import Chats from "../chats/page";




const Collaborations = () => {
  const { collaboration } = useParams();

 
  

  const NormalRoomID = Array.isArray(collaboration) ? collaboration[0] : collaboration;

  return (
    <div className="relative min-h-screen min-w-full">
      <main>
      <Room roomId={NormalRoomID}> 
        <CollaborativeEditor/>
      </Room>
      </main>

      <aside className="w-96 p-4 bg-gray-50 border-l">
        <Chats />
      </aside>
      
    </div>
  );
};

export default Collaborations;
