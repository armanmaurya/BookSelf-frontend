"use client";
import React from 'react'
import { Divide as Hamburger } from 'hamburger-react'

import { useContext } from 'react';
import { AppContext } from './SideBarContext';

const HamburgerIcon = () => {
    const sideBarState = useContext(AppContext);
    console.log("context", sideBarState)
  return (
    <div>
        {sideBarState && (
            <Hamburger size={20} toggled={sideBarState.isOpen} toggle={sideBarState.setIsOpen}/>
        )}
    </div>
  )
}

export default HamburgerIcon