"use client"
import useStore from '@/Store/Store';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { AddUserToRoom, checkUserLoggedInorNot } from '../api/room';


const NameComponent = () => {
  const { CreateRoom , users, updateRoomLink:updateLink } = useStore();
  const hostId = (users[0] as any)?.user?._id;



  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  const [roomId, setRoomId] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(false);


  const loggedInStatus = async() => {
    const checkUser = await checkUserLoggedInorNot();
    const res = checkUser?.data?.LoggedIn;
    setIsUserLoggedIn(res);
    return res;
  }



  const joinRoom = async() => {
    try {

      const isLoggedIn = await loggedInStatus();
      console.log('isLoggedIn', JSON.stringify(isLoggedIn, null, 2))
      setIsModalOpen(true);

      if(isLoggedIn && roomId) {
        await AddUserToRoom(hostId, roomId, username)
        if(roomId) {
          updateLink(roomId)
          toast.success("Joining the room ...")
        }
        router.push(`/${roomId}`)
      }

    }catch(err) {
      console.log("something went wrong while joining the room");
      toast.error("Something went wrong while creating the room ")
    }
  
    
  }


  const handleCreateRoom = async() => {
    try {
      const room = await CreateRoom();
        router.push(`/${room}`)
      toast.success("Room created success !");
      
    }catch(err) {
      console.log("Something went wrong while creating the room")
      throw err
    }
  }


  const handleSubmit = () => {
    try{
      if(!roomId) {
        toast.error("Please Enter the roomID..")
        return;
      }

      if(isUserLoggedIn) {
        joinRoom();
      }else {
        if(!username) {
          toast.error("Please Enter your Username !");
          return;
        }
        joinRoom();
      }

    }catch(err) {
      toast.error("Something wrong while submitting ....")
      console.log("something went wrong here !")
    }
  }

  useEffect(() => {
    const auth = async() => {
      try {
        const response = await checkUserLoggedInorNot();
        const loginStatus = response?.data?.LoggedIn;

        if(!loginStatus) {
          toast.success("Sign in first");
          router.replace("/sign-in")
        }
      }catch(err) {
        console.log("something went wrong ", err);
        router.replace("/sign-in");
      }
    }
    auth();
  },[router])



  return (
   
    <div className='flex flex-col justify-center items-center w-full bg-violet-100 '>

      <button className='bg-slate-500 px-4 py-2 text-white my-4 rounded' onClick={() => handleCreateRoom()}>
        Create Room
      </button>

      <button className='bg-slate-500 px-4 py-2 text-white rounded' onClick={() => joinRoom()}>
        Join Room
      </button>


      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full space-y-4">
            <h3 className="text-2xl font-semibold text-gray-800">{isUserLoggedIn ? 'Enter Room ID' : 'Enter Username'}</h3>

            {/* Room ID Input */}
            {
              isUserLoggedIn ? (
                <input
                type="text"
                value={roomId || ""}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="Enter Room ID"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              ): (
                <input
                type="text"
                value={username || ""}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter Username"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              )
            }

            <div className="flex justify-between">
              <button
                onClick={handleSubmit}
                className="w-full py-2 px-4 bg-slate-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Join Room
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full py-2 px-4 mx-2 bg-red-400 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  
  )
}

export default NameComponent