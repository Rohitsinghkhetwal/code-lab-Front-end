"use client";
import { Room } from "@/app/Room";
import { CollaborativeEditor } from "@/components/CollaborativeEditor";
import { useParams } from "next/navigation";
import useStore from "@/Store/Store";
import Chats from "../chats/page";

const Collaborations = () => {
  const { collaboration } = useParams();

  const NormalRoomID = Array.isArray(collaboration)
    ? collaboration[0]
    : collaboration;

    const { users , roomLink} = useStore();
    console.log('users', JSON.stringify(users, null, 2))
    const userId = users[0]?.user?._id;
    const name = null

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full ">
      <main className="flex-1 bg-black-200 w-full lg:w-[60%] order-1 lg:order-none">
        <Room roomId={NormalRoomID}>
          <CollaborativeEditor />
        </Room>
      </main>

      <aside className="w-full lg:w-[26%] p-4 border-t lg:border-t-0 lg:border-l order-2">
        <Chats roomId={roomLink} userId={userId} name={name}/>
      </aside>

    </div>
  );
};

export default Collaborations;
