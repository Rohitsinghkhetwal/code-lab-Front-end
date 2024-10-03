"use client"
import useStore from '@/Store/Store';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';


const NameComponent = () => {

  const router = useRouter();


  const {createRoom,rooms} = useStore();
  const [link, setlink] = useState<string>("");
  const [name, setname] = useState<string>("");
  console.log("hjhjhjhjh",rooms)



  const handleRandomLink = () => {
    const randomString = [...Array(6)]
    .map(() => Math.random().toString(36).substring(2, 15))
    .join("");
    console.log("this is a random string", randomString)
    return randomString
  }

  const joinRoom = async() => {
    try {
      const result = await createRoom(link);
      if(result) {
        router.push("/collaboration")
        toast.success("Joined the room");
      }
      console.log("hjhjhjhjh",rooms)
    }catch(err) {
      console.log("error creating the room ", err);
      throw err;

    }
    // first I have to fetch the api of create room and then 
    // pass the returnd id to roomprovider 
    // and then navigate to room and store the user info to database
    // joined user will be host of the meeting and then make the role to the Host 
    // make the avatar ui good

  }

  const handleGenerateLink = () => {
    const newlink = handleRandomLink();
    setlink(newlink);
  }

  const handleCopyLink = () => {
    if(link) {
      navigator.clipboard.writeText(link)
    .then(() =>{
      toast.success("Link copied")
    })
    .catch((err) => {
      console.error("Failed to copy link "), err
    })
    }
  }

  return (
    <div className='flex flex-col justify-center items-center w-full bg-violet-100 '>


      <h1 className='font-bold text-slate-500 text-[20px]'>Enter the Room </h1>
    
      
      <div className='flex flex-row mt-8 w-auto'>
      <input
      placeholder='Ex xJhU7duv '
      value={link}
      readOnly
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
      <p className='text-slate-400 text-5 py-2 font-bold cursor-pointer' onClick={handleGenerateLink}>Generate a link ?</p>

      <div className='mt-3 px-16 w-auto'>
      <input
      placeholder='Ex Hayati '
      value={name}
      onChange={(e) => setname(e.target.value)}
      className='px-2 py-3 rounded border-1 bg-slate-300 w-full h-12 sm:w-96'
      />
      </div>


      <button onClick={joinRoom} className='bg-slate-700 px-2 mx-4 py-2 font-semibold rounded text-white mt-3'>Join Room</button>
   

    </div>
  )
}

export default NameComponent