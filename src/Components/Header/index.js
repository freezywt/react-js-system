import { useContext } from 'react';
import { AuthContext } from '../../Contexts/auth';
import { Link } from 'react-router-dom';

import './header.css';

import profileimg from '../../Assets/avatar.png';

import { FiHome, FiUser, FiSettings, FiLogOut } from 'react-icons/fi';
import { MdWifiCalling2 } from 'react-icons/md';

export default function Header(){
    const { user, signOut } = useContext(AuthContext);

    return(
        <div className="sidebar">
            <div className="header-logo">
                <MdWifiCalling2 color="#fff" size={30} />
                <p>reactcall</p>
            </div>

            <Link to="/dashboard">
                <FiHome size={24}/>
                Called
            </Link>

            <Link to="/customers">
                <FiUser size={24}/>
                Customers
            </Link>

            <Link to="/profile">
                <FiSettings size={24}/>
                Settings
            </Link>

            <div className="profile-div">
                <img src={user.avatarUrl === null ? profileimg : user.avatarUrl} alt="profile image"/>
                <button className="logoutbtn" onClick={() => signOut()}><FiLogOut color='#fff' /></button>
            </div>
        </div>
    )
}