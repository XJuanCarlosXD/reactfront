import React, { useRef, useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import StepWizard from "react-step-wizard";
import QRCodeStyling from 'qr-code-styling';
import { collection, addDoc, getDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { Loading } from './proyect';
import { ref as reference, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from '../firebase/firebase';
import html2canvas from 'html2canvas';
import toast from 'react-hot-toast';
import { auth } from '../firebase/firebase';
import { onAuthStateChanged } from "firebase/auth";
import { useForm } from "react-hook-form";
var qrCode = new QRCodeStyling({
    width: 200,
    height: 200,
    data: `https://vcarddo-2b240.web.app/#/Vcard/Presentacion/QR/`,
    image: "",
    dotsOptions: {
        color: "#B10fd1",
        gradient: { colorStops: [{ offset: 0, color: 'blue' }, { offset: 1, color: 'red' }] },
        type: "rounded",
    },
    imageOptions: {
        crossOrigin: "anonymous",
        margin: 0
    },
    cornersSquareOptions: {
        gradient: { colorStops: [{ offset: 0, color: 'blue' }, { offset: 1, color: 'red' }] },
    },
    backgroundOptions: {
        gradient: { colorStops: [{ offset: 0, color: '#fff' }, { offset: 1, color: '#fff' }] },
    },
    qrOptions: {
        mode: "Byte",
    }
});
const defaulvalues = {
    defaultValues: {
        colorButton: "#3a6df0",
        colorFondo: "#3a6df0",
        fondoActive: true,
        radius: "50%",
        fondo: '',
        image: '',
        fileFondo: '',
        fileImage: ''

    }
};
const PhotoEdit = props => {
    const { register, handleSubmit, watch, formState: { errors }, setValue } = useForm(defaulvalues);
    const { id } = useParams();
    const navigate = useNavigate();
    const [color1b, setColor1b] = useState('');
    const [color2b, setColor2b] = useState('');
    const [color1m, setColor1m] = useState('#FFFFFF');
    const [color1B, setColor1B] = useState('#1400EB');
    const [color2B, setColor2B] = useState('#ED0012');
    const [active, setActive] = useState(false);
    const [isActive, setisActive] = useState('');
    const [fileExt, setfileExt] = useState('png');
    const [data, setDataa] = useState({ ...qrCode._options });
    const [marco, setMarco] = useState(1);
    const printRef = useRef();
    const ref = useRef(null);
    const onDownloadClick = async () => {
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
    const setData = async (id) => {
        setisActive('is-active');
        await getDoc(doc(db, "VcardData", id)).then(res => {
            if (res.exists()) {
                const data = res.data();
                qrCode = new QRCodeStyling(data.QRdata);
                setDataa(data.QRdata);
                setMarco(data.marcoQR.marco);
                setColor1B(data.marcoQR.color1B);
                setColor2B(data.marcoQR.color2B);
                setColor1b(data.marcoQR.color1b);
                setColor2b(data.marcoQR.color2b);
                setColor1m(data.marcoQR.color1m);
                setValue('proyectName', data.nameProyect);
                setValue('image', data.data);
                setValue('fileO', data.data);
                setValue('urlDonwload', data.data);
                setTimeout(() => { qrCode.append(ref.current) }, 1000);
            } else {
                toast.error('No existe vCard');
            }
        }).then(() => setisActive(''))
            .catch(error => console.log(error))
    };
    const uploadFiles = async (file, name) => {
        const spaceRef = reference(storage, `/photos/${Date.now()}`);
        await uploadBytes(spaceRef, file).then(onSnapshot => {
            toast.success('Archivo Guardado')
        }).catch(error => console.log(error))
            .then(async () => {
                const downloadURL = await getDownloadURL(spaceRef);
                setValue(name, downloadURL);
            })
    }
    const onSubmit = async data => {
        const VcardDataColletion = collection(db, "VcardData");
        setisActive('is-active');
        setActive(!active);
        setValue('form', true);
        await uploadFiles(data.urlDonwload, 'urlDonwload').then(async () => {
            const arraydata = {
                nameProyect: data.proyectName,
                active: true,
                proyect: 'Archivos QR',
                edit: '/Proyectos/Archivos/QR/',
                uid: watch('uid'),
                createAt: new Date().toLocaleString(),
                updateAt: '',
                data: watch('urlDonwload'),
                stadistic: { movil: [{ fecha: new Date().toLocaleDateString(), escaneo: 0 }], web: [{ fecha: new Date().toLocaleDateString(), escaneo: 0 }] },
                marcoQR: { marco: marco, color1B: color1B, color2B: color2B, color1m: color1m, color1b: color1b, color2b: color2b },
                QRdata: { ...qrCode._options },
            };
            try {
                await addDoc(VcardDataColletion, arraydata).then(async (data) => {
                    qrCode.update({ data: `https://vcarddo-2b240.web.app/#/Files/Documento/rediricio/QR/${data.id}` });
                    const reference = doc(db, "VcardData", data.id);
                    await updateDoc(reference, { QRdata: { ...qrCode._options } });
                })
            } catch (error) {
                setisActive('');
                console.log(error);
            }
        }).then(() => {
            onDownloadClick();
        }).then(() => {
            navigate("/Proyectos");
        })
    };
    const onUpload = async data => {
        setisActive('is-active');
        setActive(!active);
        setValue('form', true);
        const VcardDataColletion = doc(db, "VcardData", id);
        if(data.fileO !== data.urlDonwload){
            await uploadFiles(data.urlDonwload, 'urlDonwload')
        }
        try {
            const arraydata = {
                uid: watch('uid'),
                nameProyect: data.proyectName,
                proyect: 'Archivos QR',
                edit: '/Proyectos/Archivos/QR/',
                active: true,
                data: watch('urlDonwload'),
                updateAt: new Date().toLocaleString(),
                marcoQR: { marco: marco, color1B: color1B, color2B: color2B, color1m: color1m, color1b: color1b, color2b: color2b },
                QRdata: { ...qrCode._options }
            };
            await updateDoc(VcardDataColletion, arraydata).then(() => {
                console.log('datos actulizados');
                onDownloadClick();
            }).then(() => {
                navigate("/Proyectos");
            })
        } catch (error) {
            setisActive('');
            console.log(error);
        }
    };
    const SeeProfile = () => {
        setActive(!active);
        document.querySelector('.overlay-app').classList.toggle('is-active');
    }
    const handefile = (e) => {
        const file = e.target.files[0];
        const TmpPath = URL.createObjectURL(file);
        setValue('image', TmpPath);
        setValue('urlDonwload', e.target.files[0])
    };
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setValue('uid', user.uid);
            } else {
                navigate('/Login')
            }
        });
    }, [navigate, setValue])
    useEffect(() => {
        if (id !== undefined) {
            setData(id);
        } else {
            qrCode.append(ref.current);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])
    return (
        <div className="main-container">
            <div className="main-header">
                <Link className="menu-link-main" href="#">Subir Fotos</Link>
                <div className="header-menu">
                    <div className='btn-profile' onClick={SeeProfile}>
                        <div role={'button'}>
                            <i className="fa-solid fa-qrcode"></i>
                        </div>
                    </div>
                </div>
            </div>
            <form className={`content-wrapper ${watch('form') ? 'rj45' : ''}`} onSubmit={id !== undefined ? handleSubmit(onUpload) : handleSubmit(onSubmit)}>
                <div className='content-form rght6 j6k4'>
                    <div className='Form-vcard'>
                        <StepWizard nav={<ButtonWizzar setValue={setValue} />}>
                            <div>
                                <br />
                                <div className="Form-Control">
                                    <input type="text" className={errors.proyectName && 'error'} {...register('proyectName', { required: true })} placeholder="✏️ Nombre Proyecto" />
                                </div>
                                <div className='ear45'>
                                    <div className="fixed flex bg-black bg-opacity-60">
                                        <div className="extraOutline p-4 bg-white bg-whtie m-auto rounded-lg">
                                            <div className="file_upload p-5 border-4 border-dotted border-gray-300 rounded-lg">
                                                <svg className="text-indigo-500 w-24 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                                                <div className="input_field flex flex-col w-max mx-auto text-center">
                                                    <label>
                                                        <input className="text-sm cursor-pointer w-36 hidden" onChange={handefile} type="file" />
                                                        <div className="text bg-indigo-600 text-white border border-gray-300 rounded font-semibold cursor-pointer p-1 px-3 hover:bg-indigo-500">Seleciona Imagen</div>
                                                    </label>
                                                    <div className="title text-indigo-500 uppercase">o arrastrala aqui</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <FormTree
                                setFileExt={(value) => setfileExt(value)}
                                onDownloadClick={onDownloadClick}
                                data={data}
                                setMarco={(value) => setMarco(value)}
                                setColor1b={(value) => setColor1b(value)}
                                setColor2b={(value) => setColor2b(value)}
                                setColor1m={(value) => setColor1m(value)}
                                setColor1B={(value) => setColor1B(value)}
                                setColor2B={(value) => setColor2B(value)}
                                color1B={color1B}
                                color2B={color2B}
                                color1m={color1m}
                                marco={marco}
                                id={id} />
                        </StepWizard>
                    </div>
                    <div className={`caja ${active ? 'active' : ''} QR${marco}`}>
                        <div className='btn-close' onClick={SeeProfile}>
                            <i className="fa-solid fa-xmark"></i>
                        </div>
                        <div ref={printRef} className={`caja QRRR`} style={{ opacity: watch('form') ? 1 : 0, visibility: !watch('form') ? 'hidden' : 'visible', transition: "all 0.3s ease-in", background: "var(--theme-bg-color)" }}>
                            <div className={`boxQR-conten QR${marco}`}>
                                <div className='counten'>
                                    <div className='circle'></div>
                                    <div className='retangule'></div>
                                </div>
                                <div className='boxQR' style={{ border: `5px solid ${color1m}`, background: color2B === '' ? color1B : `linear-gradient(${color1B},${color2B})` }}>
                                    <div ref={ref} className='QRDis' style={{ background: color2b === '' ? color1b : `linear-gradient(${color1b},${color2b})` }} />
                                    <div className='QRText'>Escaneame!</div>
                                    <div className='circle'></div>
                                </div>
                                <div className='counten-circle'>
                                    <div className='circle'></div>
                                </div>
                            </div>
                        </div>
                        <div className={`caja QRRR`} style={{ opacity: watch('form') ? 0 : 1, transition: "all 0.3s ease-in", background: "var(--theme-bg-color)" }}>
                            {watch('image') === '' ? (
                                <div style={{ textAlign: 'center' }}>
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Camera_Flat_Icon_Vector.svg/1200px-Camera_Flat_Icon_Vector.svg.png" alt="" />
                                    <h2>No hay data</h2>
                                    <h3>Arrastra o elige un archivo para mostrar</h3>
                                </div>
                            ) : (
                                <iframe src={watch('image')} title='Previsualizacion de archivo' allowFullScreen={true} frameborder="0"></iframe>
                            )}
                        </div>
                    </div>
                </div>
                <Loading isActive={isActive} />
            </form>
        </div>
    );
}

export default PhotoEdit;

const ButtonWizzar = props => {
    return (
        <div className="btn-container" style={{ marginTop: "15px", height: '7vh' }}>
            <div className='text-left'>
                <button type='button' onClick={() => { props.setValue('form', false); props.previousStep() }}>
                    <div className="icon-container">
                        <div className="icon icon--left">
                            <svg xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd"><path d="M2.117 12l7.527 6.235-.644.765-9-7.521 9-7.479.645.764-7.529 6.236h21.884v1h-21.883z" /></svg>
                        </div>
                        <div className="icon icon--right">
                            <svg xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd"><path d="M2.117 12l7.527 6.235-.644.765-9-7.521 9-7.479.645.764-7.529 6.236h21.884v1h-21.883z" /></svg>
                        </div>
                    </div>
                    <span className="text">Previo</span>
                </button>
            </div>
            <div className='text-right'>
                <button type='button' onClick={() => { props.setValue('form', true); props.nextStep() }}>
                    <span className="text">Proximo</span>
                    <div className="icon-container">
                        <div className="icon icon--left">
                            <svg xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd"><path d="M21.883 12l-7.527 6.235.644.765 9-7.521-9-7.479-.645.764 7.529 6.236h-21.884v1h21.883z" /></svg>
                        </div>
                        <div className="icon icon--right">
                            <svg xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd"><path d="M21.883 12l-7.527 6.235.644.765 9-7.521-9-7.479-.645.764 7.529 6.236h-21.884v1h21.883z" /></svg>
                        </div>
                    </div>
                </button>
            </div>
            <button className='btn-save' type="submit"><span className="text">💾 Guardar</span></button>
        </div>
    )
};
const FormTree = (props) => {
    const [active2, setActive2] = useState(false);
    const [active3, setActive3] = useState(false);
    const [active, setActive] = useState(false);
    const [check, setCheck] = useState(false);
    const [color1, setColor1] = useState('#1400EB');
    const [color2, setColor2] = useState('#ED0012');
    const [margin, setMargin] = useState(props.data?.imageOptions?.margin);
    const [imagensize, setImagenzize] = useState(props.data?.imageOptions?.imageSize);
    const [background, setBacground] = useState(true);
    const [color1b, setColor1b] = useState('#FFFFFF');
    const [color2b, setColor2b] = useState('#FFFFFF');
    const [color1z, setColor1z] = useState('#1400EB');
    const [color2z, setColor2z] = useState('#ED0012');
    const [logo, setImagelogo] = useState('');
    const [activeLink, setActiveLink] = useState(0);
    const [activeLinkEz, setActiveLinkEz] = useState(2);
    const dataRow = props.data;
    const listOption = [
        { style: { width: "100px", left: "0px", top: "-25px" }, qrCode: "rounded", tooltip: "Rounded" },
        { style: { width: "100%", left: "15px", top: "-25px" }, qrCode: "dots", tooltip: "Dots" },
        { style: { width: "80px", left: "10px", top: "-25px" }, qrCode: "classy", tooltip: "Classy" },
        { style: { width: "150px", left: "-18px", top: "-25px" }, qrCode: "classy-rounded", tooltip: "Classy Rounded" },
        { style: { width: "100px", left: "0px", top: "-25px" }, qrCode: "square", tooltip: "Square" },
        { style: { width: "150px", left: "-20px", top: "-25px" }, qrCode: "extra-rounded", tooltip: "Extra Rounded" },
    ];
    const listOptionEz = [
        { style: { width: "100%", left: "15px", top: "-25px" }, qrCode: "dots", tooltip: "Dots" },
        { style: { width: "100px", left: "0px", top: "-25px" }, qrCode: "square", tooltip: "Square" },
        { style: { width: "150px", left: "-20px", top: "-25px" }, qrCode: "extra-rounded", tooltip: "Extra Rounded" },
    ];
    const array1 = listOption.findIndex(element => element.qrCode === dataRow?.dotsOptions?.type);
    const array2 = listOptionEz.findIndex(element => element.qrCode === dataRow?.cornersSquareOptions?.type);
    const setData = () => {
        setActiveLink(Math.abs(array1));
        setColor1(dataRow.dotsOptions.gradient.colorStops[0].color);
        setColor2(dataRow.dotsOptions.gradient.colorStops[1].color);
        setActive2(dataRow.dotsOptions.gradient.colorStops.filter((element) => element.offset === 1).length > 1 ? true : false);
        setActiveLinkEz(array2);
        setColor1z(dataRow.cornersSquareOptions.gradient.colorStops[0].color);
        setColor2z(dataRow.cornersSquareOptions.gradient.colorStops[1].color);
        setActive(dataRow.cornersSquareOptions.gradient.colorStops.filter((element) => element.offset === 1).length > 1 ? true : false);
        setCheck(!dataRow.imageOptions.hideBackgroundDots);
        setColor1b(dataRow.backgroundOptions.gradient.colorStops[0].color);
        setColor2b(dataRow.backgroundOptions.gradient.colorStops[1].color);
        setBacground(dataRow.backgroundOptions.gradient.colorStops.filter((element) => element.offset === 1).length > 1 ? true : false);
    }
    useEffect(() => {
        if (props.id !== undefined) {
            setData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.id, array1, array2]);
    const handefondo = (e) => {
        if (e.target.files[0].type === 'image/jpeg' || e.target.files[0].type === 'image/png' || e.target.files[0].type === 'image/svg+xml') {
            if (e.target.files[0].size > 5242880) {
                toast.error('esta imagen es muy grande');
            } else {
                uploadImg(e.target.files[0]);
            }
        } else {
            toast.error("esto no es una imagen");
        }
    };
    const uploadImg = (file) => {
        if (file != null) {
            const spaceRef = reference(storage, `/photos/${Date.now()}`);
            uploadBytes(spaceRef, file).then(onSnapshot => {
                console.log('Uploaded a blob or file!', onSnapshot);
            })
                .catch(error => console.log(error))
                .then(async () => {
                    const downloadURL = await getDownloadURL(spaceRef);
                    setImagelogo(downloadURL);
                    const tmpt = URL.createObjectURL(file);
                    qrCode.update({ image: tmpt });
                })``
        } else {
            setImagelogo(null);
        }
    };
    const onExtensionChange = (event) => {
        props.setFileExt(event.target.value);
    };
    return (
        <div>
            <div className="header">
                <h3 className="header-menu">Marco del QR  🔲</h3>
            </div>
            <div className="Form-Control marco">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((row, index) => {
                    return (
                        <div className="tooltip" onClick={() => { props.setMarco(row) }} key={index}>
                            <button type='button' className={`cuadro marco ${props.marco === index + 1 ? "active" : ""}`}>
                                <div className={`cuadre marco${row}`}>
                                    <img src={`/images/${row}.png`} alt='' className='QRCUADRO' />
                                </div>
                            </button>
                            <span className="tooltiptext"></span>
                        </div>
                    )
                })}
            </div>
            <div className="Form-Control QRMARCOS" style={{ marginBottom: "40px", display: "flex", justifyContent: "center" }}>
                <div className="tooltip">
                    <button type='button' className={'cuadro active'}>
                        <div className='cuadre solid' /></button>
                    <span className="tooltiptext" style={{ left: "-10px", top: "-25px" }}>Color Solido</span>
                </div>
                <h4 style={{ marginRight: "10px" }}>Tipo de Color</h4>
                <div className="tooltip" onClick={() => document.getElementById('rgd5656').click()}>
                    <button className={'cuadro'} >
                        <div className='circle' style={{ background: props.color1m }} /></button>
                    <span className="tooltiptext" style={{ left: "-10px", top: "-25px" }}>Color 1</span>
                    <input type="color" className='circle' value={props.color1m} id='rgd5656' onChange={(e) => { props.setColor1m(e.target.value); }} style={{ position: "relative", left: "20px", top: "-45px", opacity: 0 }} />
                </div>
                <h4>Color Borde</h4>
            </div>
            <div className="Form-Control QRMARCOS" style={{ marginBottom: "40px", display: "flex", justifyContent: "center" }}>
                <div className="tooltip" onClick={() => setActive3(true)}>
                    <button type='button' className={!active3 ? 'cuadro' : 'cuadro active'}>
                        <div className='cuadre solid' /></button>
                    <span className="tooltiptext" style={{ left: "-10px", top: "-25px" }}>Color Solido</span>
                </div>
                <div className="tooltip" onClick={() => setActive3(false)}>
                    <button type='button' className={active3 ? 'cuadro' : 'cuadro active'}>
                        <div className='cuadre gradient' /></button>
                    <span className="tooltiptext" style={{ width: "150px", left: "-10px", top: "-25px" }}>Color Gradient</span>
                </div>
                <h4 style={{ marginRight: "10px" }}>Tipo de Color</h4>
                <div className="tooltip" onClick={() => document.getElementById('asdasdq78').click()}>
                    <button className={'cuadro'}>
                        <div className='circle' style={{ background: props.color1B }} /></button>
                    <span className="tooltiptext" style={{ left: "-10px", top: "-25px" }}>Color 1</span>
                    <input type="color" className='circle' value={props.color1B} id='asdasdq78' onChange={(e) => props.setColor1B(e.target.value)} style={{ position: "relative", left: "20px", top: "-45px", opacity: 0 }} />
                </div>
                {!active3 ? (
                    <div className="tooltip" style={{ marginLeft: "10px" }} onClick={() => document.getElementById('asd789').click()}>
                        <button type='button' className={'cuadro'}>
                            <div className='circle' style={{ background: `linear-gradient(${props.color1B},${props.color2B})` }} /></button>
                        <span className="tooltiptext" style={{ width: "150px", left: "-10px", top: "-25px" }}>Color 2</span>
                        <input type="color" className='circle' value={props.color2B} id='asd789' onChange={(e) => props.setColor2B(e.target.value)} style={{ position: "relative", left: "20px", top: "-45px", opacity: 0 }} />
                    </div>
                ) : ''}
                <h4>Color de Fondo</h4>
            </div>
            <div className="header">
                <h3 className="header-menu">Estilo de Puntos QR  ◻️</h3>
            </div>
            <div className="Form-Control QRMARCOS QRMARCO" style={{ marginBottom: "40px", display: "flex", justifyContent: "center" }}>
                {listOption.map((row, index) => (
                    <div className="tooltip" key={index} onClick={() => { qrCode.update({ dotsOptions: { type: row.qrCode } }); setActiveLink(index) }}>
                        <button type='button' className={`cuadro ${activeLink === index ? "active click12" : ""}`}><div className='cuadre'><div className={row.qrCode} /></div></button>
                        <span className="tooltiptext" style={row.style}>{row.tooltip}</span>
                    </div>
                ))}
            </div>
            <div className="Form-Control QRMARCOS" style={{ marginBottom: "40px", display: "flex", justifyContent: "center" }}>
                <div className="tooltip" onClick={() => setActive2(true)}>
                    <button type='button' className={!active2 ? 'cuadro' : 'cuadro active'}>
                        <div className='cuadre solid' /></button>
                    <span className="tooltiptext" style={{ left: "-10px", top: "-25px" }}>Color Solido</span>
                </div>
                <div className="tooltip" onClick={() => setActive2(false)}>
                    <button type='button' className={active2 ? 'cuadro' : 'cuadro active'}>
                        <div className='cuadre gradient' /></button>
                    <span className="tooltiptext" style={{ width: "150px", left: "-10px", top: "-25px" }}>Color Gradient</span>
                </div>
                <h4 style={{ marginRight: "10px" }}>Tipo de Color</h4>
                <div className="tooltip" onClick={() => document.getElementById('color12').click()}>
                    <button className={'cuadro'} >
                        <div className='circle' style={{ background: color1 }} /></button>
                    <span className="tooltiptext" style={{ left: "-10px", top: "-25px" }}>Color 1</span>
                    <input type="color" className='circle' value={color1} id='color12' onChange={(e) => { setColor1(e.target.value); qrCode.update({ dotsOptions: { gradient: { colorStops: [{ offset: 1, color: color1 }, { offset: 1, color: color1 }] } } }) }} style={{ position: "relative", left: "20px", top: "-45px", opacity: 0 }} />
                </div>
                {!active2 ? (
                    <div className="tooltip" style={{ marginLeft: "10px" }} onClick={() => document.getElementById('buto1').click()}>
                        <button type='button' className={'cuadro'}>
                            <div className='circle' style={{ background: `linear-gradient(${color1},${color2})` }} /></button>
                        <span className="tooltiptext" style={{ width: "150px", left: "-10px", top: "-25px" }}>Color 2</span>
                        <input type="color" className='circle' value={color2} id='buto1' onChange={(e) => { setColor2(e.target.value); qrCode.update({ dotsOptions: { gradient: { colorStops: [{ offset: 0, color: color1 }, { offset: 1, color: color2 }] } } }) }} style={{ position: "relative", left: "20px", top: "-45px", opacity: 0 }} />
                    </div>
                ) : ''}
                <h4>Color Borde</h4>
            </div>
            <div className="header">
                <h3 className="header-menu">Esquinas Estilo Cuadrado QR  ◻️</h3>
            </div>
            <div className="Form-Control QRMARCOS" style={{ marginBottom: "40px", display: "flex", justifyContent: "center" }}>
                {listOptionEz.map((row, index) => (
                    <div className="tooltip" key={index} onClick={() => { qrCode.update({ cornersSquareOptions: { type: row.qrCode } }); setActiveLinkEz(index) }}>
                        <button type='button' className={`cuadro ${activeLinkEz === index ? "active" : ""}`}><div className='cuadre'><div className={row.qrCode} /></div></button>
                        <span className="tooltiptext" style={row.style}>{row.tooltip}</span>
                    </div>
                ))}
            </div>
            <div className="Form-Control QRMARCOS" style={{ marginBottom: "40px", display: "flex", justifyContent: "center" }}>
                <div className="tooltip" onClick={() => setActive(true)}>
                    <button type='button' className={!active ? 'cuadro' : 'cuadro active'}>
                        <div className='cuadre solid' /></button>
                    <span className="tooltiptext" style={{ left: "-10px", top: "-25px" }}>Color Solido</span>
                </div>
                <div className="tooltip" onClick={() => setActive(false)}>
                    <button type='button' className={active ? 'cuadro' : 'cuadro active'}>
                        <div className='cuadre gradient' /></button>
                    <span className="tooltiptext" style={{ width: "150px", left: "-10px", top: "-25px" }}>Color Gradient</span>
                </div>
                <h4 style={{ marginRight: "10px" }}>Tipo de Color</h4>
                <div className="tooltip" onClick={() => document.getElementById('color14').click()}>
                    <button type='button' className={'cuadro'} >
                        <div className='circle' style={{ background: color1z }} /></button>
                    <span className="tooltiptext" style={{ left: "-10px", top: "-25px" }}>Color 1</span>
                    <input type="color" className='circle' value={color1z} id='color14' onChange={(e) => { setColor1z(e.target.value); qrCode.update({ cornersSquareOptions: { gradient: { colorStops: [{ offset: 1, color: color1z }, { offset: 1, color: color1z }] } } }) }} style={{ position: "relative", left: "20px", top: "-45px", opacity: 0 }} />
                </div>
                {!active ? (
                    <div className="tooltip" style={{ marginLeft: "10px" }} onClick={() => document.getElementById('buto19').click()}>
                        <button type='button' className={'cuadro'}>
                            <div className='circle' style={{ background: `linear-gradient(${color1z},${color2z})` }} /></button>
                        <span className="tooltiptext" style={{ width: "150px", left: "-10px", top: "-25px" }}>Color 2</span>
                        <input type="color" className='circle' value={color2z} id='buto19' onChange={(e) => { setColor2z(e.target.value); qrCode.update({ cornersSquareOptions: { gradient: { colorStops: [{ offset: 0, color: color1z }, { offset: 1, color: color2z }] } } }) }} style={{ position: "relative", left: "20px", top: "-45px", opacity: 0 }} />
                    </div>
                ) : ''}
                <h4>Color Borde</h4>
            </div>
            <div className="header">
                <h3 className="header-menu">Fondo de QR  ◻️</h3>
            </div>
            <div className="Form-Control QRMARCOS" style={{ marginBottom: "40px", display: "flex", justifyContent: "center" }}>
                <div className="tooltip" onClick={() => setBacground(true)}>
                    <button type='button' className={!background ? 'cuadro' : 'cuadro active'}>
                        <div className='cuadre solid' /></button>
                    <span className="tooltiptext" style={{ left: "-10px", top: "-25px" }}>Color Solido</span>
                </div>
                <div className="tooltip" onClick={() => setBacground(false)}>
                    <button type='button' className={background ? 'cuadro' : 'cuadro active'}>
                        <div className='cuadre gradient' /></button>
                    <span className="tooltiptext" style={{ width: "150px", left: "-10px", top: "-25px" }}>Color Gradient</span>
                </div>
                <h4 style={{ marginRight: "10px" }}>Tipo de Color</h4>
                <div className="tooltip" onClick={() => document.getElementById('color146').click()}>
                    <button type='button' className={'cuadro'} >
                        <div className='circle' style={{ background: color1b }} /></button>
                    <span className="tooltiptext" style={{ left: "-10px", top: "-25px" }}>Color 1</span>
                    <input type="color" className='circle' value={color1b} id='color146' onChange={(e) => { setColor1b(e.target.value); props.setColor1b(e.target.value); qrCode.update({ backgroundOptions: { gradient: { colorStops: [{ offset: 1, color: color1b }, { offset: 1, color: color1b }] } } }) }} style={{ position: "relative", left: "20px", top: "-45px", opacity: 0 }} />
                </div>
                {!background ? (
                    <div className="tooltip" style={{ marginLeft: "10px" }} onClick={() => document.getElementById('buto196').click()}>
                        <button type='button' className={'cuadro'}>
                            <div className='circle' style={{ background: `linear-gradient(${color1b},${color2b})` }} /></button>
                        <span className="tooltiptext" style={{ width: "150px", left: "-10px", top: "-25px" }}>Color 2</span>
                        <input type="color" className='circle' value={color2b} id='buto196' onChange={(e) => { setColor2b(e.target.value); props.setColor2b(e.target.value); qrCode.update({ backgroundOptions: { gradient: { colorStops: [{ offset: 0, color: color1b }, { offset: 1, color: color2b }] } } }) }} style={{ position: "relative", left: "20px", top: "-45px", opacity: 0 }} />
                    </div>
                ) : ''}
                <h4>Color Borde</h4>
            </div>
            <div className="header">
                <h3 className="header-menu">Logo de QR  ◻️</h3>
            </div>
            <div className="Form-Control QRMARCOS" style={{ marginBottom: "40px" }}>
                <input type="file" id='fondo12' onChange={handefondo} style={{ display: "none" }} />
                <div className="tooltip" onClick={() => document.getElementById('fondo12').click()}>
                    <button type='button' className={'cuadro'}>
                        {logo === '' ? (<div className='circle circleActive' />) : (<img src={logo} alt='' className='circle' />)}
                    </button>
                    <span className="tooltiptext" style={{ width: "100px", left: "0", top: "-25px" }}>Logo QR</span>
                </div>
                <div className="tooltip">
                    <button type='button' onClick={() => { qrCode.update({ image: "" }); setImagelogo('') }}>x</button>
                    <span className="tooltiptext" style={{ width: "70px", left: "-25px", top: "-25px" }}>Cancel</span>
                </div>
                <h4 className="header-menu">Logo de QR  ◻️</h4>
            </div>
            <div className="Form-Control checkbox" style={{ marginBottom: "20px" }}>
                <div className="toggle">
                    <input type="checkbox" id='temp' defaultChecked={!check} checked={!check} onClick={() => { setCheck(!check); qrCode.update({ imageOptions: { hideBackgroundDots: check } }) }} />
                    <label htmlFor={'temp'}>Ocultar puntos de fondo</label>
                </div>
            </div>
            <div className="Form-Control QRMARCOS margenes" style={{ marginBottom: "40px" }}>
                <input type="number" placeholder='Tamaño de la imagen' value={imagensize} onChange={(e) => { qrCode.update({ imageOptions: { imageSize: e.target.value } }); setImagenzize(e.target.value) }} min={0} max={1} step={0.1} />
                <input type="number" placeholder='Margen' value={margin} onChange={(e) => { qrCode.update({ imageOptions: { margin: e.target.value } }); setMargin(e.target.value) }} min={0} max={50} />
            </div>
            <div className='Form-Control QR'>
                <select onChange={onExtensionChange}>
                    <option value="png">🖼️ PNG</option>
                    <option value="jpeg">🖼️ JPEG</option>
                </select>
                <button type='button' onClick={props.onDownloadClick}>Download</button>
            </div>
        </div >
    )
};