import AudioCall from '@/components/AudioCall'
import useStore from '@/Store/Store'
import React from 'react'

const Chats = () => {
  // pass the roomId , userId and username 
  // fix the roomId bug and store it to zustand store 
  const { users , roomLink} = useStore();
  console.log("this is the roomLink rom the chat", roomLink);
  console.log("this is the user ", users);

  return (
    <div className='h-fit'>
      {/* <AudioCall/> */}
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus labore cumque adipisci consequatur placeat, aliquid minus accusamus, quia sit amet quasi voluptate eum.</p>
      
    </div>
  )
}

export default Chats