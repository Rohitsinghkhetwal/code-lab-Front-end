"use client"
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function Home() {
  const [message, setMessage] = useState('');
  const [chat, setchat] = useState<any>([]);
  const socket = io("http://localhost:9000")

  

  const SendData = (e:any) => {
    e.preventDefault();
    socket.emit('chat', {message})
    setMessage('');
  }

  useEffect(() => {
    socket.on("chat", (payload) => {
      setchat([...chat, payload]);
    })
  },[])

 
 
  return (
   <div className="flex items-center justify-center p-[200px] flex-col"> 
   <h3 className="text-xl font-bold">Chats</h3>
   {chat.map((chats:any, ind:any) => (
    <div className="bg-slate-200 font-bold flex flex-col" key={ind}>
      {chats.message}

    </div>
  ))}
    <form onSubmit={SendData}>
      <input
      type='text'
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      name="chat"
      placeholder="Enter the message"
      className="p-[30px] bg-slate-300 rounded font-bold"
      />
      <button type="submit" className="p-5 font-bold bg-slate-500 m-5 rounded">Send</button>
    </form>
   
   </div>
  );
}
