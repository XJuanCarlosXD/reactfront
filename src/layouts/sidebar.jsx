import React from 'react';
import { NavLink, Route, Routes as Swicth } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

const Sidebar = props => {
    return (
        <AnimatePresence>
            <div className="left-side">
                <div className="side-wrapper">
                    <div className="side-title">Menu</div>
                    <div className="side-menu">
                        <Swicth>
                            <Route index element={<SidebarProyecto />} />
                            <Route path='/Analisis' element={<SidebarAnalisis />} />
                            <Route index path='/Proyectos' element={<SidebarProyecto />} />
                            <Route path='/Proyectos/Propios' element={<SidebarProyecto />} />
                            <Route path='/Proyectos/Activos' element={<SidebarProyecto />} />
                            <Route path='/Proyectos/new/Vcard' element={<SidebarProyecto />} />
                            <Route path='/Proyectos/new/Vcard/:id' element={<SidebarProyecto />} />
                            <Route path='/Cuenta' element={<SidebarCuenta />} />
                            <Route path='/Cuenta/Password' element={<SidebarCuenta />} />
                            <Route path='/Cuenta/Segurity' element={<SidebarCuenta />} />
                            <Route path='/Configuracion' element={<SidebarConfiguracion />} />
                        </Swicth>
                    </div>
                </div>
            </div>
        </AnimatePresence>
    );
};

export default Sidebar;

const SidebarProyecto = props => {
    return (
        <motion.div initial={{ opacity: 0, transition: "all 0.7s ease-in" }} animate={{ opacity: 1, transition: "all 0.7s ease-in" }} exit={{ opacity: 0, transition: "all 0.7s ease-in" }}>
            <NavLink to="/Proyectos/Propios">
                <svg viewBox="0 0 512 512">
                    <g xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                        <path d="M0 0h128v128H0zm0 0M192 0h128v128H192zm0 0M384 0h128v128H384zm0 0M0 192h128v128H0zm0 0" data-original="#bfc9d1" />
                    </g>
                    <path xmlns="http://www.w3.org/2000/svg" d="M192 192h128v128H192zm0 0" fill="currentColor" data-original="#82b1ff" />
                    <path xmlns="http://www.w3.org/2000/svg" d="M384 192h128v128H384zm0 0M0 384h128v128H0zm0 0M192 384h128v128H192zm0 0M384 384h128v128H384zm0 0" fill="currentColor" data-original="#bfc9d1" />
                </svg>
                Mis Proyectos
            </NavLink>
            <NavLink to="/Proyectos/Activos">
                <svg viewBox="0 0 488.932 488.932" fill="currentColor">
                    <path d="M243.158 61.361v-57.6c0-3.2 4-4.9 6.7-2.9l118.4 87c2 1.5 2 4.4 0 5.9l-118.4 87c-2.7 2-6.7.2-6.7-2.9v-57.5c-87.8 1.4-158.1 76-152.1 165.4 5.1 76.8 67.7 139.1 144.5 144 81.4 5.2 150.6-53 163-129.9 2.3-14.3 14.7-24.7 29.2-24.7 17.9 0 31.8 15.9 29 33.5-17.4 109.7-118.5 192-235.7 178.9-98-11-176.7-89.4-187.8-187.4-14.7-128.2 84.9-237.4 209.9-238.8z" />
                </svg>
                Proyectos Activos
                <span className="notification-number updates">3</span>
            </NavLink>
        </motion.div>
    );
};
const SidebarAnalisis = props => {
    return (
        <motion.div initial={{ opacity: 0, transition: "all 0.7s ease-in" }} animate={{ opacity: 1, transition: "all 0.7s ease-in" }} exit={{ opacity: 0, transition: "all 0.7s ease-in" }}>
            <NavLink href="#">
                <svg viewBox="0 0 488.455 488.455" fill="currentColor">
                    <path d="M287.396 216.317c23.845 23.845 23.845 62.505 0 86.35s-62.505 23.845-86.35 0-23.845-62.505 0-86.35 62.505-23.845 86.35 0" />
                    <path d="M427.397 91.581H385.21l-30.544-61.059H133.76l-30.515 61.089-42.127.075C27.533 91.746.193 119.115.164 152.715L0 396.86c0 33.675 27.384 61.074 61.059 61.074h366.338c33.675 0 61.059-27.384 61.059-61.059V152.639c-.001-33.674-27.385-61.058-61.059-61.058zM244.22 381.61c-67.335 0-122.118-54.783-122.118-122.118s54.783-122.118 122.118-122.118 122.118 54.783 122.118 122.118S311.555 381.61 244.22 381.61z" />
                </svg>
                Actividades
            </NavLink>
            <NavLink href="#">
                <svg viewBox="0 0 512 512" fill="currentColor">
                    <circle cx="295.099" cy="327.254" r="110.96" transform="rotate(-45 295.062 327.332)" />
                    <path d="M471.854 338.281V163.146H296.72v41.169a123.1 123.1 0 01121.339 122.939c0 3.717-.176 7.393-.5 11.027zM172.14 327.254a123.16 123.16 0 01100.59-120.915L195.082 73.786 40.146 338.281H172.64c-.325-3.634-.5-7.31-.5-11.027z" />
                </svg>
                Escaneo por Pais
            </NavLink>
            <NavLink href="#">
                <svg viewBox="0 0 58 58" fill="currentColor">
                    <path d="M57 6H1a1 1 0 00-1 1v44a1 1 0 001 1h56a1 1 0 001-1V7a1 1 0 00-1-1zM10 50H2v-9h8v9zm0-11H2v-9h8v9zm0-11H2v-9h8v9zm0-11H2V8h8v9zm26.537 12.844l-11 7a1.007 1.007 0 01-1.018.033A1.001 1.001 0 0124 36V22a1.001 1.001 0 011.538-.844l11 7a1.003 1.003 0 01-.001 1.688zM56 50h-8v-9h8v9zm0-11h-8v-9h8v9zm0-11h-8v-9h8v9zm0-11h-8V8h8v9z" />
                </svg>
                Video
            </NavLink>
            <NavLink href="#">
                <svg viewBox="0 0 512 512" fill="currentColor">
                    <path d="M499.377 46.402c-8.014-8.006-18.662-12.485-29.985-12.613a41.13 41.13 0 00-.496-.003c-11.142 0-21.698 4.229-29.771 11.945L198.872 275.458c25.716 6.555 47.683 23.057 62.044 47.196a113.544 113.544 0 0110.453 23.179L500.06 106.661C507.759 98.604 512 88.031 512 76.89c0-11.507-4.478-22.33-12.623-30.488zM176.588 302.344a86.035 86.035 0 00-3.626-.076c-20.273 0-40.381 7.05-56.784 18.851-19.772 14.225-27.656 34.656-42.174 53.27C55.8 397.728 27.795 409.14 0 416.923c16.187 42.781 76.32 60.297 115.752 61.24 1.416.034 2.839.051 4.273.051 44.646 0 97.233-16.594 118.755-60.522 23.628-48.224-5.496-112.975-62.192-115.348z" />
                </svg>
                Illustrations
            </NavLink>
            <NavLink href="#">
                <svg viewBox="0 0 512 512" fill="currentColor">
                    <path d="M497 151H316c-8.401 0-15 6.599-15 15v300c0 8.401 6.599 15 15 15h181c8.401 0 15-6.599 15-15V166c0-8.401-6.599-15-15-15zm-76 270h-30c-8.401 0-15-6.599-15-15s6.599-15 15-15h30c8.401 0 15 6.599 15 15s-6.599 15-15 15zm0-180h-30c-8.401 0-15-6.599-15-15s6.599-15 15-15h30c8.401 0 15 6.599 15 15s-6.599 15-15 15z" />
                    <path d="M15 331h196v60h-75c-8.291 0-15 6.709-15 15s6.709 15 15 15h135v-30h-30v-60h30V166c0-24.814 20.186-45 45-45h135V46c0-8.284-6.716-15-15-15H15C6.716 31 0 37.716 0 46v270c0 8.284 6.716 15 15 15z" />
                </svg>
                UI/UX
            </NavLink>
            <NavLink href="#">
                <svg viewBox="0 0 512 512" fill="currentColor">
                    <path d="M0 331v112.295a14.996 14.996 0 007.559 13.023L106 512V391L0 331zM136 391v121l105-60V331zM271 331v121l105 60V391zM406 391v121l98.441-55.682A14.995 14.995 0 00512 443.296V331l-106 60zM391 241l-115.754 57.876L391 365.026l116.754-66.15zM262.709 1.583a15.006 15.006 0 00-13.418 0L140.246 57.876 256 124.026l115.754-66.151L262.709 1.583zM136 90v124.955l105 52.5V150zM121 241L4.246 298.876 121 365.026l115.754-66.15zM271 150v117.455l105-52.5V90z" />
                </svg>
                3D/AR
            </NavLink>
        </motion.div>
    );
};
const SidebarCuenta = props => {
    return (
        <motion.div initial={{ opacity: 0, transition: "all 0.7s ease-in" }} animate={{ opacity: 1, transition: "all 0.7s ease-in" }} exit={{ opacity: 0, transition: "all 0.7s ease-in" }}>
            <NavLink to="/Cuenta">
                <i className="fa-solid fa-house-user"></i>
                Cuenta
            </NavLink>
            <NavLink to="/Cuenta/Password">
                <i className="fa-solid fa-lock"></i>
                Password
            </NavLink>
            <NavLink to="/Cuenta/Segurity">
                <i className="fa-solid fa-shield-halved"></i>
                Seguridad
            </NavLink>
            <NavLink href="/Cuenta/Aplication">
                <i className="fa-solid fa-globe"></i>
                Aplicación
            </NavLink>
            <NavLink href="/Cuenta/Notification">
                <i className="fa-solid fa-bell"></i>
                Notificaciones
            </NavLink>
        </motion.div>
    );
};
const SidebarConfiguracion = props => {
    return (
        <motion.div initial={{ opacity: 0, transition: "all 0.7s ease-in" }} animate={{ opacity: 1, transition: "all 0.7s ease-in" }} exit={{ opacity: 0, transition: "all 0.7s ease-in" }}>
            <NavLink href="#">
                <svg viewBox="0 0 512 512" fill="currentColor">
                    <path d="M467 0H45C20.186 0 0 20.186 0 45v422c0 24.814 20.186 45 45 45h422c24.814 0 45-20.186 45-45V45c0-24.814-20.186-45-45-45zM181 241c41.353 0 75 33.647 75 75s-33.647 75-75 75-75-33.647-75-75c0-8.291 6.709-15 15-15s15 6.709 15 15c0 24.814 20.186 45 45 45s45-20.186 45-45-20.186-45-45-45c-41.353 0-75-33.647-75-75s33.647-75 75-75 75 33.647 75 75c0 8.291-6.709 15-15 15s-15-6.709-15-15c0-24.814-20.186-45-45-45s-45 20.186-45 45 20.186 45 45 45zm180 120h30c8.291 0 15 6.709 15 15s-6.709 15-15 15h-30c-24.814 0-45-20.186-45-45V211h-15c-8.291 0-15-6.709-15-15s6.709-15 15-15h15v-45c0-8.291 6.709-15 15-15s15 6.709 15 15v45h45c8.291 0 15 6.709 15 15s-6.709 15-15 15h-45v135c0 8.276 6.724 15 15 15z" />
                </svg>
                Stock
            </NavLink>
            <NavLink href="#">
                <svg viewBox="0 0 511.441 511.441" fill="currentColor">
                    <path d="M255.721 347.484L90.22 266.751v106.57l165.51 73.503 165.509-73.503V266.742z" />
                    <path d="M511.441 189.361L255.721 64.617 0 189.361l255.721 124.744 195.522-95.378v111.032h30V204.092z" />
                </svg>
                Tutorials
            </NavLink>
            <NavLink href="#">
                <svg viewBox="0 0 512 512" fill="currentColor">
                    <path d="M196 151h-75v90h75c24.814 0 45-20.186 45-45s-20.186-45-45-45z" />
                    <path d="M467 0H45C20.186 0 0 20.186 0 45v422c0 24.814 20.186 45 45 45h422c24.814 0 45-20.186 45-45V45c0-24.814-20.186-45-45-45zM196 271h-75v105c0 8.291-6.709 15-15 15s-15-6.709-15-15V136c0-8.291 6.709-15 15-15h90c41.353 0 75 33.647 75 75s-33.647 75-75 75zm210-60c8.291 0 15 6.709 15 15s-6.709 15-15 15h-45v135c0 8.291-6.709 15-15 15s-15-6.709-15-15V241h-15c-8.291 0-15-6.709-15-15s6.709-15 15-15h15v-45c0-24.814 20.186-45 45-45h30c8.291 0 15 6.709 15 15s-6.709 15-15 15h-30c-8.276 0-15 6.724-15 15v45h45z" />
                </svg>
                Portfolio
            </NavLink>
            <NavLink href="#">
                <svg viewBox="0 0 512 512" fill="currentColor">
                    <path d="M181 181h-60v60h60c16.54 0 30-13.46 30-30s-13.46-30-30-30zm0 0M181 271h-60v60h60c16.54 0 30-13.46 30-30s-13.46-30-30-30zm0 0M346 241c-19.555 0-36.238 12.54-42.438 30h84.875c-6.199-17.46-22.882-30-42.437-30zm0 0" />
                    <path d="M436 0H75C33.648 0 0 33.648 0 75v362c0 41.352 33.648 75 75 75h361c41.352 0 76-33.648 76-75V75c0-41.352-34.648-75-76-75zM286 151h120v30H286zm-45 150c0 33.09-26.91 60-60 60H91V151h90c33.09 0 60 26.91 60 60 0 18.008-8.133 33.996-20.73 45 12.597 11.004 20.73 26.992 20.73 45zm180 0H303.562c6.196 17.46 22.883 30 42.438 30 16.012 0 30.953-8.629 38.992-22.516l25.957 15.032C397.58 346.629 372.687 361 346 361c-41.352 0-75-33.648-75-75s33.648-75 75-75 75 33.648 75 75zm0 0" />
                </svg>
                Behance
            </NavLink>
            <NavLink href="#">
                <svg viewBox="0 0 512 512" fill="currentColor">
                    <path d="M352 0H64C28.704 0 0 28.704 0 64v320a16.02 16.02 0 009.216 14.496A16.232 16.232 0 0016 400c3.68 0 7.328-1.248 10.24-3.712L117.792 320H352c35.296 0 64-28.704 64-64V64c0-35.296-28.704-64-64-64z" />
                    <path d="M464 128h-16v128c0 52.928-43.072 96-96 96H129.376L128 353.152V400c0 26.464 21.536 48 48 48h234.368l75.616 60.512A16.158 16.158 0 00496 512c2.336 0 4.704-.544 6.944-1.6A15.968 15.968 0 00512 496V176c0-26.464-21.536-48-48-48z" />
                </svg>
                Social Forum
            </NavLink>
        </motion.div>
    );
};