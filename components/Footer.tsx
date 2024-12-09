import React from 'react'
import useStore from "../Store/Store"
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';


interface footerProps {
  type: 'mobile'| 'desktop'
}

const Footer = ({type='desktop'}:footerProps) => {
  const {users, Logout} = useStore();
  const router = useRouter();
  const Username = (users[0] as any)?.user;

  // logout functionality
  const handleLogout = async() => {
    try {
      const result = await Logout();
      router.push('/sign-in')
      toast.success("Logged Out Success")
      console.log("this is the result", result);

    }catch(err) {
      console.log("Something went wrong here !", err);
    }
  }
  return (
    <footer className='flex cursor-pointer items-center justify-between gap-2 py-6'>
      <div className={type === 'desktop' ? 'flex size-10 items-center justify-center bg-gray-600':'flex size-10 items-center justify-center rounded-full bg-gray-600 max-xl:hidden'}>
        {Username?.username[0]}
      </div>
      <div className={type == "mobile" ? 'flex flex-1 flex-col justify-center': 'flex-1 flex-col justify-center max-xl:hidden'}>
        <h2 className='text-slate-700 text-16 truncate font-bold'>
          {Username?.username}
        </h2>
        <p className='text-14 truncate font-normal text-slate-700'>
          {Username?.email}

        </p>

      </div>
      <div className='relative size-12 max-xl:w-full max-xl:flex max-xl:justify-center max-xl:items-center' onClick={handleLogout}>
        <Image
        src='icons/logout.svg'
        alt="logout"
        width={25}
        height={20}
        />

      </div>

    </footer>
  )
}

export default Footer