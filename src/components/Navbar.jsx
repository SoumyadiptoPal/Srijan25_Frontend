import { useEffect, useState } from 'react'
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import toast from "react-hot-toast";
import { redirect, useNavigate } from 'react-router-dom';

const notify = () => toast("Coming soon!");

function Navbar() {

  const [navbarOpen, setNavbarOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [pathname, setPathname] = useState((window.location.pathname).slice(1));
  const navigate = useNavigate();

  useEffect(() => {
    setPathname((window.location.pathname).slice(1));
  }, [window.location.pathname]);

  useEffect(() => {
    const userID = localStorage.getItem("sid");
    if (userID !== null && userID !== "") setLoggedIn(true);
  }, []);

  return (
    <nav className='sticky top-0 grid grid-cols-7 sm:grid-cols-5 w-full border-b border-b-greyBorder bg-background z-[200]'>
      <div className='flex justify-around p-3'>
        <a href='/' className='hidden sm:block'>
          <img src='/srijan-logo-white.svg' alt="Srijan Logo" width="auto" height="auto" />
        </a>
        <a href='/' className='hidden sm:block'>
          <img src='/fetsu-presents-srijan25.svg' alt="Srijan Text Logo" width="auto" height="auto" />
        </a>
      </div>
      <div className='col-span-5 sm:col-span-3 text-center p-2 sm:p-0 flex items-center justify-around border-r border-r-greyBorder border-l-greyBorder border-l text-xl'>
        <a href='/' className='sm:hidden'>
          <img src='/srijan-logo-white.svg' alt="Srijan Logo" width="auto" height="auto" />
        </a>
        <a href='/' className='sm:hidden'>
          <img src='/fetsu-presents-srijan25.svg' alt="Srijan Text Logo" width="auto" height="auto" />
        </a>

        <a href='/events' className={`relative hidden sm:block w-fit`}>Events
          <div className={`absolute h-[2px] bg-gradient-to-l from-red to-purple bottom-0 ${pathname == "events" ? 'w-full' : 'w-0'}`}></div>
        </a>
        <a href='/merchandise' className={`relative hidden sm:block w-fit`}>Merchandise
          <div className={`absolute h-[2px] bg-gradient-to-l from-red to-purple bottom-0 ${pathname == "merchandise" ? 'w-full' : 'w-0'}`}></div>
        </a>
        <a className={`relative hidden sm:block w-fit cursor-pointer`} href="/notifications">Notifications
          <div className={`absolute h-[2px] bg-gradient-to-l from-red to-purple bottom-0 ${pathname == "notifications" ? 'w-full' : 'w-0'}`}></div>
        </a>
        <a href="/accommodation" className={`relative hidden sm:block w-fit`}>Accommodation
          <div className={`absolute h-[2px] bg-gradient-to-l from-red to-purple bottom-0 ${pathname == "accommodation" ? 'w-full' : 'w-0'}`}></div>
        </a>
      </div>
      <div className='grid place-items-center text-xl'>
        <a href={`${loggedIn ? '/dashboard' : '/login'}`} className='hidden relative sm:block'> {loggedIn ? 'Dashboard' : 'Login'}
          <div className={`absolute h-[2px] bg-gradient-to-l from-red to-purple bottom-0 ${pathname == "dashboard" || pathname == "login" || pathname == "signup" ? 'w-full' : 'w-0'}`}></div>
        </a >
        <button className='sm:hidden' onClick={() => {
          setNavbarOpen(true);
        }}><MenuIcon /></button>
      </div >
      <nav
        className={`bg-background transition-all duration-700 z-[200] p-6 pt-10 fixed flex flex-col items-center gap-y-12 right-0 left-0 shadow-2xl shadow-hray-800/60 ${navbarOpen ? `bottom-0 top-0` : `bottom-[100%] -top-[100%]`
          }`}>
        <button className={`absolute top-12 right-8 text-xl ${navbarOpen ? '' : 'hidden'}`} onClick={() => {
          setNavbarOpen(false);
        }}><CloseIcon /></button>
        <div className={`flex flex-col gap-y-6 transition-all duration-100 w-4/5`}>
          <div className='flex justify-around w-full pl-6'>
            <img src='/srijan-logo-white.svg' alt="Srijan Logo" width="auto" height="auto" />
            <img src='/fetsu-presents-srijan25.svg' alt="Srijan Text Logo" width="auto" height="auto" />
          </div>
          <a href='/' className='text-left border-greyBorder/30 border-b w-full py-1'>Home</a>
          <a href='/events' className='text-left border-greyBorder/30 border-b w-full py-1'>Events</a>
          <a href='/notifications' className='text-left border-greyBorder/30 border-b w-full py-1'>Notifications</a>
          <a href='https://docs.google.com/forms/d/e/1FAIpQLSe-zoCeE50FR2dUzauh7wfvHxfHczPwgziqYhRju2zMLH164A/viewform' className='text-left border-greyBorder/30 border-b w-full py-1'>Campus Ambassadors</a>
          <a href='/workshop' className='text-left border-greyBorder/30 border-b w-full py-1'>Workshop</a>
          <a href='/accommodation' className='text-left border-greyBorder/30 border-b w-full py-1'>Accommodation</a>
          <a href='/merchandise' className='text-left border-greyBorder/30 border-b w-full py-1'>Merchandise</a>
          <a href={`${loggedIn ? '/dashboard' : '/login'}`} className='text-left border-greyBorder/30 border-b w-full py-1'>{loggedIn ? 'Dashboard' : 'Login'}</a>
        </div >
      </nav >
    </nav >
  )
}

export default Navbar
