import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebase';
import { onAuthStateChanged, updateProfile, updatePassword, deleteUser } from "firebase/auth";
import { ref as reference, uploadBytes, getDownloadURL, ref, deleteObject } from "firebase/storage";
import { collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { storage } from '../firebase/firebase';
import { useForm } from "react-hook-form";
import { Loading } from './proyect';
import toast from 'react-hot-toast';

/** Perfil Usuario */
export const Profile = props => {
    const { register, handleSubmit, watch, formState: { errors }, setValue } = useForm({ defaultValues: { count: 0 } });
    const [isActive, setIsActive] = React.useState('');
    const [photoactive, setPhotoactive] = React.useState('');
    const VcardDataColletion = collection(db, "VcardData");
    React.useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                setValue('displayName', user.displayName);
                setValue('photoURL', user.photoURL);
                setValue('email', user.email);
                setValue('phoneNumber', user.phoneNumber);
                const uid = user.uid;
                const q = query(VcardDataColletion, where("uid", "==", uid));
                await getDocs(q).then((res) => {
                    setValue('count', res.docs.map((doc) => (doc.id)).length);
                })
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setValue])
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
        setPhotoactive('active');
        const spaceRef = reference(storage, `/photos/${Date.now()}`);
        uploadBytes(spaceRef, file).then(onSnapshot => {
            console.log('Uploaded a blob or file!', onSnapshot);
        }).then(async () => {
            const downloadURL = await getDownloadURL(spaceRef);
            setValue('photoURL', downloadURL);
            updateProfile(auth.currentUser, {
                photoURL: downloadURL
            })
        }).then(() => setPhotoactive('')).catch(error => console.log(error))
    };
    const Iuser = (data) => {
        setIsActive('is-active');
        updateProfile(auth.currentUser, {
            displayName: data.displayName, phoneNumber: data.phoneNumber
        }).then(() => {
            setIsActive('');
            toast.success('Usuario actualizado');
        }).catch((error) => {
            console.log(error);
        });
    }
    return (
        <div className="main-container">
            <div className="main-header">
                <Link className="menu-link-main" href="#">Perfil</Link>
            </div>
            <div className="content-wrapper">
                <div className='content-form'>
                    <div className='Form-vcard profile'>
                        <div className="header">
                            <h3 className="header-menu">Mi Cuenta 🧑‍🏫</h3>
                        </div>
                        <div className='caja-backAvatar' style={{ position: "relative", margin: "0 auto" }} onClick={() => document.getElementById('userPhoto')?.click()}>
                            <img src={watch('photoURL')} className={`caja-dinamica ${photoactive}`} alt='' />
                            <input type="file" onChange={handefondo} id='userPhoto' hidden />
                        </div>
                        <h2>{watch('displayName')}</h2>
                        <h4>{watch('email')}</h4>
                        <div className='vcard-create'>
                            <h2>{watch('count')}</h2>
                            <h4>Proyectos Activos 🟢</h4>
                        </div>
                    </div>
                </div>
                <form onSubmit={handleSubmit(Iuser)} className='content-form'>
                    <div className='Form-vcard'>
                        <div className="header">
                            <h3 className="header-menu">Informacion de Contacto ☎️</h3>
                        </div>
                        <div className='Form-Control contacss'>
                            <input type="text" className={errors.displayName && 'error'} placeholder='✏️ Nombre Completo' {...register('displayName', { required: true })} />
                            <input type="text" placeholder='📧 Email' value={watch('email')} disabled />
                        </div>
                        <div className='Form-Control' style={{ width: "50%" }}>
                            <input type="text" className={errors.phoneNumber && 'error'} {...register('phoneNumber', { required: true })} placeholder='📱 Numero Telefonico' />
                        </div>
                        <div className="header" style={{ height: "10px" }}></div>
                        <button type="submit" className='content-button deletp'>
                            <i className="fa-solid fa-floppy-disk"></i> Guardar
                        </button>
                    </div>
                </form>
                <Password setIsActive={(value) => { setIsActive(value) }} />
                <DeleteACOUNT />
                <Loading isActive={isActive} />
            </div>
        </div>
    );
};

const Password = props => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const onSubmit = (data) => {
        props.setIsActive('is-active');
        updatePassword(auth.currentUser, data.password).then(() => {
            props.setIsActive('')
        }).catch((error) => {
            console.log(error);
        });
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)} className='content-form'>
            <div className='Form-vcard'>
                <div className="header">
                    <h3 className="header-menu">Contraseña ✏️</h3>
                </div>
                <div className="Form-Control contacss">
                    <input type="password" autoComplete='off' className={errors.password && 'error'} {...register('password', {
                        required: "⚠️ Debe especificar una contraseña", minLength: {
                            value: 8,
                            message: "⚠️ La contraseña debe tener al menos 8 caracteres"
                        }
                    })} placeholder="🔑 Nueva contraseña" />
                    <input type="password" autoComplete='off' className={errors.confirm && 'error'} {...register('confirm', {
                        required: true, validate: (val) => {
                            if (watch('password') !== val) {
                                return "⚠️ Las contraseñas no coinciden";
                            }
                        },
                    })} placeholder="🔑 Confirma nueva contraseña" />
                </div>
                {errors.password && <p className='error-message'>{errors.password.message}</p>}
                {errors.confirm && <p className='error-message'>{errors.confirm.message}</p>}
                <div className="header" style={{ height: "10px" }}></div>
                <button type="submit" className='content-button deletp'>
                    <i className="fa-solid fa-floppy-disk"></i> Guardar
                </button>
            </div>
        </form>
    );
};
const DeleteACOUNT = props => {
    const [text, setText] = React.useState('');
    const navigate = useNavigate();
    const deleteAccount = (t) => {
        setText('');
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const uid = user.uid;
                const VcardDataColletion = collection(db, "VcardData");
                const q = query(VcardDataColletion, where("uid", "==", uid));
                await getDocs(q).then((res) => {
                    const data = res.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
                    data.forEach((row) => {
                        const photos = [];
                        if (row?.profile?.img !== '' ? new URL(row?.profile?.img).host : '' === 'firebasestorage.googleapis.com') {
                            photos.push(row?.profile?.img)
                        }
                        if (row?.profile?.fondo !== '' ? new URL(row?.profile?.fondo).host : '' === 'firebasestorage.googleapis.com') {
                            photos.push(row?.profile?.fondo)
                        }
                        if (user.photoURL !== '' ? new URL(user.photoURL).host : '' === 'firebasestorage.googleapis.com') {
                            photos.push(user.photoURL)
                        }
                        deleteObject(ref(storage, `${photos.map((x) => (x))}`))
                            .then(() => deleteDoc(doc(db, "VcardData", row.id)))
                            .catch(error => {
                                console.log(error);
                                toast.error('Ha ocurrido un error al eliminar la cuenta');
                            })
                    })
                    deleteUser(auth.currentUser).then(() => {
                        toast('Cuenta eliminada!', { icon: '🙋‍♂️', });
                        navigate('/');
                    })
                }).then(() => toast.dismiss(t.id))
            }
        })
    }
    return (
        <div className='content-form'>
            <div className='Form-vcard'>
                <div className="header text-header">
                    <h3 className="header-menu">Estado de cuenta 📛</h3>
                    <p>Eliminar mi cuenta y toda la información que contenga en ella.</p>
                </div>
                <button type="button" className='content-button deletp' onClick={() => {
                    toast((t) => (
                        <span>
                            Se eliminara la cuenta <b>actual</b><br />
                            <p style={{ fontSize: '13px', marginBottom: '-20px' }}>Escriba la siguiente frase a continuacion</p><br />
                            <b style={{ fontSize: '9px', color: 'rgb(254, 66, 86)' }}>"Si deseo eliminar mi cuenta y todos los datos que contenga"</b>
                            <div className='Form-Control'>
                                <input type="text" onChange={(e) => setText(e.target.value)} style={{ width: '280px', height: '70%', fontSize: '9px', position: 'relative', right: '6.5vh' }} />
                            </div>
                            <button
                                className='content-button'
                                style={{ position: 'relative', background: 'rgb(254, 66, 86)', top: '-15px', left: '8vh' }}
                                onClick={() => deleteAccount(t)}
                                disabled={text === 'Si deseo eliminar mi cuenta y todos los datos que contenga' ? false : true}>
                                <i className="fa-solid fa-user-xmark"></i> Eliminar Cuenta
                            </button>
                        </span>
                    ));
                }} style={{ background: 'rgb(254, 66, 86)' }}>
                    <i className="fa-solid fa-user-xmark"></i> Eliminar Cuenta
                </button>
            </div>
        </div>
    );
};