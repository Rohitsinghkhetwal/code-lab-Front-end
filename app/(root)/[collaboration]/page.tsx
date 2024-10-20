"use client"
import { Room } from "@/app/Room";
import { CollaborativeEditor } from "@/components/CollaborativeEditor";
import useStore from "@/Store/Store";
import { useParams } from "next/navigation";




const Collaborations = () => {
  const { collaboration } = useParams();
  const {link, name} = useStore();

  const NormalRoomID = Array.isArray(collaboration) ? collaboration[0] : collaboration;

  // bring the username and userId to this component

  // if(!link || !name) {
  //   addUsertoRoom(link , name);
  // }




  
  return (
    <div className="relative min-h-screen min-w-full">
      <h1 className="text-[20px] px-[20px] py-[20px] font-bold text-slate-500">{name}</h1>
      
    
      <main>
      <Room roomId={NormalRoomID}> 

        <CollaborativeEditor/>

      </Room>
      </main>
    </div>
  );
};

export default Collaborations;
