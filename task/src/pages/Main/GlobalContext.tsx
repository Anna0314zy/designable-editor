
import React from 'react';
interface GlobalProps {
    form:any
}

export const GlobalContext = React.createContext<GlobalProps>({form:null});