import React from 'react'

const Layout = ({
    children
}: {
    children: React.ReactNode
}
) => {
    return (
        <div className=''>
            {children}
        </div>
    )
}

export default Layout;