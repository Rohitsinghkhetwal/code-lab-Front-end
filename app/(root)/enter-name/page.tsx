"use client"
import useStore from '@/Store/Store';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { AddUserToRoom, checkUserLoggedInorNot, createRoom } from '../api/room';


const NameComponent = () => {

  // fisrt I have to call the createRoom api and then i will get the room link from backend and then I have to send the userid and username to backend 
  // show that user is logged in or not 
  // if user is logged in we will generate the roomID through backend 
  // and userId that will come from zustand of loggedin User
  // and if user is not logged in we will ask the name of the user nad the give it roomId 
  // AND THEN MEETING WILL BE JOINED 
  // how to update presence we will hit the getall user api and then we will pass to the api/auth component and then it should work fine   
  //hostId id of the user if loggedIn username name of the user
  // roomId id in prams 
  
  // if user is logged in join the room Immediately
  // if it is no loggedIn ask him name
  const { CreateRoom , roomLink, users} = useStore()
  console.log("this is the roomLink", roomLink)
  const hostId = users[0].user?._id;



  const router = useRouter();
  //this
  const [link, setLink] = useState<string>("");
  const [username, setusername] = useState<string | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(false);

  // const handleCopyLink = () => {
  //   if(link) {
  //     navigator.clipboard.writeText(link)
  //   .then(() =>{
  //     toast.success("Link copied")
  //   })
  //   .catch((err) => {
  //     console.error("Failed to copy link "), err
  //   })
  //   }
  // }

  // check LoggedIn status

  const loggedInStatus = async() => {
    const checkUser = checkUserLoggedInorNot();
    const res = checkUser?.data?.LoggedIn;
    setIsUserLoggedIn(res);
    return res;
  }





  const joinRoom = async() => {
    try {

      const isLoggedIn = await loggedInStatus();

      if(isLoggedIn) {
        const result = await AddUserToRoom(hostId, roomLink, username)
        if(roomLink) {
          toast.success("Joining the room ...")
        }else {
          toast.error("Error...")
        }
        router.push(`/${roomLink}`)
      }else {
        setIsModalOpen(true)

      }
 

    }catch(err) {
      console.log("something went wrong while joining the room")
    }
  
    
  }

  const handleCreateRoom = async() => {
    try {
      const room = await CreateRoom();
      if(!roomLink) {
        toast.error("Error")
      }else {
        router.push(`/${roomLink}`)
      }
      
      // start from here 
      toast.success("Room created success !");
      
    }catch(err) {
      console.log("Something went wrong while creating the room")
      throw err
    }
  }


  return (
   
    <div className='flex flex-col justify-center items-center w-full bg-violet-100 '>

      <button className='bg-slate-500 px-4 py-2 text-white my-4 rounded' onClick={() => handleCreateRoom()}>
        Create Room
      </button>

      <button className='bg-slate-500 px-4 py-2 text-white rounded' onClick={() => joinRoom()}>
        Join Room
      </button>

    </div>
  
  )
}

export default NameComponent