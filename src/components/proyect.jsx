import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, deleteDoc, addDoc, getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import html2canvas from 'html2canvas';
import QRCodeStyling from 'qr-code-styling';

export const Proyect = props => {
    const [activeLink, setActiveLink] = useState('');
    const [modal, setModal] = useState('');
    const [dropdown, setDropdown] = useState(true);
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
    const getData = async () => {
        await getDocs(VcardDataColletion).then((res) => {
            setData(res.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        }).then(() => {
            setisActive('');
        })
    };
    const dropdownActive = (index) => {
        if (dropdown) {
            setActiveLink(index)
        } else {
            setActiveLink('');
        }
        setDropdown(!dropdown);
    };
    const deleteQR = async (id) => {
        await deleteDoc(doc(db, "VcardData", id));
        setModal('');
        getData();
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
                <Link className="menu-link-main" href="#">Todos los Proyectos</Link>
                <div className="header-menu">
                    <div className='button-Vcar'>
                        <Link className="effect1 main-header-link" to="/Proyectos/new/Vcard">
                            Crear una Vcard!
                            <span className="bg"></span>
                        </Link>
                    </div>
                </div>
            </div>
            <div className={`content-wrapper ${activeLink !== '' ? 'overlay' : ''}`}>
                <div className="content-section">
                        <div className="header-menu">
                            <div className="content-section-title">Mis Proyectos</div>
                        </div>
                    <br />
                    <ul>
                        {data.map((row, index) => {
                            QRContainer(row, `QRlist-${index + 1}`);
                            setTimeout(() => {
                                QRContainer(row, `QRlist-${index + 1}`);
                            }, 0);
                            setTimeout(() => {
                                QRContainer(row, `QRModal-${index + 1}`);
                            }, 0);
                            return (
                                <li className="adobe-product" key={index}>
                                    <div className="Previews">
                                        <Link to={`/Vcard/QR/${row.id}`}>
                                            <div id={`QRlist-${index + 1}`} />
                                        </Link>
                                    </div>
                                    <div className="form">
                                        <div className="firt">
                                            <h3> Virtual Card</h3>
                                            <h4>{row.nameProyect}</h4>
                                            <div className='text-date'>Creado: {new Date(row.createAt.seconds).toLocaleString()}</div>
                                        </div>
                                        <div className="second">
                                            <span>https://qrfy.com/my-qr-codes</span>
                                            <span className="status"><i className={`status-circle ${row.active ? 'green' : 'red'}`}></i>
                                                {row.active ? 'Activo' : 'Desactivado'}</span>
                                            <div className='text-update'>Modificado: {new Date(row.updateAt.seconds).toLocaleString()}</div>
                                        </div>
                                        <div className="three">
                                            <h3>2</h3>
                                            <h4>Escaneado</h4>
                                        </div>
                                    </div>
                                    <div className="button-wrapper">
                                        <div className="btn-container detalle">
                                            <Link to={`/Vcard/QR/${row.id}`}>
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
                                                <button className={`dropdown ${activeLink === index ? 'is-active' : ''}`} onClick={() => dropdownActive(index)}>
                                                    <ul>
                                                        <li onClick={() => CloneProyect(row.id)}><Link href="#"><i className="fa-solid fa-clone"></i> Duplicar</Link></li>
                                                        <li onClick={() => document.getElementById(`li${index}`).click()}><Link id={`li${index}`} to={`/Proyectos/new/Vcard/${row.id}`}><i className="fa-solid fa-pen-to-square"></i> Editar</Link></li>
                                                        <li onClick={() => setModal(index)}><Link href="#"><i className="fa-solid fa-trash-can"></i> Borrar</Link></li>
                                                        <li><Link href="#"><i className="fa-solid fa-xmark"></i> Cancel</Link></li>
                                                    </ul>
                                                </button>
                                            </div>
                                            <span className="tooltiptext" style={{ width: "70px", left: "-10px", top: "-36px" }}>Menu</span>
                                        </div>
                                        <QRdonwload
                                            isActive={isOpen}
                                            marco={row.marco}
                                            index={index}
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
    return (
        <div className={`pop-up ${props.isActive === props.index ? 'visible' : ''} donwload`}>
            <div className="pop-up__title">Descargar QR
                <svg onClick={() => props.setIsActive('')} style={{ cursor: "pointer" }} className="close" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M15 9l-6 6M9 9l6 6" />
                </svg>
            </div>
            <div className={`box QRstyles QRdisene${props.marco}`} id='PrintRef'>
                <div className='boxQR-conten'>
                    <div className='counten'>
                        <div className='circle'></div>
                        <div className='retangule'></div>
                    </div>
                    <div className='boxQR'>
                        <div className='QRDis' id={`QRModal-${props.index + 1}`} />
                        <div className='QRText'>Escaneame!</div>
                    </div>
                    <div className='counten-circle'>
                        <div className='circle'></div>
                    </div>
                </div>
            </div>
            <div className="checkbox-wrapper" style={{ position: "absolute", right: "80px", top: "110px" }}>
                <div className="btn-container" style={{ margin: "15px" }}>
                    <button onClick={() => { props.onDownloadClick('png'); props.setIsActive('') }}>
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
                    <button onClick={() => { props.onDownloadClick('jpeg'); props.setIsActive('') }}>
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
                    <button onClick={() => { props.onDownloadClick('svg'); props.setIsActive('') }}>
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
    )
};
