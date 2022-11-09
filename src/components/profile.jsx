import React from 'react';
import { Link } from 'react-router-dom';

/** Perfil Usuario */
export const Profile = props => {
    return (
        <div className="main-container">
            <div className="main-header">
                <Link className="menu-link-main" href="#">Perfil</Link>
            </div>
            <div className="content-wrapper">
                <div className='content-form'>
                    <div className='Form-vcard profile'>
                        <div className='caja-backAvatar' style={{ position: "relative", margin: "0 auto" }}>
                            <img src={'https://t4.ftcdn.net/jpg/00/65/77/27/360_F_65772719_A1UV5kLi5nCEWI0BNLLiFaBPEkUbv5Fv.jpg'} className='caja-dinamica' alt='' />
                        </div>
                        <h2>Juan Carlos Abreu Paulino</h2>
                        <h4>Developement</h4>
                        <div className='vcard-create'>
                            <h2>3</h2>
                            <h4>Proyectos Activos 🟢</h4>
                        </div>
                    </div>
                    <div className='Form-vcard'>
                        <div className="header">
                            <h3 className="header-menu">Configuracion de Cuenta 🧑‍🏫</h3>
                        </div>
                        <div className='Form-Control'>
                            <input type="text" placeholder='✏️ Nombre' />
                            <input type="text" placeholder='✏️ Apellido' />
                        </div>
                        <div className='Form-Control'>
                            <input type="text" placeholder='📧 Email' />
                            <input type="text" placeholder='📱 Numero Telefonico' />
                        </div>
                        <div className='Form-Control'>
                            <input type="text" placeholder='🏢 Compañia' />
                            <input type="text" placeholder='🧑‍🏫 Posición o Designación' />
                        </div>
                        <div className='Form-Control'>
                            <textarea type="text" placeholder='👨‍💼 Biografia' rows={3} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const Password = props => {
    return (
        <div className="main-container">
            <div className="main-header">
                <Link className="menu-link-main" href="#">Configuración Contraseña</Link>
            </div>
            <div className="content-wrapper">
                <div className='content-form'>
                    <div className='Form-vcard'>
                        <div className="header">
                            <h3 className="header-menu">Configuracion de Contraseña ✏️</h3>
                        </div>
                        <div className='Form-Control' style={{ width: "50%" }}>
                            <input type="text" placeholder='✏️ Contraseña vieja' />
                        </div>
                        <div className='Form-Control'>
                            <input type="text" placeholder='🌟 Nueva contraseña' />
                            <input type="text" placeholder='🌟 Confirma nueva contraseña' />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export const Security = props => {
    return (
        <div className="main-container">
            <div className="main-header">
                <Link className="menu-link-main" href="#">Configuraciónes de Seguridad 🔐</Link>
            </div>
            <div className="content-wrapper">
                <div className='content-form'>
                    <div className='Form-vcard'>
                        <div className="header">
                            <h3 className="header-menu">Configuraciones de Seguridad 🔐</h3>
                        </div>
                        <div className='Form-Control'>
                            <input type="text" placeholder='🚪 Iniciar Seccion' />
                            <input type="text" placeholder='🔐 Two-factor auth' />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
