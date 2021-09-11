import React, {useState} from 'react';
import {Link} from "react-router-dom";
import { FaBars } from 'react-icons/fa';
import { AiOutlineClose } from 'react-icons/ai';
import './sidebar.css';
import { IconContext } from "react-icons";
import {AiOutlinePlus} from "react-icons/ai";
import {AiOutlineQuestionCircle} from "react-icons/ai";
import {jumpState} from "./game";

function TopBar(props) {
    return (
        <div className={props.isSidebarShown ? 'top-bar active' : 'top-bar'}>
            {!props.isSidebarShown ?
                <Link to="/" className='menu-button' onClick={props.showSidebar}>
                    <FaBars/>
                </Link>
                : ''
            }
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

function SidebarNewGame(props) {
    return (
        <li key='0' className='nav-text'>
            <Link to='/' onClick={() => {
                props.showSidebar();
                props.jumpToState(jumpState.START);
                }
            }>
                <AiOutlinePlus />
                <span>New game</span>
            </Link>
        </li>
    )
}

function About(props) {
    return (
        <li key='3' className='nav-text'>
            <Link to='/about' onClick={props.showSidebar}>
                <AiOutlineQuestionCircle />
                <span>About</span>
            </Link>
        </li>
    )
}

function Sidebar(props) {
    const  [sidebar, setSidebar] = useState(false);
    const showSidebar = () => setSidebar(!sidebar);

    return (
        <>
            <IconContext.Provider value={{className:'icons'}}>
                <TopBar isSidebarShown={sidebar} nextPlayer={props.nextPlayer} showSidebar={showSidebar} />
                <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
                    <ul className='nav-menu-items' >
                        <SidebarCloseButton showSidebar={showSidebar} />
                        <SidebarNewGame showSidebar={showSidebar}
                                        jumpToState={props.jumpToState}/>
                        {props.historyData.map((item, index) => {
                            return (
                                <li key={index} className={item.cName}>
                                    <Link to={item.path} onClick={() => props.jumpToState(item.state) }>
                                        {item.icon}
                                        <span>{item.title}</span>
                                    </Link>
                                </li>
                            )
                        })}
                        <About showSidebar={showSidebar} />

                    </ul>
                </nav>
            </IconContext.Provider>
        </>
        );
}

export default Sidebar;