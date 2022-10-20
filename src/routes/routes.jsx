import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Proyect from '../components/proyect';
import Home from '../components/home';
import Navbar from "../layouts/navbar";
import NewVcard from '../components/newVcard';
import { AnimatePresence } from 'framer-motion';
import { Password, Profile, Security } from '../components/profile';
import Vcard from '../components/Vcard';

const RouterReact = props => {
    const location = useLocation();
    return (
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
                    <Route path='*' element={<Navigate replace to="/Proyectos" />} />
                </Route>
                <Route path='/Vcard'>
                    <Route index element={<Vcard />} />
                    <Route path='/Vcard/Presentacion/QR/:id' element={<Vcard />} />

                    <Route path='*' element={<Navigate replace to="/Proyectos" />} />
                </Route>
            </Routes>
        </AnimatePresence>
    );
};
export default RouterReact;