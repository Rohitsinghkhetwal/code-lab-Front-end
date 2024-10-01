"use client"
import React, { useState } from 'react'

const NameComponent = () => {
  const [link, setlink] = useState<string>("");
  const [name, setname] = useState<string>("");



  const handleGenerateLink = () => {
    console.log("this is the join room link ", link)
    console.log("this is the name", name)
  }

  return (
    <div className='flex flex-col justify-center items-center w-full bg-violet-100 '>
      
      <div className='flex flex-col mt-8 w-auto'>
      <input
      placeholder='Ex xJhU7duv '
      value={link}
      onChange={(e) => setlink(e.target.value)}
      className='px-2 py-3 rounded border-1 bg-slate-300 w-full h-12 border-1 sm:w-96'
      />
      <p className='text-slate-400 text-5 py-2 font-bold' >Generate a link ?</p>
      </div>

      <div className='mt-3 px-16 w-auto'>
      <input
      placeholder='Ex Hayati '
      value={name}
      onChange={(e) => setname(e.target.value)}
      className='px-2 py-3 rounded border-1 bg-slate-300 w-full h-12 sm:w-96'
      />
      </div>


      <button onClick={handleGenerateLink} className='bg-slate-700 px-2 mx-4 py-2 font-semibold rounded text-white mt-3'>Join Room</button>
   

    </div>
  )
}

export default NameComponent