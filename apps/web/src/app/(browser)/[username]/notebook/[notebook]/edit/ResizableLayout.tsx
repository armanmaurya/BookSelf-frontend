import { NavigationSideBar } from '@/components/blocks/NavigationSideBar'
import React from 'react'

export const ResizableLayout = ({
    children
}: {
    children: React.ReactNode
}) => {
    return (
        <div>
            <div>
                <NavigationSideBar />
            </div>
            <div>
                {children}
            </div>
        </div>
    )
}
