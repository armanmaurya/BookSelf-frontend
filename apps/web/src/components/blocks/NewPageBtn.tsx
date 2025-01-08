import React, { useState } from 'react'

export const NewPageBtn = ({ onCreate }: {
    onCreate: (title:string) => void
}) => {
    const [title, setTitle] = useState("");
    return (
        <div>
            <div className="flex justify-between items-center p-4">
                <h1>Create New Page</h1>
            </div>
            <div className="p-4">
                <input
                    type="text"
                    placeholder="Page Title"
                    className="w-full p-2 border border-gray-300 rounded"
                />
                <button
                    onClick={() => {
                        onCreate(title);
                    }}
                    className="w-full p-2 bg-blue-500 text-white rounded mt-2"
                >
                    Create
                </button>
            </div>
        </div>
    )
}
