"use client"
import useStore from '@/Store/Store';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { AddUserToRoom, checkUserLoggedInorNot } from '../api/room';


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
  const { CreateRoom , roomLink, users} = useStore();
  const hostId = users[0]?.user?._id;



  const router = useRouter();
  //this
  const [link, setLink] = useState<string>("");
  const [username, setUsername] = useState<string | null>(null);
  const [roomId, setRoomId] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(false);


  // check LoggedIn status

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
        const result = await AddUserToRoom(hostId, roomId, username)
        if(roomLink) {
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
      console.log("this is the room from handle create room", room);
        router.push(`/${room}`)
      // start from here 
      toast.success("Room created success !");
      
    }catch(err) {
      console.log("Something went wrong while creating the room")
      throw err
    }
  }


  const handleSubmit = () => {
    try{
      
      //logic
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