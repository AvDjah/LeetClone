import React from "react";

export const Navbar = (props : { items : string[], selectedTab : number, setTab  : React.Dispatch<React.SetStateAction<number>> }) => {

    return (
        <div className="mx-2 p-4">
            <nav>

                { props.items.map((item,index) => {
                    return <span key={index} onClick={() => {
                        props.setTab(index)
                    }}
                        className="hover:text-blue-400 text-white rounded-lg border-blue-500 mx-4 inline-block p-2 transition-all ease-in-out active:translate-y-0.5 cursor-pointer text-lg"
                    >{item}</span>
                }) }

                {/*<span*/}
                {/*    className="hover:text-blue-400 text-white rounded-lg border-blue-500 mx-4 inline-block p-2 transition-all ease-in-out active:translate-y-0.5 cursor-pointer text-lg">Home</span>*/}
                {/*<span*/}
                {/*    className="hover:text-blue-400 text-white rounded-lg border-blue-500 mx-4 inline-block p-2 transition-all ease-in-out active:translate-y-0.5 cursor-pointer text-lg ">Problems</span>*/}
                {/*<span*/}
                {/*    className="hover:text-blue-400 text-white rounded-lg border-blue-500 mx-4 inline-block p-2 transition-all ease-in-out active:translate-y-0.5 cursor-pointer text-lg ">About</span>*/}
                {/*<span*/}
                {/*    className="hover:text-blue-400 text-white rounded-lg border-blue-500 mx-4 inline-block p-2 transition-all ease-in-out active:translate-y-0.5 cursor-pointer text-lg ">My Profile</span>*/}
            </nav>
        </div>
    )
}