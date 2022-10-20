import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/style.css';

const Vcard = props => {
    const socialq = ["Facebook", "Twitter", "Instagram", "Youtube", "TikTok", "Reddit", "Telegram", "Vimeo", "GitHub", "CodeSandbox", "Enlase Web", "SoundCloud", "Messenger", "Snapchat", "Spotify", "WhatsApp", "Apple Music"];
    const defaultValues = [
        { icon: 0, url: "Perfil", text: socialq[0] },
        { icon: 1, url: "Perfil", text: socialq[1] },
        { icon: 2, url: "Perfil", text: socialq[2] },
    ]
    const [social, setSocial] = useState(defaultValues);
    return (
        <div className='vCardPresentacion'>
            <div className="caja-presentacion"></div>
            <div className="caja-backAvatar">
                <div className="caja-dinamica"></div>
            </div>
            <div className="text-title">pedro abreu</div>
            <div className="text-subtitle">Presidente</div>
            <div className='caja-button'>
                <button><span className="fa-solid fa-phone"></span>
                    <p>Llamar</p>
                </button>
                <button><span className="fa-solid fa-envelope"></span>
                    <p>Email</p>
                </button>
                <button><span className="fa-solid fa-globe"></span>
                    <p>Web</p>
                </button>
                <button><span className='fa-solid fa-location-dot'></span>
                    <p style={{ marginLeft: "-10px" }}>Ubicacion</p>
                </button>
            </div>
            <div className="caja-info">
                <div className="content-form">
                    <button><span className="fa-solid fa-phone"></span></button>
                    <a href='#ad'>809 350 9268</a>
                    <p>Telefono fijo</p>
                </div>
                <div className="content-form">
                    <button><span className="fa-solid fa-phone"></span></button>
                    <a href='#a'>809 350 9268</a>
                    <p>Telefono fijo</p>
                </div>
                <div className="content-form">
                    <button><span className="fa-solid fa-phone"></span></button>
                    <a href='#a'>809 350 9268</a>
                    <p>Telefono fijo</p>
                </div>
                <div className="content-form">
                    <button><span className="fa-solid fa-phone"></span></button>
                    <a href='#a'>809 350 9268</a>
                    <p>Telefono fijo</p>
                </div>
                <div className='line-social'>
                    {social.map((row, index) => (
                        <div className='content-form social' key={index}>
                            <Social {...row} url="row.url" position={row.icon} />
                            <Link>{row.text}</Link>
                            <p>{row.url}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div >
    );
};

const Social = props => {
    return (
        <div className='col' onClick={props.onClick} id={props.position + 1}>
            <Link href="#"></Link>
            <Link href="#"></Link>
            <Link href="#"></Link>
            <Link href="#"></Link>
            <div className='box'></div>
        </div>
    )
};
export default Vcard;