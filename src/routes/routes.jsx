import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Proyect from '../components/proyect';
import Home from '../components/home';
import Navbar from "../layouts/navbar";
import NewVcard from '../components/newVcard';
import { AnimatePresence } from 'framer-motion';
import { Password, Profile, Security } from '../components/profile';
import Vcard from '../components/Vcard';

export const RouterReact = props => {
    const location = useLocation();
    const Theme = () => {
        document.body.classList.toggle('light-mode');
    }
    return (
        <>
            <div className="video-bg">
                <video width="320" height="240" autoPlay loop muted>
                    <source src="https://assets.codepen.io/3364143/7btrrd.mp4" type="video/mp4" />
                </video>
            </div>
            <div className="dark-light" onClick={Theme}>
                <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" /></svg>
            </div>
            <div className="app">
                <AnimatePresence>
                    <Routes location={location} key={location.pathname}>
                        <Route path='/' element={<Navbar />}>
                            <Route index element={<Home />} />
                            <Route path='/Analisis' element={<Home />} />
                            <Route path='/Proyectos' element={<Proyect />} />
                            <Route path='/Proyectos/Propios' element={<Proyect />} />
                            <Route path='/Proyectos/Activos' element={<Proyect />} />
                            <Route path='/Proyectos/new/Vcard' element={<NewVcard />} />
                            <Route path='/Proyectos/new/Vcard/:id' element={<NewVcard />} />
                            <Route path='/Cuenta' element={<Profile />} />
                            <Route path='/Cuenta/Password' element={<Password />} />
                            <Route path='/Cuenta/Segurity' element={<Security />} />
                            <Route path='/Configuracion' />
                            <Route path='/' element={<Navigate replace to="/Proyectos" />} />
                        </Route>
                    </Routes>
                </AnimatePresence>
            </div>
        </>
    );
};
export const RouterVcard = props => {
    const location = useLocation();
    return (
        <Routes location={location} key={location.pathname}>
            <Route path='/Vcard'>
                <Route path='/Presentacion/QR/:id' element={<Vcard />} />
            </Route>
        </Routes>
    )
};
