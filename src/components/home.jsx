import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <>
      <div className="main-container">
        <div className="main-header">
          <Link className="menu-link-main" href="#">Inicio 🏠</Link>
          <div className="header-menu">
            <Link className="main-header-link is-active" to="/Proyectos/new/Vcard">Crear ➕</Link>
            {localStorage.getItem('uid') === null ? <Link className="main-header-link is-active" to="/Login">Iniciar Seccion </Link> : ''}
            {/* <Link className="main-header-link" to={'/Planes'}>Planes 📚</Link> */}
            {/* <Link className="main-header-link" href="#">Web</Link> */}

          </div>
        </div>
        <div className="content-wrapper">
          <div className="content-wrapper-header">
            <div className="content-wrapper-context">
              <h3 className="img-content">
                VcardDO <div className='animation'>
                  <div>🪪</div>
                  <img src='/images/banderaQR.png' alt='' />
                </div>
              </h3>
              <div className="content-text">Crea codigos QR gratuitamente de VcardDo en el plan de prueba gratuito de 30 días de Link y crea diseña el codigo QR perfecto que lo ayudará con su nuevo proyecto.</div>
              <button className="content-button">Empiza la prueba gratuita</button>
            </div>
            <img className="content-wrapper-img" src="/images/banderaQR.png" alt="" />
          </div>
          <div className="content-section">
            <div className="content-section-title">Porque crear codigos QR con Nostros</div>
            <div className="apps-card">
              <div className="app-card">
                <span>
                  📝 Creación Facil
                </span>
                <div className="app-card__subtext">Edita, masteriza y crea codigos QR totalmente profesionales y de manera dinamica.</div>
                <div className="app-card-buttons">
                  <button className="content-button status-button">Comenzar</button>
                  <div className="menu"></div>
                </div>
              </div>
              <div className="app-card">
                <span>
                  🏢 Administración
                </span>
                <div className="app-card__subtext">Diseñe, administre y publique grandes proyectos con nuestra web.</div>
                <div className="app-card-buttons">
                  <button className="content-button status-button">Comenzar</button>
                  <div className="menu"></div>
                </div>
              </div>
              <div className="app-card">
                <span>
                  🎨 Diseño
                </span>
                <div className="app-card__subtext">Diseñe codigo QR con efectos visuales estándar de la industria.</div>
                <div className="app-card-buttons">
                  <button className="content-button status-button">Comenzar</button>
                  <div className="menu"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home
