import React, {useState} from 'react';
import {Link} from "react-router-dom";
import { FaBars } from 'react-icons/fa';
import { AiOutlineClose } from 'react-icons/ai';
import './sidebar.css';
import { IconContext } from "react-icons";
import {RiRestartLine} from "react-icons/ri";

function TopBar(props) {
    return (
        <div className="top-bar">
            <Link to="#" className='menu-button' onClick={props.showSidebar}>
                <FaBars/>
            </Link>
            {props.nextPlayer}
        </div>
    );
}

function SidebarCloseButton(props) {
    return (
        <li className='menu-button-close'>
            <Link to="#" className='menu-button' onClick={props.showSidebar}>
                <AiOutlineClose />
            </Link>
        </li>
    );
}

function SidebarNewGame() {
    return (
        <li key='0' className='nav-text'>
            <Link to='/new-game'>
                <RiRestartLine />
                <span>New game</span>
            </Link>
        </li>
    )
}

function Sidebar(props) {
    const  [sidebar, setSidebar] = useState(false);
    const showSidebar = () => setSidebar(!sidebar);

    return (
        <>
            <IconContext.Provider value={{ color: 'fff'}}>
                <TopBar nextPlayer={props.nextPlayer} showSidebar={showSidebar} />
                <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
                    <ul className='nav-menu-items' >
                        <SidebarCloseButton showSidebar={showSidebar} />
                        <SidebarNewGame />
                        {props.historyData.map((item, index) => {
                            return (
                                <li key={index} className={item.cName}>
                                    <Link to={item.path}>
                                        {item.icon}
                                        <span>{item.title}</span>
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                </nav>
            </IconContext.Provider>
        </>
        );
}

export default Sidebar;