import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import Sidebar from '../layouts/sidebar';

const Navbar = props => {
    const Theme = () => {
        document.body.classList.toggle('light-mode');
    }
    return (
        <>
            <div className="dark-light" onClick={Theme}>
                <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" /></svg>
            </div>
            <div className='app'>
                <nav className="header">
                    <div className="menu-circle"></div>
                    <div className="header-menu">
                        <NavLink className="menu-link" to='/Analisis'><i className="fa-solid fa-chart-simple"></i> Analisis</NavLink>
                        <NavLink className="menu-link notify" to='/Proyectos'> <i className="fa-solid fa-sliders"></i> Proyectos</NavLink>
                        <NavLink className="menu-link" to='/Cuenta'><i className="fa-solid fa-user-gear"></i> Mi Cuenta</NavLink>
                        <NavLink className="menu-link notify" to='/Configuracion'><i className="fa-solid fa-gear"></i> Configuracion</NavLink>
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
                        <i className="fa-solid fa-person-walking-arrow-right"></i>
                        <div className="profile-img">
                            <img src="https://images.unsplash.com/photo-1600353068440-6361ef3a86e8?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" alt="" />
                            Juan Carlos Abreu
                        </div>
                    </div>
                </nav>
                <section className="wrapper">
                    <Sidebar />
                    <Outlet></Outlet>
                </section>
            </div>
        </>
    );
};


export default Navbar;