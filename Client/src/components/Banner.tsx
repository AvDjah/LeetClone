import {Navbar} from "./Navbar.tsx";
import React from "react";

export const Banner = (props : { items : string[], selectedTab : number, setTab : React.Dispatch<React.SetStateAction<number>> }) => {
    return (
        <div>
            <div className="text-5xl font-poppins text-white font-mono p-2 m-2">SheetCode</div>
            <Navbar setTab={props.setTab} items={props.items} selectedTab={props.selectedTab}/>
        </div>
    )
}