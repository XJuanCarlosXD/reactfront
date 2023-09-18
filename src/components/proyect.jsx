import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, deleteDoc, addDoc, getDoc, doc, query, where } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import html2canvas from 'html2canvas';
import QRCodeStyling from 'qr-code-styling';
import { auth } from '../firebase/firebase';
import { onAuthStateChanged } from "firebase/auth";
import toast from 'react-hot-toast';

export const Proyect = props => {
    const [activeLink, setActiveLink] = useState('');
    const [modal, setModal] = useState('');
    const [check, setChek] = useState(false);
    const [isOpen, setIsopen] = useState('');
    const [isActive, setisActive] = useState('is-active');
    const [data, setData] = useState([]);
    const VcardDataColletion = collection(db, "VcardData");
    const onDownloadClick = async (fileExt) => {
        const element = document.getElementById('PrintRef');
        const canvas = await html2canvas(element);

        const data = canvas.toDataURL(`image/${fileExt}`);
        const link = document.createElement('a');

        if (typeof link.download === 'string') {
            link.href = data;
            link.download = `image.${fileExt}`;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            window.open(data);
        }
    };
    const QRContainer = (row, index) => {
        var qrCode = new QRCodeStyling(row.QRdata);
        qrCode.update({ width: 100, height: 100 });
        qrCode.append(document.getElementById(index));
    }
    const getData = () => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const uid = user.uid;
                const q = query(VcardDataColletion, where("uid", "==", uid));
                await getDocs(q).then((res) => {
                    setData(res.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
                }).then(() => {
                    setisActive('');
                })
            }
        });
    };
    const deleteQR = async (id) => {
        setModal('');
        setisActive('is-active');
        await deleteDoc(doc(db, "VcardData", id)).then(() => {
            getData();
            setChek(false);
            toast.success('Proyecto eliminado')
        })
    };
    const CloneProyect = async (id) => {
        try {
            const res = await getDoc(doc(db, "VcardData", id));
            const data = { ...res.data() };
            await addDoc(VcardDataColletion, data);
            getData();
        } catch (error) {
            console.log(error)
        }
    };
    useEffect(() => {
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <div className="main-container">
            <div className="main-header">
                <Link className="menu-link-main" to="/Archivos/QRCODE">Mis Proyectos</Link>
                <div className="header-menu">
                    <div className='button-Vcar'>
                        <Link className="effect1 main-header-link" to="/Proyectos/new/Vcard">
                            Crear una Vcard!
                            <span className="bg"></span>
                        </Link>
                    </div>
                </div>
            </div>
            <div className={`content-wrapper`} onClick={() => setActiveLink('')}>
                <div className="content-section">
                    <div className="header-menu">
                        <div className="content-section-title">Mis Proyectos</div>
                    </div>
                    <br />
                    <ul className='tableQR'>
                        {data.length === 0 ? (
                            <div style={{ marginLeft: '30px' }}>
                                <h1>
                                    ⚠️ No tienes ningun proyecto creado
                                    <Link style={{ color: 'var(--theme-color)' }} className="effect1 main-header-link" to="/Proyectos/new/Vcard">
                                        Crear uno Aqui!
                                        <span className="bg"></span>
                                    </Link>
                                </h1>
                            </div>
                        ) : ''}
                        {data.map((row, index) => {
                            QRContainer(row, `QRlist-${index + 1}`);
                            setTimeout(() => {
                                QRContainer(row, `QRlist-${index + 1}`);
                            }, 0);
                            setTimeout(() => {
                                QRContainer(row, `QRModal-${index + 1}`);
                            }, 0);
                            const movil = parseFloat(row.stadistic?.movil?.map((x) => x.escaneo).reduce((prev, curr) => prev + curr));
                            const web = parseFloat(row.stadistic?.web?.map((x) => x.escaneo).reduce((prev, curr) => prev + curr));
                            const escaneo = movil + web;
                            const dropdownActive = (index) => {
                                if (activeLink === index) {
                                    setActiveLink('');
                                } else {
                                    setActiveLink(index)
                                }
                            };
                            const MenuWarrep = (e) => {
                                e.preventDefault();
                                setTimeout(() => { document.getElementById(`contextMenuPrincipal`).classList.remove('is-active') }, 0)
                                if (activeLink === index) {
                                    const menu = document.getElementById(`contextMenu${index + 1}`)
                                    menu.style.transform = 'translatey(-30vh)';
                                    menu.style.zIndex = '99';
                                    menu.style.position = 'fixed';
                                    menu.style.left = e.pageX + "px";
                                    menu.style.top = e.pageY + "px";
                                } else {
                                    const menu = document.getElementById(`contextMenu${index + 1}`)
                                    menu.style.transform = 'translatey(-30vh)';
                                    dropdownActive(index)
                                    menu.style.zIndex = '99';
                                    menu.style.position = 'fixed';
                                    menu.style.left = e.pageX + "px";
                                    menu.style.top = e.pageY + "px";
                                }
                            }
                            return (
                                <li className="adobe-product" onContextMenu={MenuWarrep} key={index}>
                                    <div className="Previews">
                                        <Link to={row.proyect === 'Archivos QR' ? `/Files/Documento/rediricio/QR/${row.id}` : `/Vcard/QR/${row.id}/#detalle`}>
                                            <div className="QRlist" id={`QRlist-${index + 1}`} />
                                        </Link>
                                    </div>
                                    <div className="form">
                                        <div className="firt">
                                            <h3>{row.proyect}</h3>
                                            <h4>{row.nameProyect}</h4>
                                            <div className='text-date'>Creado: {new Date(row.createAt).toLocaleString()}</div>
                                        </div>
                                        <div className="second">
                                            <span>/QR/{row.id}</span>
                                            <span className="status"><i className={`status-circle ${row.active ? 'green' : 'red'}`}></i>
                                                {row.active ? 'Activo' : 'Desactivado'}</span>
                                            <div className='text-update'>{row.updateAt === '' ? 'Sin modificaciones' : `Modificado: ${new Date(row.updateAt).toLocaleString()}`}</div>
                                        </div>
                                        <div className="three">
                                            <h3>{escaneo}</h3>
                                            <h4>Escaneado</h4>
                                        </div>
                                    </div>
                                    <div className="button-wrapper">
                                        <div className="btn-container detalle">
                                            <Link to={`/Proyectos/Detalle/${row.id}/`}>
                                                <button type='button'>
                                                    <span className="text">Detalle</span>
                                                    <div className="icon-container">
                                                        <div className="icon icon--left">
                                                            <svg xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd"><path d="M21.883 12l-7.527 6.235.644.765 9-7.521-9-7.479-.645.764 7.529 6.236h-21.884v1h21.883z" /></svg>
                                                        </div>
                                                        <div className="icon icon--right">
                                                            <svg xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd"><path d="M21.883 12l-7.527 6.235.644.765 9-7.521-9-7.479-.645.764 7.529 6.236h-21.884v1h21.883z" /></svg>
                                                        </div>
                                                    </div>
                                                </button>
                                            </Link>
                                        </div>
                                        <div className="tooltip">
                                            <div className="donwload" onClick={() => setIsopen(index)}>
                                                <i className="fa-solid fa-download"></i>
                                            </div>
                                            <span className="tooltiptext" style={{ left: "-50px", top: "-30px" }}>Descargar</span>
                                        </div>
                                        <div className="tooltip">
                                            <div className="menu">
                                                <button id={`contextMenu${index + 1}`} className={`dropdown ${activeLink === index ? 'is-active' : ''}`} onClick={() => { setTimeout(() => { dropdownActive(index) }, 0) }}>
                                                    <ul>
                                                        <li onClick={() => CloneProyect(row.id)}><Link href="#"><i className="fa-solid fa-clone"></i> Duplicar</Link></li>
                                                        <li onClick={() => document.getElementById(`li${index}`).click()}><Link id={`li${index}`} to={`${row.edit}${row.id}`}><i className="fa-solid fa-pen-to-square"></i> Editar</Link></li>
                                                        <li onClick={() => document.getElementById(`de${index}`).click()}><Link id={`de${index}`} to={`/Proyectos/Detalle/${row.id}/`}><i className="fa-solid fa-circle-info"></i> Detalle</Link></li>
                                                        <li onClick={() => setModal(index)}><Link href="#"><i className="fa-solid fa-trash-can"></i> Borrar</Link></li>
                                                    </ul>
                                                </button>
                                            </div>
                                            <span className="tooltiptext" style={{ width: "70px", left: "-10px", top: "-36px" }}>Menu</span>
                                        </div>
                                        <QRdonwload
                                            isActive={isOpen}
                                            marco={row?.marcoQR}
                                            index={index}
                                            modal={isOpen}
                                            onDownloadClick={onDownloadClick}
                                            setIsActive={(value) => setIsopen(value)} />
                                        <div className={`pop-up ${modal === index ? 'visible' : ''}`}>
                                            <div className="pop-up__title">Borrar este Proyecto
                                                <svg onClick={() => setModal('')} className="close" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <circle cx="12" cy="12" r="10" />
                                                    <path d="M15 9l-6 6M9 9l6 6" />
                                                </svg>
                                            </div>
                                            <div className="pop-up__subtitle">Una vez borrado el proyecto no podra se podra visualizar mas y no habra ninguna manera de recuperarlo.</div>
                                            <div className="checkbox-wrapper" />
                                            <div className="checkbox-wrapper">
                                                <div className="toggle">
                                                    <input type="checkbox" id='temp1' checked={check} onClick={() => setChek(!check)} />
                                                    <label htmlFor={'temp1'}>Estoy de acuerto con borrar este proyecto</label>
                                                </div>
                                            </div>
                                            <div className="content-button-wrapper">
                                                <button className="content-button status-button open close" onClick={() => setModal('')}><i className="fa-solid fa-xmark"></i> Cancel</button>
                                                <button className={`content-button status-button ${!check ? 'open close' : ''}`} disabled={!check} onClick={() => deleteQR(row.id)}>Continue <i className="fa-solid fa-trash-can"></i></button>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </div>
            <Loading isActive={isActive} />
            <div className={`overlay-app ${modal !== '' ? 'is-active' : '' || isOpen !== '' ? 'is-active' : ''}`}></div>
        </div >
    );
};
export const Loading = props => {
    return (
        <div>
            <div className={`box-loading ${props.isActive}`}>
                <div className='LoadingCard'></div>
            </div>
        </div>
    )
};
const QRdonwload = (props) => {
    const printRef = React.useRef();
    const onDownloadClick = async (fileExt) => {
        const element = printRef.current;
        const canvas = await html2canvas(element);

        const data = canvas.toDataURL(`image/${fileExt}`);
        const link = document.createElement('a');

        if (typeof link.download === 'string') {
            link.href = data;
            link.download = `image.${fileExt}`;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            window.open(data);
        }
    };
    return (
        <div className={`pop-up ${props.isActive === props.index ? 'visible' : ''} donwload`}>
            <div className="pop-up__title">Descargar QR
                <svg onClick={() => props.setIsActive('')} style={{ cursor: "pointer" }} className="close" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M15 9l-6 6M9 9l6 6" />
                </svg>
            </div>
            <div className="conteng-pop-up">
                <div className={`caja ${props.modal !== '' ? 'active' : ''} QR${props.marco?.marco}`}>
                    <div ref={printRef} className={`caja QRRR`}>
                        <div className={`boxQR-conten QR${props.marco?.marco}`}>
                            <div className='counten'>
                                <div className='circle'></div>
                                <div className='retangule'></div>
                            </div>
                            <div className='boxQR' style={{ border: `5px solid ${props.marco?.color1m}`, background: props.marco?.color2B === '' ? props.marco?.color1B : `linear-gradient(${props.marco?.color1B},${props.marco?.color2B})` }}>
                                <div className='QRDis' id={`QRModal-${props.index + 1}`} style={{ background: props.marco?.color2b === '' ? props.marco?.color1b : `linear-gradient(${props.marco?.color1b},${props.marco?.color2b})` }} />
                                <div className='QRText'>Escaneame!</div>
                                <div className='circle'></div>
                            </div>
                            <div className='counten-circle'>
                                <div className='circle'></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="checkbox-wrapper" style={{ position: "absolute", right: "80px", top: "110px" }}>
                <div className="btn-container" style={{ margin: "15px" }}>
                    <button onClick={() => { onDownloadClick('png'); props.setIsActive('') }}>
                        <span className="text">PNG 🖼️</span>
                        <div className="icon-container">
                            <div className="icon icon--left">
                                <i className="fa-solid fa-download"></i>
                            </div>
                            <div className="icon icon--right">
                                <i className="fa-solid fa-download"></i>
                            </div>
                        </div>
                    </button>
                </div>
                <div className="btn-container" style={{ margin: "15px" }}>
                    <button onClick={() => { onDownloadClick('jpeg'); props.setIsActive('') }}>
                        <span className="text">JPEG 🖼️</span>
                        <div className="icon-container">
                            <div className="icon icon--left">
                                <i className="fa-solid fa-download"></i>
                            </div>
                            <div className="icon icon--right">
                                <i className="fa-solid fa-download"></i>
                            </div>
                        </div>
                    </button>
                </div>
                <div className="btn-container" style={{ margin: "15px" }}>
                    <button onClick={() => { onDownloadClick('svg'); props.setIsActive('') }}>
                        <span className="text">SVG 💻</span>
                        <div className="icon-container">
                            <div className="icon icon--left">
                                <i className="fa-solid fa-download"></i>
                            </div>
                            <div className="icon icon--right">
                                <i className="fa-solid fa-download"></i>
                            </div>
                        </div>
                    </button>
                </div>
            </div>
            <div className="checkbox-wrapper" />
            <div className="content-button-wrapper">
                <div className="btn-container">
                    <button onClick={() => props.setIsActive('')}>
                        <span className="text">Cancel</span>
                        <div className="icon-container">
                            <div className="icon icon--left">
                                <i className="fa-solid fa-xmark"></i>
                            </div>
                            <div className="icon icon--right">
                                <i className="fa-solid fa-xmark"></i>
                            </div>
                        </div>
                    </button>
                </div>
            </div>
        </div>

    );
};
