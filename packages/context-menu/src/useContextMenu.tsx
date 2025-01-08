import React, { useContext } from 'react'
import { MenuContext, MenuContextType } from './MenuProvider';

export const useContextMenu = <T,>() => {
    return useContext(MenuContext) as MenuContextType<T>;
}
