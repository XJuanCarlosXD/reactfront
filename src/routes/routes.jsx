import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Proyect } from '../components/proyect';
import Home from '../components/home';
import Navbar from "../layouts/navbar";
import Planes from '../components/planes';
import NewVcard from '../components/newVcard';
import { Password, Profile, Security } from '../components/profile';
import Vcard from '../components/Vcard';
import Auth from '../components/Auth';
import Detalle from '../components/Detalle';
import ReAuth from '../components/Re-Auth';

const RouterReact = props => {
    const location = useLocation();
    return (
        <Routes location={location} key={location.pathname}>
            <Route path='/' element={<Navbar />}>
                <Route index element={<Home />} />
                <Route path='/Login' element={<Auth />} />
                <Route path='/Re-Autenticated' element={<ReAuth />} />
                <Route path='/Planes' element={<Planes />} />
                <Route path='/Proyectos/Detalle/:id' element={<Detalle />} />
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
                <Route path='/Vcard/QR/:id' element={<Vcard />} />
                <Route path='/Vcard/QR/:id/#detalle' element={<Vcard />} />
                <Route path='*' element={<Navigate replace to="/Proyectos" />} />
            </Route>
        </Routes>
    );
};
export default RouterReact;