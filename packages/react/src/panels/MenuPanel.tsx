import React from "react";
import { usePrefix } from "../hooks";
import {
    DesignerToolsWidget,
    ViewToolsWidget
} from '../widgets'
export interface IMenuPanelProps {
    children?: React.ReactNode;
}

export const MenuPanel: React.FC<IMenuPanelProps> = (props) => {
    const prefix = usePrefix("menu-panel");
    return (
        <div className={prefix + '-container'} {...props}>
            <div className={prefix + '-menu-container'} style={{display:'flex'}}>
                <DesignerToolsWidget/>
                {props.children}
                <ViewToolsWidget />
            </div>
            <div className={prefix + 'sub-menu-container'}>
                {props.children}
            </div>
        </div>
    );
}