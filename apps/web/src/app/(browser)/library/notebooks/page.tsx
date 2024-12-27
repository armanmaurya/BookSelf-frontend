import React from 'react'
import { NoteBookCard } from '@/components/NoteBookCard';

const Page = () => {
    return (
        <div className='overflow-y-auto h-full'>
            
            <div className='pt-4 grid grid-cols-6 gap-4'>
                <NoteBookCard />
                <NoteBookCard />
                <NoteBookCard />
                <NoteBookCard />
                <NoteBookCard />
                <NoteBookCard />
                <NoteBookCard />
                <NoteBookCard />
            </div>
        </div>
    )
}

export default Page;