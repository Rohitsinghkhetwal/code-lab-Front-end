
import { Liveblocks } from "@liveblocks/node";


import { NextRequest, NextResponse } from "next/server";
import {  getRoomDetail } from "../room";


const liveblocks = new Liveblocks({

  secret: process.env.LIVEBLOCKS_SECRET_KEY!

});


export async function POST(request: NextRequest) {

  // const Room = await request.json();
  // const { roomLink } = Room;

  //console.log("this is the roomLink", roomLink)
  const roomLINK = await request.json();
  
  const { room } = roomLINK 

  if(!room) {
    return NextResponse.json(
      {
        error: "roomLink is required"
      },
      {
        status: 400,
      }
    )
  }



 const getDetail = await getRoomDetail(room);
 const res = getDetail.users;
 const User_info = res.map((items: any) => (items.username));

 if(!User_info) {
  return new Response(JSON.stringify({error: "User info not found !"}), {
    status: 400,
  })
 }

 const userId = Math.floor(Math.random() * User_info.length);

  const session = liveblocks.prepareSession(`user-${User_info[userId]}`, {
    userInfo: {
      name: User_info[userId],
      color: "#D583F0",
      picture:"https://liveblocks.io/avatars/avatar-1.png"
    }
    // userInfo: User_info[userId]

  });


  session.allow(`*`, session.FULL_ACCESS);


  const { body, status } = await session.authorize();
  return new Response(body, { status });

}
