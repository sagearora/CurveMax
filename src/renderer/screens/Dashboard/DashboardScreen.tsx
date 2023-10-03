import React from 'react'
import { Outlet } from 'react-router-dom'
import RecareReport from './RecareReport'

function DashboardScreen() {
  return (
    <div className='flex h-full items-stretch relative'>
      <div className='w-1/3 pr-4 overflow-y-auto'>
        <RecareReport />
      </div>
      <div className='sticky top-24 right-0 w-2/3 h-[84vh] overflow-y-auto rounded-md shadow-md border-2 p-4'>
        <Outlet />
      </div>
    </div>
  )
}

export default DashboardScreen