"use client"
import { useEffect } from "react";
import { io } from "socket.io-client";
import file from "./file"
export default function Home() {
  const socket = io("http://localhost:9000")

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket is connected !", socket.id)
    })

    socket.on("welcome", (s) => {
      console.log(s)
    })
  },[])

 
 
  return (
   <div>
    <file/>

   </div>
  );
}
