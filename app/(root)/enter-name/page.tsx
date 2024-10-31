"use client"
import useStore from '@/Store/Store';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { createRoom } from '../api/room';


const NameComponent = () => {

  // fisrt I have to call the createRoom api and then i will get the room link from backend and then I have to send the userid and username to backend 
  // show that user is logged in or not 
  // if user is logged in we will generate the roomID through backend 
  // and userId that will come from zustand of loggedin User
  // and if user is not logged in we will ask the name of the user nad the give it roomId 
  // AND THEN MEETING WILL BE JOINED 
  // how to update presence we will hit the getall user api and then we will pass to the api/auth component and then it should work fine   


  const router = useRouter();
  const [link, setLink] = useState<string>("")

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

  const handleCreateRoom = async() => {
    try {
      const room = await createRoom();
      console.log('this is the rooom ', JSON.stringify(room, null, 2))
      const getRoomLink = room?.data?.result?.link;
      setLink(getRoomLink);
      router.push(`/${link}`)
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

      <button className='bg-slate-500 px-4 py-2 text-white rounded'>
        Join Room
      </button>


      {/* <h1 className='font-bold text-slate-500 text-[20px]'>Enter the Room </h1> */}
    
      
      {/* <div className='flex flex-row mt-8 w-auto'>
      <input
      placeholder='Ex xJhU7duv '
      value={link}
      onChange={(e) => setlink(e.target.value)}
      
      className='px-2 py-3 rounded border-1 bg-slate-300 w-full h-12 border-1 sm:w-96'
      />
      {
        link && (
          <button
          onClick={handleCopyLink}
          className='bg-slate-700 px-3 py-2 rounded text-white h-12 mx-2 text-white font-bold'
        >
          Copy
        </button>

        )
      }
      
     
      </div>
      <p className='text-slate-400 text-5 py-2 font-bold cursor-pointer' onClick={handleGenerateLink}>Generate a link ?</p> */}

      {/* <div className='mt-3 px-16 w-auto'>
      <input
      placeholder='Ex Hayati '
      value={name}
      onChange={(e) => setname(e.target.value)}
      className='px-2 py-3 rounded border-1 bg-slate-300 w-full h-12 sm:w-96'
      />
      </div> */}


      {/* <button onClick={joinRoom} className='bg-slate-700 px-2 mx-4 py-2 font-semibold rounded text-white mt-3'>Join Room</button>
    */}

    </div>
  
  )
}

export default NameComponent