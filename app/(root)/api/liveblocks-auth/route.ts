
import { Liveblocks } from "@liveblocks/node";


import { NextRequest, NextResponse } from "next/server";
import {  getRoomDetail } from "../room";
import { User } from "lucide-react";

const liveblocks = new Liveblocks({

  secret: process.env.LIVEBLOCKS_SECRET_KEY!

});


export async function POST(request: NextRequest) {

  // const url = new URL(request.url)
  // const room = url.searchParams.get("roomId") 
  // console.log('this is the roomId', room)

  const roomId = 'yI70s1EGNqOi54qWEKOPwPUUn2HOfKk5eyaAhdxy'
 let getDetail = await getRoomDetail(roomId);
 console.log("this is getRoomDetail", getDetail);
 const res = getDetail.users;
 const User_info = res.map((items: any) => (items.userId));
 console.log("this is the ids", User_info);

 if(!User_info) {
  return new Response(JSON.stringify({error: "User info not found !"}), {
    status: 400,
  })
 }

 const userId = Math.floor(Math.random() * 10) % User_info.length;

  let session = liveblocks.prepareSession(`user-${User_info}`, {
    userInfo: {
      name: "Rohit",
      color: "red",
      picture:"https://liveblocks.io/avatars/avatar-1.png"
    }

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