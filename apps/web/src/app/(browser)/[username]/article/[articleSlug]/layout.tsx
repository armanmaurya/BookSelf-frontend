import React from 'react'

const Layout = ({
    children
}: {
    children: React.ReactNode
}
) => {
    return (
        <div className='mx-2 pt-2'>
            {children}
        </div>
    )
}

export default Layout;