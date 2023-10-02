import React from 'react'
import RecareReport from './RecareReport'
import { Outlet } from 'react-router-dom'
import TodosProvider from '../../components/todos/TodosProvider'

function DashboardScreen() {
  return (
    <TodosProvider>
      <div className='px-4 py-16 flex h-screen items-stretch relative space-x-2'>
        <div className='w-1/3 overflow-y-auto'>
          <RecareReport />
        </div>
        <div className='sticky top-0 flex-1 overflow-y-auto rounded-md shadow-md border-2 p-4'>
          <Outlet />
        </div>
      </div>
    </TodosProvider>
  )
}

export default DashboardScreen