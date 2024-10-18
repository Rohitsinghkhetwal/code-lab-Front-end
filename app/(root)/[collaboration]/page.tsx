"use client"
import { Room } from "@/app/Room";
import { CollaborativeEditor } from "@/components/CollaborativeEditor";
import { useParams } from "next/navigation";



const Collaborations = () => {
  const { collaboration } = useParams();
  console.log("this is the collaboration id from routes", collaboration)

  const NormalRoomID = Array.isArray(collaboration) ? collaboration[0] : collaboration;


  
  return (
    <div className="relative min-h-screen min-w-full">
      <Room roomId={NormalRoomID}> 

        <CollaborativeEditor/>

      </Room>
    </div>
  );
};

export default Collaborations;
