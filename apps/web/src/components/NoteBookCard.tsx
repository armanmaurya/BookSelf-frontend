import React from 'react'

export const NoteBookCard = () => {
  return (
    <div className='flex flex-col rounded-lg font-serif'>
        <img style={{height: 320, width: 213}} src="https://images.unsplash.com/photo-1579158949482-3e9e0ac69333?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" className='rounded-lg'/>
        <h3 className='text-3xl py-2 pl-3'>Title</h3>
    </div>
  )
}
