/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import Sidebar from '../layouts/sidebar';
import { toast } from 'react-hot-toast';
import { signOut } from "firebase/auth";
import { auth } from '../firebase/firebase';
import { onAuthStateChanged } from "firebase/auth";

const Navbar = props => {
    const [theme, setTheme] = React.useState(false)
    const Theme = () => {
        document.body.classList.toggle('light-mode');
        localStorage.setItem('theme', `${!theme}`)
        setTheme(!theme)
    }
    React.useEffect(() => {
        if (localStorage.getItem('theme') === 'true') {
            setTheme(localStorage.getItem('theme'))
            document.body.classList.add('light-mode');
        }
    })
    const [active, setActive] = React.useState(false);
    const [name, setName] = React.useState(null);
    const [uid, setUid] = React.useState(null);
    const [photoURL, setPhoto] = React.useState("https://images.unsplash.com/photo-1600353068440-6361ef3a86e8?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80");
    const navigate = useNavigate();
    const logout = () => {
        signOut(auth).then(() => {
            toast('Seccion cerrada buen viaje!', {
                icon: '🙋‍♂️',
            });
        }).then(() => {
            navigate('/');
        })
            .catch((error) => {
                toast.error(error);
            });
    }
    const MenuWarrep = (e) => {
        e.preventDefault();
        const menu = document.getElementById(`contextMenuPrincipal`);
        const ul = document.getElementById('ulPrincipal');
        ul.style.width = '160px';
        menu.classList.add('is-active');
        menu.style.transform = `translatey(-40vh)`;
        menu.style.zIndex = '99';
        menu.style.left = e.pageX + "px";
        menu.style.top = e.pageY + "px";
    }
    React.useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setName(user.displayName);
                setPhoto(user.photoURL);
                setUid(user.uid);
                localStorage.setItem('uid', user.uid);
                // const emailVerified = user.emailVerified;
            }
        });
    }, [])
    return (
        <>
            <div className="dark-light" onClick={Theme}>
                <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" /></svg>
            </div>
            <div className='app rekpa'>
                {/* <i className="fa-solid fa-chart-simple"></i> Analisis  */}
                <nav className="header rjii">
                    <div className="menu-circle"></div>
                    {uid === null ? ('') : (
                        <>
                            <div className="header-menu">
                                <NavLink className="menu-link" to='/Analisis'><i className="fa-solid fa-house"></i> Inicio</NavLink>
                                <NavLink className="menu-link notify" to='/Proyectos'> <i className="fa-solid fa-sliders"></i> Proyectos</NavLink>
                                <NavLink className="menu-link" to='/Cuenta'><i className="fa-solid fa-user-gear"></i> Mi Cuenta</NavLink>
                                {/* <NavLink className="menu-link notify" to='/Configuracion'><i className="fa-solid fa-gear"></i> Configuracion</NavLink> */}
                            </div>
                            <div className={`sidenav ${active ? 'active' : ''}`} onClick={() => setActive(!active)}>
                                <span className="btn"><i className="fa-solid fa-bars fa-2x"></i></span>
                                <div className="items">
                                    <ul>
                                        <li><NavLink to='/Analisis'><i className="fa-solid fa-house"></i> Inicio </NavLink></li>
                                        <li><NavLink to='/Proyectos'> <i className="fa-solid fa-sliders"></i> Proyectos</NavLink></li>
                                        <li><NavLink to='/Cuenta'><i className="fa-solid fa-user-gear"></i> Mi Cuenta</NavLink></li>
                                        {/* <li><NavLink to='/Configuracion'><i className="fa-solid fa-gear"></i> Configuracion</NavLink></li> */}
                                    </ul>
                                </div>
                            </div>
                            <div className="search-bar">
                                <input type="text" placeholder="Search" style={{ opacity: 0 }} />
                            </div>
                            <div className="header-profile">
                                <div className="notification">
                                    <span className="notification-number">3</span>
                                    <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-bell">
                                        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
                                    </svg>
                                </div>
                                <i className="fa-solid fa-person-walking-arrow-right" onClick={logout}></i>
                                <div className="profile-img">
                                    <img src={photoURL} style={{ display: photoURL === null ? 'none' : '' }} alt="" />
                                    {name}
                                </div>
                            </div>
                        </>
                    )}
                </nav>
                <section className="wrapper" onContextMenu={MenuWarrep} onClick={() => document.getElementById('contextMenuPrincipal').classList.remove('is-active')}>
                    <Sidebar />
                    <Outlet></Outlet>
                    <div className={`overlay-app ${active ? 'is-active' : ''}`}></div>
                    <button id={`contextMenuPrincipal`} style={{ position: 'fixed' }} className={`dropdown`}>
                        <ul id='ulPrincipal'>
                            <li onClick={() => document.getElementById(`tuiruir43`).click()}>
                                <Link to="/Proyectos/new/Vcard" id='tuiruir43'>
                                    <i className="fa-solid fa-qrcode"></i> Crear un proyecto
                                </Link>
                            </li>
                            <li onClick={() => document.getElementById(`lsdf12`).click()}>
                                <Link to="/Cuenta" id={`lsdf12`}>
                                    <i className="fa-solid fa-address-card"></i> Mi Cuenta
                                </Link>
                            </li>
                            <li onClick={() => document.getElementById(`asdasd4798`).click()}>
                                <Link href="#" target="_blank" id={`asdasd4798`}>
                                    <i className="fa-solid fa-clone"></i> Duplicar Pestaña
                                </Link>
                            </li>
                            <li onClick={() => document.getElementById(`pereiia`).click()}>
                                <Link href="#as" id='pereiia'>
                                    <i className="fa-solid fa-receipt"></i> Cambiar a Premium
                                </Link>
                            </li>
                        </ul>
                    </button>
                </section>
            </div>
        </>
    );
};


export default Navbar;