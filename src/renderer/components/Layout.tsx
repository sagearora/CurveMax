import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import packageJson from '../../../package.json';
import { useRootContext } from '../lib/RootContextProvider';
import { Button } from './ui/button';
import { Input } from './ui/input';
import SearchBar from './search/SearchBar';

const Layout = () => {

  const {
    user: {given_name},
    base_url,
    logout
  } = useRootContext()

  return (
    <div className=''>
      <header className='fixed left-0 top-0 w-full z-20 bg-white flex items-center p-2 space-x-2 shadow-lg border-b-2'>
        <Link to='/' className='block px-2 py-1'>
          <div className='flex items-center'>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path d="M11.983 1.907a.75.75 0 00-1.292-.657l-8.5 9.5A.75.75 0 002.75 12h6.572l-1.305 6.093a.75.75 0 001.292.657l8.5-9.5A.75.75 0 0017.25 8h-6.572l1.305-6.093z" />
            </svg>
            <p className='ml-1 font-bold'>
              CurveMax
            </p>
          </div>
        </Link>
        <div className='flex-1 text-right'>
          <SearchBar />
        </div>
        <div className='flex items-center'>
          <Button onClick={logout}>{given_name} (Log Out)</Button>
        </div>
      </header>
      <div className='px-4 py-24 min-h-screen'>
        <Outlet />
      </div>
      <footer className='py-2 border-t-2 fixed left-0 bottom-0 w-full z-20 bg-white'>
        <div className='container  flex justify-between'>
          <p>Built with ❤️ <strong>ARORA</strong>DENTAL &copy; {new Date().getFullYear()}</p>
          <p>v{packageJson.version}</p>
          <p>{base_url}</p>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
