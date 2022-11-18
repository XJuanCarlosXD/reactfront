import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import '../styles/style.css';
import { useEffect } from 'react';

const Vcard = props => {
    const [data, setData] = useState([]);
    const { id } = useParams();
    const VcardDataColletion = doc(db, "VcardData", id);
    const concat = data?.contact;
    const getData = async () => {
        const res = await getDoc(VcardDataColletion);
        setData(res.data());
        var pathname = window.location.hash;
        const movilL = res.data()?.stadistic?.movil.length - 1;
        const webL = res.data()?.stadistic?.web.length - 1;
        const mFecha = res.data()?.stadistic?.movil[movilL].fecha;
        const wFecha = res.data()?.stadistic?.web[webL].fecha;
        if (pathname === '') {
            if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)) {
                if (mFecha === new Date().toLocaleDateString()) {
                    await updateDoc(VcardDataColletion, {
                        stadistic: {
                            movil: [{
                                fecha: new Date().toLocaleDateString(),
                                escaneo: parseFloat(res.data()?.stadistic?.movil.map((x) => x.escaneo).reduce((prev, curr) => prev + curr)) + 1
                            }],
                            web: res.data().stadistic.web
                        }
                    }).catch(error => {
                        console.log(error);
                    })

                } else {
                    await updateDoc(VcardDataColletion, {
                        stadistic: {
                            fecha: new Date().toLocaleDateString(),
                            movil: [...res.data().stadistic.movil, {
                                fecha: new Date().toLocaleDateString(),
                                escaneo: 1
                            }],
                            web: res.data().stadistic.web
                        }
                    }).catch(error => {
                        console.log(error);
                    })
                }
            } else {
                if (wFecha === new Date().toLocaleDateString()) {
                    await updateDoc(VcardDataColletion, {
                        stadistic: {
                            web: [{
                                fecha: new Date().toLocaleDateString(),
                                escaneo: parseFloat(res.data()?.stadistic?.web.map((x) => x.escaneo).reduce((prev, curr) => prev + curr)) + 1
                            }],
                            movil: res.data().stadistic.movil
                        }
                    }).catch(error => {
                        console.log(error);
                    })
                } else {
                    const newValur = {
                        fecha: new Date(new Date('Jul 12 2022')).toLocaleDateString(),
                        escaneo: 1
                    }
                    await updateDoc(VcardDataColletion, {
                        stadistic: {
                            web: [...res.data().stadistic.web, newValur],
                            movil: res.data().stadistic.movil
                        }
                    }).catch(error => {
                        console.log(error);
                    })
                }
            }
        }
    };
    useEffect(() => {
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <div className='vCardPresentacion'>
            {data?.profile?.fondo !== '' ? (
                <img src={data?.profile?.fondo} alt='' className="caja-presentacion" />
            ) : (
                <div style={{ backgroundColor: data?.profile?.colorFondo }} className="caja-presentacion"></div>
            )}
            <div className="caja-backAvatar">
                <img src={data?.profile?.img} alt='' className="caja-dinamica" />
            </div>
            <div className="text-title">{data?.profile?.name}</div>
            <div className="text-subtitle">{data?.profile?.position}</div>
            <div className='caja-button'>
                {concat?.find(e => e.select === "Telefono Movil") !== undefined ? (
                    <a href={`tel:${concat?.find(e => e.select === "Telefono Movil")?.title}`}>
                        <button style={{ backgroundColor: data?.profile.colorBotones }}><span className="fa-solid fa-phone"></span>
                            <p>Llamar</p>
                        </button>
                    </a>
                ) : ''}
                {concat?.find(e => e.select === "Email") !== undefined ? (
                    <a href={`mailto:${concat?.find(e => e.select === "Email")?.title}`}>
                        <button style={{ backgroundColor: data?.profile.colorBotones }}><span className="fa-solid fa-envelope"></span>
                            <p>Email</p>
                        </button>
                    </a>
                ) : ''}
                {concat?.find(e => e.select === "Pagina Web") !== undefined ? (
                    <a href={`${concat?.find(e => e.select === "Pagina Web")?.title}`} target="_blank" rel="noopener noreferrer">
                        <button style={{ backgroundColor: data?.profile.colorBotones }}><span className="fa-solid fa-globe"></span>
                            <p>Web</p>
                        </button>
                    </a>
                ) : ''}
                {concat?.find(e => e.select === "Ubicación") !== undefined ? (
                    <a href={`https://www.google.com/maps/place/${concat?.find(e => e.select === "Ubicación")?.title}`} target="_blank" rel="noopener noreferrer">
                        <button style={{ backgroundColor: data?.profile.colorBotones }}><span className='fa-solid fa-location-dot'></span>
                            <p style={{ marginLeft: "-10px" }}>Ubicacion</p>
                        </button>
                    </a>
                ) : ''}
            </div>
            <div className="caja-info">
                {data?.contact?.map((row, index) => (
                    <div className={`content-form contact ${row.select}`} key={index}>
                        <button style={{ backgroundColor: data?.profile.colorBotones }}><span className={row.icon}></span></button>
                        <a href='#ad'>{row.title}</a>
                        <p>{row.select}</p>
                    </div>
                ))}
                <div className='line-social'>
                    {data?.social?.map((row, index) => (
                        <div className='content-form social' key={index}>
                            <Social {...row} url={row.url} position={row.icon} />
                            <a href={row.redirecionable}>{row.text}</a>
                            <p>{row.url}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="btn-container" style={{ marginBottom: "15px" }}>
                <button>
                    <span className="text">Agregar Contacto 📞</span>
                    <div className="icon-container">
                        <div className="icon icon--left">
                            <i className="fa-solid fa-address-book"></i>
                        </div>
                        <div className="icon icon--right">
                            <i className="fa-solid fa-address-book"></i>
                        </div>
                    </div>
                </button>
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