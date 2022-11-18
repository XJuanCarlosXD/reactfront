import React from 'react';
import { useForm } from "react-hook-form";
import StepWizard from "react-step-wizard";
import { createUserWithEmailAndPassword, GithubAuthProvider, signInWithPopup, OAuthProvider, signInWithEmailAndPassword, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { auth } from '../firebase/firebase';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Auth = props => {
    React.useEffect(() => {
        document.querySelector('.left-side').style.display = 'none';
        document.querySelector('.rjii').classList.add('wide');
    })
    return (
        <div className="main-container">
            <div className={`content-wrapper`}>
                <StepWizard>
                    <Login />
                    <Register />
                </StepWizard>
            </div>
        </div>
    );
};

const Login = props => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const onSubmit = async (data) => {
        const { email, password } = data;
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log(user);
                toast('Seccion iniciada Bienvenido!', {
                    icon: '🙋‍♂️',
                });
            }).then(() => {
                navigate('/');
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode);
                toast(
                    `📛 ${errorMessage}`,
                    {
                        duration: 6000,
                    }
                );
            });
    };
    const SingInGoogle = () => {
        const provider = new GoogleAuthProvider();
        provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
        signInWithPopup(auth, provider)
            .then((result) => {
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                console.log(token);
                const user = result.user;
                console.log(user);
                toast('Seccion iniciada Bienvenido!', {
                    icon: '🙋‍♂️',
                })
            }).then(() => navigate('/'))
            .catch((error) => {
                console.log(error.code);
                console.log(error.customData.email);
                console.log(GoogleAuthProvider.credentialFromError(error));
                toast(
                    error.message,
                    {
                        duration: 6000,
                    }
                );
            });
    };
    const SingInFacebook = () => {
        const provider = new FacebookAuthProvider();
        provider.addScope('user_birthday');
        signInWithPopup(auth, provider)
            .then((result) => {
                const credential = FacebookAuthProvider.credentialFromResult(result);
                const accessToken = credential.accessToken;
                console.log(accessToken);
                const user = result.user;
                console.log(user);
                toast('Seccion iniciada Bienvenido!', {
                    icon: '🙋‍♂️',
                })
            })
            .catch((error) => {
                console.log(error.code);
                console.log(error.customData.email);
                console.log(FacebookAuthProvider.credentialFromError(error));
                toast(
                    `❌ ${error.message}`,
                    {
                        duration: 6000,
                    }
                );
            });
    };
    const SingInMicrosoft = () => {
        const provider = new OAuthProvider('microsoft.com');
        provider.addScope('mail.read');
        provider.addScope('calendars.read');
        signInWithPopup(auth, provider)
            .then((result) => {
                const credential = OAuthProvider.credentialFromResult(result);
                const accessToken = credential.accessToken;
                const idToken = credential.idToken;
                console.log(accessToken);
                console.log(idToken);
                toast('Seccion iniciada Bienvenido!', {
                    icon: '🙋‍♂️',
                })
            })
            .catch((error) => {
                toast(
                    `❌ ${error.message}`,
                    {
                        duration: 6000,
                    }
                );
            });
    };
    const SingInGithub = () => {
        const provider = new GithubAuthProvider();
        signInWithPopup(auth, provider)
            .then((result) => {
                const credential = GithubAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                const user = result.user;
                console.log(token);
                console.log(user);
                toast('Seccion iniciada Bienvenido!', {
                    icon: '🙋‍♂️',
                })
            }).catch((error) => {
                console.log(error.code);
                console.log(error.customData.email);
                console.log(GithubAuthProvider.credentialFromError(error));
                toast(
                    `❌ ${error.message}`,
                    {
                        duration: 6000,
                    }
                );
            });
    };
    return (
        <div className="iphone">
            <div className='form-login'>
                <header className="header">
                    <h2 className="header-menu">Iniciar Sesión</h2>
                </header>
                <form className='login' onSubmit={handleSubmit(onSubmit)}>
                    <div className="Form-Control">
                        <input type="email" className={errors.email && 'error'} {...register('email', { required: true })} placeholder="✏️ Email" />
                    </div>
                    <div className="Form-Control">
                        <input type="password" autoComplete='off' className={errors.password && 'error'} {...register('password', { required: true })} placeholder="🔑 Contraseña" />
                    </div>
                    <div className='btn-login'>
                        <button className="button button--full" type="submit"><i className="fa-solid fa-arrow-right-to-bracket"></i>Iniciar Sesión</button>
                    </div>
                    <div className='reLink'>
                        <a href='#s' onClick={() => props.nextStep()}>No tienes una cuenta registrate</a>
                    </div>
                </form>
                <fieldset className='mt-3'>
                    <legend>Otras forma de iniciar sesión</legend>
                </fieldset>
            </div>
            <div className='btns-login'>
                <button type='button' onClick={SingInGoogle} className='google'><i className="fa-brands fa-google"></i> Google</button>
                <button type='button' onClick={SingInFacebook} className='facebook'><i className="fa-brands fa-facebook"></i> Facebook</button>
                <button type='button' onClick={SingInMicrosoft} className='microsoft'><i className="fa-brands fa-microsoft"></i> Microsoft</button>
                <button type='button' onClick={SingInGithub} className='github'><i className="fa-brands fa-github"></i> Github</button>
            </div>
        </div>
    )
}
const Register = props => {
    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const onSubmit = async (data) => {
        await createUserWithEmailAndPassword(auth, data.email, data.password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log(user);
                reset({ name: '', email: '', password: '', confirm: '' });
                toast('Usuario creado Bienvenido a la familia VcardDO!', {
                    icon: '🙋‍♂️',
                });
            }).then(() => {
                navigate('/');
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode);
                toast(
                    `📛 ${errorMessage}`,
                    {
                        duration: 6000,
                    }
                );
            });
    };
    const SingInGoogle = () => {
        const provider = new GoogleAuthProvider();
        provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
        signInWithPopup(auth, provider)
            .then((result) => {
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                console.log(token);
                const user = result.user;
                console.log(user);
                toast('usuario creado Bienvenido!', {
                    icon: '🙋‍♂️',
                })
            }).then(() => navigate('/'))
            .catch((error) => {
                console.log(error.code);
                console.log(error.customData.email);
                console.log(GoogleAuthProvider.credentialFromError(error));
                toast(
                    error.message,
                    {
                        duration: 6000,
                    }
                );
            });
    };
    const SingInFacebook = () => {
        const provider = new FacebookAuthProvider();
        provider.addScope('user_birthday');
        signInWithPopup(auth, provider)
            .then((result) => {
                const credential = FacebookAuthProvider.credentialFromResult(result);
                const accessToken = credential.accessToken;
                console.log(accessToken);
                const user = result.user;
                console.log(user);
                toast('Seccion iniciada Bienvenido!', {
                    icon: '🙋‍♂️',
                })
            })
            .catch((error) => {
                console.log(error.code);
                console.log(error.customData.email);
                console.log(FacebookAuthProvider.credentialFromError(error));
                toast(
                    error.message,
                    {
                        duration: 6000,
                    }
                );

                // ...
            });
    };
    const SingInMicrosoft = () => {
        const provider = new OAuthProvider('microsoft.com');
        provider.addScope('mail.read');
        provider.addScope('calendars.read');
        signInWithPopup(auth, provider)
            .then((result) => {
                const credential = OAuthProvider.credentialFromResult(result);
                const accessToken = credential.accessToken;
                const idToken = credential.idToken;
                console.log(accessToken);
                console.log(idToken);
                toast('Usuario creado Bienvenido!', {
                    icon: '🙋‍♂️',
                })
            })
            .catch((error) => {
                toast(
                    `❌ ${error.message}`,
                    {
                        duration: 6000,
                    }
                );
            });
    };
    const SingInGithub = () => {
        const provider = new GithubAuthProvider();
        signInWithPopup(auth, provider)
            .then((result) => {
                const credential = GithubAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                const user = result.user;
                console.log(token);
                console.log(user);
                toast('Usuario creado Bienvenido!', {
                    icon: '🙋‍♂️',
                })
            }).catch((error) => {
                console.log(error.code);
                console.log(error.customData.email);
                console.log(GithubAuthProvider.credentialFromError(error));
                toast(
                    `❌ ${error.message}`,
                    {
                        duration: 6000,
                    }
                );
            });
    };
    return (
        <div className="iphone">
            <div className='form-register'>
                <header className="header">
                    <h2 className="header-menu">Registrase</h2>
                </header>
                <form className='login' onSubmit={handleSubmit(onSubmit)}>
                    <div className="Form-Control">
                        <input type="text" autoComplete='off' className={errors.name && 'error'} {...register('name', {
                            required: "⚠️ Debe especificar un nombre usuario", minLength: {
                                value: 8,
                                message: "⚠️ El nombre usuario debe tener al menos 8 caracteres"
                            }, maxLength: {
                                value: 15,
                                message: "⚠️ El nombre usuario solo admite 15 caracteres"
                            }
                        })} placeholder="✏️ Nombre Usuario" />
                    </div>
                    {errors.name && <p className='error-message'>{errors.name.message}</p>}
                    <div className="Form-Control">
                        <input type="email" autoComplete='off' className={errors.email && 'error'} {...register('email', { required: "⚠️ Debe especificar un email" })} placeholder="✏️ Email" />
                    </div>
                    {errors.email && <p className='error-message'>{errors.email.message}</p>}
                    <div className="Form-Control">
                        <input type="password" autoComplete='off' className={errors.password && 'error'} {...register('password', {
                            required: "⚠️ Debe especificar una contraseña", minLength: {
                                value: 8,
                                message: "⚠️ La contraseña debe tener al menos 8 caracteres"
                            }
                        })} placeholder="🔑 Contraseña" />
                    </div>
                    {errors.password && <p className='error-message'>{errors.password.message}</p>}
                    <div className="Form-Control">
                        <input type="password" autoComplete='off' className={errors.confirm && 'error'} {...register('confirm', {
                            required: true, validate: (val) => {
                                if (watch('password') !== val) {
                                    return "⚠️ Las contraseñas no coinciden";
                                }
                            },
                        })} placeholder="🔑 Confirmar Contraseña" />
                    </div>
                    {errors.confirm && <p className='error-message'>{errors.confirm.message}</p>}
                    <div className='btn-login'>
                        <button className="button button--full" type="submit"><i className="fa-solid fa-user-plus"></i> Registrase</button>
                    </div>
                    <div className='reLink'>
                        <a href='#s' onClick={() => props.previousStep()}>Ya tienes una cuenta inicia sesión</a>
                    </div>
                </form>
                <fieldset className='mt-3'>
                    <legend>Otras forma de registrase</legend>
                </fieldset>
            </div>
            <div className='btns-login'>
                <button type='button' onClick={SingInGoogle} className='google'><i className="fa-brands fa-google"></i> Google</button>
                <button type='button' onClick={SingInFacebook} className='facebook'><i className="fa-brands fa-facebook"></i> Facebook</button>
                <button type='button' onClick={SingInMicrosoft} className='microsoft'><i className="fa-brands fa-microsoft"></i> Microsoft</button>
                <button type='button' onClick={SingInGithub} className='github'><i className="fa-brands fa-github"></i> Github</button>
            </div>
        </div>
    )
}

export default Auth;