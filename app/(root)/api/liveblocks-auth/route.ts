import { Liveblocks } from "@liveblocks/node";


import { NextRequest } from "next/server";
import {  getRoomDetail } from "../room";
import useStore from "@/Store/Store";




const liveblocks = new Liveblocks({

  secret: process.env.LIVEBLOCKS_SECRET_KEY!

});

let session;

export async function POST(request: NextRequest) {

  // const { searchParams } = new URL(request.url);
  // const roomID = searchParams.get("roomId");
  // console.log("Recieved RoomId", roomID);

  // //fetch the api of getalll user of room in this component and display the presence of a user 
  // // USER_INFO

  // Get the current user's unique id from your database

  const userId = Math.floor(Math.random() * 10) % USER_INFO.length;


  // Create a session for the current user

  // userInfo is made available in Liveblocks presence hooks, e.g. useOthers

 session = liveblocks.prepareSession(`user-${userId}`, {

    userInfo: USER_INFO[userId],

  });


  // Use a naming pattern to allow access to rooms with a wildcard

  session.allow(`*`, session.FULL_ACCESS);


  // Authorize the user and return the result

  const { body, status } = await session.authorize();
  console.log('body', JSON.stringify(body, null, 2))
  console.log('status', JSON.stringify(status, null, 2))
  console.log('session', JSON.stringify(session, null, 2))

  return new Response(body, { status });

}
console.log('session', JSON.stringify(session, null, 2))


const USER_INFO = [

  {

    name: "Charlie Layne",

    color: "#D583F0",

    picture: "https://liveblocks.io/avatars/avatar-1.png",

  },

  {

    name: "Mislav Abha",

    color: "#F08385",

    picture: "https://liveblocks.io/avatars/avatar-2.png",

  },

  {

    name: "Tatum Paolo",

    color: "#F0D885",

    picture: "https://liveblocks.io/avatars/avatar-3.png",

  },

  {

    name: "Anjali Wanda",

    color: "#85EED6",

    picture: "https://liveblocks.io/avatars/avatar-4.png",

  },

  {

    name: "Jody Hekla",

    color: "#85BBF0",

    picture: "https://liveblocks.io/avatars/avatar-5.png",

  },

  {

    name: "Emil Joyce",

    color: "#8594F0",

    picture: "https://liveblocks.io/avatars/avatar-6.png",

  },

  {

    name: "Jory Quispe",

    color: "#85DBF0",

    picture: "https://liveblocks.io/avatars/avatar-7.png",

  },

  {

    name: "Quinn Elton",

    color: "#87EE85",

    picture: "https://liveblocks.io/avatars/avatar-8.png",

  },

];