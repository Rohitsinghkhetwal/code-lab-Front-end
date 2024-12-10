"use client"
import AudioCall from '@/components/AudioCall'
import useStore from '@/Store/Store'
import React from 'react'

const Chats = () => {
  const { users , roomLink} = useStore();
  console.log('users', JSON.stringify(users, null, 2))
  const userId = users[0]?.user?._id;
  const name = null

  return (
    <div className='h-fit'>
      <AudioCall roomId={roomLink} userId={userId} username={name}/>
      
    </div>
  )
}

export default Chats