import AudioCall from '@/components/AudioCall'
import useStore from '@/Store/Store'
import React from 'react'

const Chats = () => {
  // pass the roomId , userId and username 
  // fix the roomId bug and store it to zustand store 
  const { users , roomLink} = useStore();
  console.log("this is the roomLink rom the chat", roomLink);
  console.log('users', JSON.stringify(users, null, 2))
  const userId = users[0].user?._id;
  console.log("jfjksjfls", userId)
  const name = null

  return (
    <div className='h-fit'>
      <AudioCall roomId={roomLink} userId={userId} username={name}/>
      
    </div>
  )
}

export default Chats