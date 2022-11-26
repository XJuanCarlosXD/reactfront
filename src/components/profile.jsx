import React from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase/firebase';
import { onAuthStateChanged, updateProfile, updatePassword, reauthenticateWithCredential } from "firebase/auth";
import { useForm } from "react-hook-form";
import { Loading } from './proyect';
import toast from 'react-hot-toast';

/** Perfil Usuario */
export const Profile = props => {
    const { register, handleSubmit, watch, formState: { errors }, setValue } = useForm();
    const [isActive, setIsActive] = React.useState('');
    React.useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log(user)
                setValue('displayName', user.displayName);
                setValue('photoURL', user.photoURL);
                setValue('email', user.email);
                setValue('phoneNumber', user.phoneNumber);
            }
        });
    }, [])
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
                        <div className='caja-backAvatar' style={{ position: "relative", margin: "0 auto" }}>
                            <img src={watch('photoURL')} className='caja-dinamica' alt='' />
                        </div>
                        <h2>{watch('displayName')}</h2>
                        <h4>{watch('email')}</h4>
                        <div className='vcard-create'>
                            <h2>3</h2>
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
                        <button type="submit" className='content-button' style={{ float: 'right', position: 'relative', right: '7vh', top: '-8px' }}>
                            <i className="fa-solid fa-floppy-disk"></i> Guardar
                        </button>
                    </div>
                </form>
                <Password setIsActive={(value) => { setIsActive(value) }} />
                <Loading isActive={isActive} />
            </div>
        </div>
    );
};

export const Password = props => {
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
            <div className='Form-vcard password'>
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
                <button type="submit" className='content-button' style={{ float: 'right', position: 'relative', right: '7vh', top: '-8px' }}>
                    <i className="fa-solid fa-floppy-disk"></i> Guardar
                </button>
            </div>
        </form>
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
