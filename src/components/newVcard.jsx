/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useEffect, useState } from 'react';
import StepWizard from "react-step-wizard";
import { Link, useNavigate, useParams } from 'react-router-dom';
import QRCodeStyling from 'qr-code-styling';
import html2canvas from 'html2canvas';
import { useForm } from "react-hook-form";
import { collection, addDoc, getDoc, doc, updateDoc } from 'firebase/firestore';
import { ref as reference, uploadBytes, deleteObject, getDownloadURL } from "firebase/storage";
import { storage } from '../firebase/firebase';
import { db } from '../firebase/firebase';
import { Loading } from './proyect';
import { auth } from '../firebase/firebase';
import { onAuthStateChanged } from "firebase/auth";
import toast from 'react-hot-toast';

const defaultState = [{ select: "Email", title: "", icon: "fa-solid fa-envelope" },
{ select: "Telefono Movil", title: "", icon: "fa-solid fa-mobile-screen" }, { select: "Ubicación", title: "", icon: "fa-solid fa-location-dot" }];
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
const NewVcard = props => {
    const { register, handleSubmit, watch, formState: { errors }, setValue } = useForm(defaulvalues);
    const { id } = useParams();
    const navigate = useNavigate();
    const [social, setSocial] = useState([]);
    const [rows, setRows] = useState(defaultState);
    const [isActive, setisActive] = useState('');
    const [color1b, setColor1b] = useState('');
    const [color2b, setColor2b] = useState('');
    const [color1m, setColor1m] = useState('#FFFFFF');
    const [color1B, setColor1B] = useState('#1400EB');
    const [color2B, setColor2B] = useState('#ED0012');
    const [active, setActive] = useState(false);
    const [fileExt, setfileExt] = useState('png');
    const [data, setDataa] = useState({ ...qrCode._options });
    const [dataprofile, setDataprofile] = useState([]);
    const [marco, setMarco] = useState(1);
    const printRef = useRef();
    const ref = useRef(null);
    const uploadFiles = async (file, name) => {
        const spaceRef = reference(storage, `/photos/${Date.now()}`);
        await uploadBytes(spaceRef, file).then(onSnapshot => {
            toast.success('Imagenes Guardas')
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
        if (data?.fileFondo !== '') {
            await uploadFiles(data.fileFondo, 'fondo')
        }
        await uploadFiles(data.fileImage, 'image').then(async () => {
            const arraydata = {
                nameProyect: data.proyectName,
                active: true,
                proyect: 'Virtual Card',
                edit: '/Proyectos/new/Vcard/',
                uid: watch('uid'),
                createAt: new Date().toLocaleString(),
                updateAt: '',
                stadistic: { movil: [{ fecha: new Date().toLocaleDateString(), escaneo: 0 }], web: [{ fecha: new Date().toLocaleDateString(), escaneo: 0 }] },
                marcoQR: { marco: marco, color1B: color1B, color2B: color2B, color1m: color1m, color1b: color1b, color2b: color2b },
                QRdata: { ...qrCode._options },
                contact: [...rows],
                profile: { name: data.name, position: data.position, img: watch('image'), radius: data.radius, fondo: watch('fondo'), fondoActive: data.fondoActive, colorFondo: data.colorFondo, colorBotones: data.colorButton },
                social: [...social],
            };
            try {
                await addDoc(VcardDataColletion, arraydata).then(async (docRef) => {
                    qrCode.update({ data: `https://vcarddo-2b240.web.app/#/Vcard/QR/${docRef.id}` });
                    const reference = doc(db, "VcardData", docRef.id);
                    await updateDoc(reference, { QRdata: { ...qrCode._options } });
                }).then(() => {
                    onDownloadClick();
                }).then(() => {
                    navigate("/Proyectos");
                })
            } catch (error) {
                setisActive('');
                console.log(error);
            }
        })
    };
    const onUpload = async data => {
        setisActive('is-active');
        setActive(!active);
        setValue('form', true);
        const VcardDataColletion = doc(db, "VcardData", id);
        if (data.dataProfile.img !== data.image) {
            const spaceRef = reference(storage, `${data.dataProfile.img}`);
            if (data.dataProfile.img !== '') {
                await deleteObject(spaceRef).then(async () => {
                    await uploadFiles(data.fileImage, 'image')
                })
            }
        }
        if (data.dataProfile.fondo !== data.fondo) {
            const spaceRef = reference(storage, `${data.dataProfile.img}`);
            await deleteObject(spaceRef).then(async () => {
                await uploadFiles(data.fileFondo, 'fondo')
            })
        }
        try {
            const arraydata = {
                uid: watch('uid'),
                proyect: 'Virtual Card',
                edit: '/Proyectos/new/Vcard/',
                nameProyect: data.proyectName,
                active: true,
                updateAt: new Date().toLocaleString(),
                marcoQR: { marco: marco, color1B: color1B, color2B: color2B, color1m: color1m, color1b: color1b, color2b: color2b },
                QRdata: { ...qrCode._options },
                contact: [...rows],
                profile: { name: data.name, position: data.position, img: watch('image'), radius: data.radius, fondo: watch('fondo'), fondoActive: data.fondoActive, colorFondo: data.colorFondo, colorBotones: data.colorButton },
                social: [...social],
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
    const handleOnChange = (index, name, value) => {
        const copyRows = [...rows];
        copyRows[index] = {
            ...copyRows[index],
            [name]: value
        };
        setRows(copyRows);
    };
    const handleOnAdd = () => {
        setRows(rows.concat({ select: "", title: "", icon: "" }));
    };
    const handleOnRemove = index => {
        const copyRows = [...rows];
        copyRows.splice(index, 1);
        setRows(copyRows);
    };
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
                const adreess = res.data().contact.find(e => e.select === "Ubicación").adreess
                qrCode = new QRCodeStyling(data.QRdata);
                setDataa(data.QRdata);
                setDataprofile(data.profile);
                setRows([...data.contact]);
                setValue('name', data.profile.name);
                setValue('dataProfile', data.profile)
                setValue('position', data.profile.position);
                setMarco(data.marcoQR.marco);
                setColor1B(data.marcoQR.color1B);
                setColor2B(data.marcoQR.color2B);
                setColor1b(data.marcoQR.color1b);
                setColor2b(data.marcoQR.color2b);
                setColor1m(data.marcoQR.color1m);
                setValue('image', data.profile.img);
                setValue('fondo', data.profile.fondo);
                setValue('direccion', adreess.direccion);
                setValue('numeracion', adreess.numeracion);
                setValue('codigo', adreess.codigo);
                setValue('ciudad', adreess.ciudad);
                setValue('estado', adreess.estado);
                setValue('pais', adreess.pais);
                setValue('fondoActive', data.profile.fondoActive);
                setValue('colorBotones', data.profile.colorBotones);
                setValue('colorFondo', data.profile.colorFondo);
                setValue('radius', data.profile.radius);
                setValue('proyectName', data.nameProyect);
                setSocial([...data.social]);
                setTimeout(() => { qrCode.append(ref.current) }, 1000);
            } else {
                toast.error('No existe vCard');
            }
        }).then(() => setisActive(''))
            .catch(error => console.log(error))
    };
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setValue('uid', user.uid);
            } else {
                navigate('/Login')
            }
        });
    }, [])
    useEffect(() => {
        if (rows.length > 5) {
            setRows(rows.splice(1, 5))
        }
    }, [rows])
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
                <Link className="menu-link-main" href="#">Nueva Vcard</Link>
                <div className="header-menu">
                    <div className='btn-profile' onClick={SeeProfile}>
                        <div role={'button'}>
                            <i className="fa-solid fa-qrcode"></i>
                        </div>
                    </div>
                </div>
            </div>
            <form className="content-wrapper rj45" onSubmit={id !== undefined ? handleSubmit(onUpload) : handleSubmit(onSubmit)}>
                <div className='content-form rght6'>
                    <div className='Form-vcard'>
                        <StepWizard nav={<ButtonWizzar setValue={setValue} />}>
                            <>
                                <FormVcard
                                    watch={watch}
                                    register={register}
                                    setValue={setValue}
                                    errors={errors}
                                    id={id}
                                    data={dataprofile}
                                />
                                <FormTwo
                                    rows={rows}
                                    setRSocial={(value) => setSocial(value)}
                                    handleOnChange={handleOnChange}
                                    handleOnAdd={handleOnAdd}
                                    social={social}
                                    register={register}
                                    watch={watch}
                                    errors={errors}
                                    handleOnRemove={handleOnRemove} />
                            </>
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
                        <div ref={printRef} className={`caja QRRR`} style={{ opacity: watch('form') ? 1 : 0, transition: "all 0.3s ease-in", background: "var(--theme-bg-color)" }}>
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
                        <PreviewsVcard
                            social={social}
                            rows={rows}
                            watch={watch} />
                    </div>
                    <Loading isActive={isActive} />
                </div>
            </form>
        </div>
    );
};

export default NewVcard;

const FormThoRow = (props) => {
    const [select, setSelect] = useState('');
    const [detalle, setDetalle] = useState('👈 Selecciona un opcion');
    useEffect(() => {
        setSelect(props.select);
    }, [props.select])
    const onChangeInput = () => props.onChange("title", `${props.watch('direccion')} ${props.watch('numeracion')}, ${props.watch('codigo')}, ${props.watch('ciudad')}, ${props.watch('estado')}, ${props.watch('pais')}`)
    const onBlurFuntion = () => props.onChange("adreess", {
        direccion: props.watch('direccion'),
        numeracion: props.watch('numeracion'),
        codigo: props.watch('codigo'),
        ciudad: props.watch('ciudad'),
        estado: props.watch('estado'),
        pais: props.watch('pais')
    })
    const onSelect = (e) => {
        if (e.target.value === 'Email') {
            setDetalle('📧 Escribe un correo electronico');
        } else if (e.target.value === 'Pagina Web') {
            setDetalle('💻 Escribe la URL de la pagina');
        } else if (e.target.value === 'Ubicación') {
            setDetalle('📌 Escribe la URL de la ubicacion');
        } else if (e.target.value === 'Telefono Movil') {
            setDetalle('📱 Escribe un numero movil');
        } else if (e.target.value === 'Telefono Fijo') {
            setDetalle('📞 Escribe un numero de telefono');
        }
        setSelect(e.target.value)
        props.onChange("select", e.target.value);
    };
    const onBlur = (e) => {
        if (e.target.value === 'Email') {
            props.onChange('icon', 'fa-solid fa-envelope');
        } else if (e.target.value === 'Pagina Web') {
            props.onChange('icon', 'fa-solid fa-globe');
        } else if (e.target.value === 'Ubicación') {
            props.onChange('icon', 'fa-solid fa-location-dot');
        } else if (e.target.value === 'Telefono Movil') {
            props.onChange('icon', 'fa-solid fa-mobile-screen');
        } else if (e.target.value === 'Telefono Fijo') {
            props.onChange('icon', 'fa-solid fa-phone');
        }
    };
    return (
        <>
            <div className="Form-Control contact">
                <select id='info' defaultValue={"👉 Selecciona una opcion"} value={select} onBlur={onBlur} onChange={onSelect}>
                    <option hidden>👉 Selecciona una opcion</option>
                    <option value={'Email'}>📧 Email</option>
                    <option value={'Pagina Web'}>💻 Pagina Web</option>
                    <option value={'Ubicación'}>📌 Ubicación</option>
                    <option value={'Telefono Movil'}>📱 Telefono Movil</option>
                    <option value={'Telefono Fijo'}>📞 Telefono Fijo</option>
                </select>
                <input type="text" value={props.input} onChange={(e) => props.onChange("title", e.target.value)} placeholder={detalle} disabled={select === '' ? true : false} hidden={select === 'Ubicación' ? true : false} />
                <button type='button' onClick={props.onRemove}><i className="fa-solid fa-minus"></i></button>
            </div>
            {select === 'Ubicación' ? (
                <div className='location' onChange={onChangeInput} onBlur={onBlurFuntion}>
                    <div className="Form-Control">
                        <input type="text" className={props.errors.direccion && 'error'} placeholder='Dirección' {...props.register('direccion', { required: true })} />
                        <input type="text" className={props.errors.numeracion && 'error'} placeholder='Numeración' {...props.register('numeracion', { required: true })} />
                        <input type="number" className={props.errors.codigo && 'error'} placeholder='Código Postal' {...props.register('codigo', { required: true, maxLength: 6, min: 1 })} />
                    </div>
                    <div className="Form-Control">
                        <input type="text" className={props.errors.ciudad && 'error'} placeholder='Ciudad' {...props.register('ciudad', { required: true })} />
                        <input type="text" className={props.errors.estado && 'error'} placeholder='Estado' {...props.register('estado', { required: true })} />
                    </div>
                    <div className="Form-Control">
                        <input type="text" className={props.errors.pais && 'error'} placeholder='País' {...props.register('pais', { required: true })} />
                    </div>
                </div>
            ) : ''}
        </>
    )
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
const FormTwo = props => {
    const social = ["Facebook", "Twitter", "Instagram", "Youtube", "TikTok", "Reddit", "Telegram", "Vimeo", "GitHub", "CodeSandbox", "Enlase Web", "SoundCloud", "Messenger", "Snapchat", "Spotify", "WhatsApp", "Apple Music"];
    const [rows, setRows] = useState([]);
    useEffect(() => {
        setRows([...props.social]);
    }, [props.social])
    const setSocial = (index) => {
        setRows(rows.concat({ icon: index, url: "", text: social[index] }));
        props.setRSocial(rows.concat({ icon: index, url: "", text: social[index] }));
    };
    const handleRemove = (index) => {
        const copyRows = [...rows];
        copyRows.splice(index, 1);
        setRows(copyRows);
        props.setRSocial(copyRows);
    };
    const handleOnChange = (index, name, value) => {
        const copyRows = [...rows];
        copyRows[index] = {
            ...copyRows[index],
            [name]: value
        };
        setRows(copyRows);
        props.setRSocial(copyRows);
    };
    return (
        <>
            <div className="header">
                <h3 className="header-menu">Información de Contacto 📞</h3>
                <div className="tooltip" style={{ left: "0px" }}>
                    <button type='button' onClick={props.handleOnAdd}><i className="fa-solid fa-plus"></i></button>
                    <span className="tooltiptext" style={{ left: "-30px", top: "-25px" }}>Agregar</span>
                </div>
            </div>
            {props.rows.map((row, index) => {
                return (
                    <>
                        <FormThoRow
                            {...row}
                            select={row.select}
                            input={row.title}
                            register={props.register}
                            watch={props.watch}
                            errors={props.errors}
                            onChange={(name, value) => props.handleOnChange(index, name, value)}
                            onRemove={() => props.handleOnRemove(index)}
                            key={index}
                        />
                    </>
                )
            })}
            <div className="header">
                <h3 className="header-menu">Redes Sociales 🌐</h3>
            </div>
            <div className="Form-Control row" style={{ marginBottom: "25px" }}>
                <div className='tiles'>
                    {social.map((row, index) => (
                        <div className="tooltip">
                            <Social
                                {...row}
                                key={index}
                                onClick={() => setSocial(index)}
                                position={index} />
                            <span className="tooltiptext">{row}</span>
                        </div>
                    ))}
                </div>
            </div>
            {rows.map((row, index) => (
                <div className='content-form social' style={{ marginTop: "-25px" }} key={index}>
                    <div className='icon-social'>
                        <Social {...row} onClick={() => handleRemove(index)} position={row.icon} />
                    </div>
                    <div className="Form-Control SOCIAL">
                        <input type="text" value={row.redirecionable} onChange={(e) => handleOnChange(index, 'redirecionable', e.target.value)} placeholder='🔗URL' />
                        <input type="text" value={row.url} onChange={(e) => handleOnChange(index, 'url', e.target.value)} placeholder='✏️Texto' />
                    </div>
                </div>
            ))}
        </>
    )
};
const PreviewsVcard = props => {
    const array = props.rows;
    return (
        <div className='caja' style={{ opacity: !props.watch('form') ? 1 : 0, transition: "all 0.3s ease-in", width: !props.watch('form') ? "100%" : "0" }}>
            <div className='caja-backAvatar' style={{ borderRadius: props.watch('radius') }}>
                {props.watch('image') === '' ? (<div className='caja-dinamica circleActive' />) : (<img src={props.watch('image')} style={{ borderRadius: props.watch('radius') }} className='caja-dinamica' alt='' />)}
            </div>
            {!props.watch('fondoActive') ? (
                <img src={props.watch('fondo')} alt='' className='caja-image' />
            ) : (
                <div className='caja-image' style={{ backgroundColor: props.watch('colorFondo') }} />
            )}
            <div className='caja-text'>
                <h2>{props.watch('name')}</h2>
                <p>{props.watch('position')}</p>
            </div>
            <div className='caja-button'>
                <a href={array.find(e => e.select === "Telefono Movil") !== undefined ? `tel: ${array.title}` : `#`}><button type='button' style={{ backgroundColor: props.watch('colorButton') }}><span className="fa-solid fa-phone"></span><p style={{ left: " -3px" }}>Llamar</p></button></a>
                <a href={array.find(e => e.select === "Email") !== undefined ? `mailto: ${array.title}` : `#`}><button type='button' style={{ backgroundColor: props.watch('colorButton') }}><span className="fa-solid fa-envelope"></span><p style={{ left: " -0.1px" }}>Email</p></button></a>
                <a href={array.find(e => e.select === "Pagina Web") !== undefined ? `${array.title}` : `#`}><button type='button' style={{ backgroundColor: props.watch('colorButton') }}><span className="fa-solid fa-globe"></span><p>Web</p></button></a>
                <a href={`https://www.google.com/maps/place/${array?.find(e => e.select === "Ubicación")?.title}`} target="_blank" rel="noopener noreferrer"><button type='button' style={{ backgroundColor: props.watch('colorButton') }}><span className='fa-solid fa-location-dot'></span><p style={{ left: "-13px" }}>Ubicacion</p></button></a>
            </div >
            <div className='caja-info'>
                <div className="header">
                    <h3 className="header-menu">Informacion Contacto 📞</h3>
                </div>
                {props.rows.map((row, index) => (
                    <div className={`content-form ${row.select}`} key={index}>
                        <button type='button' style={{ backgroundColor: props.watch('colorButton') }}><span className={row.icon}></span></button>
                        <Link>{row.title}</Link>
                        <p>{row.select}</p>
                    </div>
                ))}
                <div className="header">
                    <h3 className="header-menu">Redes Sociales 🌐</h3>
                </div>
                {props.social.map((row, index) => (
                    <div className='content-form social' key={index}>
                        <Social {...row} url="row.url" position={row.icon} />
                        <Link>{row.text}</Link>
                        <p>{row.url}</p>
                    </div>
                ))}
            </div>
        </div >
    )
};
const FormVcard = props => {
    const handefile = (e) => {
        if (e.target.files[0].type === 'image/jpeg' || e.target.files[0].type === 'image/png') {
            if (e.target.files[0].size > 5242880) {
                toast.error('esta imagen es muy grande');
            } else {
                const file = e.target.files[0];
                props.setValue('fileImage', file)
                const TmpPath = URL.createObjectURL(file);
                props.setValue('image', TmpPath);
            }
        } else {
            toast.error("esto no es una imagen");
        }
    };
    const handefondo = (e) => {
        if (e.target.files[0].type === 'image/jpeg' || e.target.files[0].type === 'image/png') {
            if (e.target.files[0].size > 5242880) {
                toast.error('esta imagen es muy grande');
            } else {
                const file = e.target.files[0]
                props.setValue('fileFondo', file)
                const TmpPath = URL.createObjectURL(file);
                props.setValue('fondo', TmpPath);
            }
        } else {
            toast.error("esto no es una imagen");
        }
    };
    return (
        <>
            <div className="header">
                <h3 className="header-menu">📇 Estilo de Vcard</h3>
            </div>
            <div className="Form-Control">
                <input type="text" className={props.errors.proyectName && 'error'} {...props.register('proyectName', { required: true })} placeholder="✏️ Nombre Proyecto" />
            </div>
            <div className="Form-Control">
                <input type="text" className={props.errors.name && 'error'} {...props.register('name', { required: true })} placeholder="✏️ Nombre" />
                <input type="text" className={props.errors.position && 'error'} {...props.register('position', { required: true })} placeholder="✏️ Posicion" />
            </div>
            <div className="Form-Control CUADRO">
                <input type="file" id='fondo1' {...props.register('originalImagenFondo', { onChange: handefondo })} style={{ display: "none" }} />
                <div className="tooltip" onClick={() => document.getElementById('color').click()}>
                    <button type='button' className={props.watch('fondoActive') === false ? 'cuadro' : 'cuadro active'} onClick={() => props.setValue('fondoActive', true)}>
                        <div className='circle' style={{ backgroundColor: props.watch('colorFondo') }} /></button>
                    <span className="tooltiptext" style={{ left: "-10px", top: "-25px" }}>Color Solido</span>
                    <input type="color" onClick={() => props.setValue('fondoActive', true)} className='circle' id='color' style={{ position: "relative", left: "20px", top: "-45px", opacity: 0 }} {...props.register('colorFondo')} />
                </div>
                <div className="tooltip" onClick={() => document.getElementById('fondo1').click()}>
                    <button type='button' className={props.watch('fondoActive') === true ? 'cuadro' : 'cuadro active'} onClick={() => props.setValue('fondoActive', false)}>
                        {props.watch('fondo') === '' ? (<div className='circle circleActive' />) : (<img src={props.watch('fondo')} alt='' className='circle' />)}
                    </button>
                    <span className="tooltiptext" style={{ width: "150px", left: "-10px", top: "-25px" }}>Imagen de Fondo</span>
                </div>
                <h4>Tipo de Fondo</h4>
                <div className="tooltip" style={{ marginLeft: "10px" }} onClick={() => document.getElementById('buton').click()}>
                    <button type='button' className={'cuadro'}>
                        <div className='circle' style={{ backgroundColor: props.watch('colorButton') }} /></button>
                    <span className="tooltiptext" style={{ width: "150px", left: "-10px", top: "-25px" }}>Color de Botones</span>
                    <input type="color" className='circle' id='buton' style={{ position: "relative", left: "20px", top: "-45px", opacity: 0 }} {...props.register('colorButton')} />
                </div>
                <h4>Color de Botones</h4>
            </div>
            <div className="header">
                <h3 className="header-menu">🖼️ Imagen Perfil</h3>
            </div>
            <div className="Form-Control IMG12" style={{ height: "100%" }}>
                <input type="file" id='file' {...props.register('originalImageprofile', { onChange: handefile })} />
                {props.watch('image') === '' ? (<div className='avatar circleActive' onClick={() => document.getElementById('file').click()} />) : (<img className={`avatar`} onClick={() => document.getElementById('file').click()} src={props.watch('image')} alt='' />)}
                <button type='button' className={props.watch('radius') === "50%" ? 'cuadro active' : 'cuadro'} onClick={() => props.setValue('radius', "50%")}>
                    {props.watch('image') === '' ? (<div className='circle circleActive' />) : (<img src={props.watch('image')} alt='' className={'circle'} />)}</button>
                <button type='button' className={props.watch('radius') === "4px" ? 'cuadro active' : 'cuadro'} onClick={() => props.setValue('radius', "4px")}>{props.watch('image') === '' ? (<div className='cuadre circleActive' />) : (<img src={props.watch('image')} alt='' className={'cuadre'} />)}</button>
                <h4>Margen de Imagen</h4>
            </div>
        </>
    );
};
const ButtonWizzar = props => {
    return (
        <div className="btn-container" style={{ marginTop: "15px" }}>
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
    const [margin, setMargin] = useState(props.data.imageOptions.margin);
    const [imagensize, setImagenzize] = useState(props.data.imageOptions.imageSize);
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
    const array1 = listOption.findIndex(element => element.qrCode === dataRow.dotsOptions.type);
    const array2 = listOptionEz.findIndex(element => element.qrCode === dataRow.cornersSquareOptions.type);
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