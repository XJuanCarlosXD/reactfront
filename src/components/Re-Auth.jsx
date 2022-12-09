import React from 'react';
import { useForm } from "react-hook-form";
import { GithubAuthProvider, signInWithPopup, OAuthProvider, signInWithEmailAndPassword, GoogleAuthProvider, FacebookAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { auth } from '../firebase/firebase';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import StepWizard from 'react-step-wizard';

const ReAuth = props => {
    React.useEffect(() => {
        document.querySelector('.left-side').style.display = 'none';
        document.querySelector('.rekpa').classList.remove('app');
        document.querySelector('.rjii').classList.add('wide');
    }, [])
    return (
        <div className="main-container">
            <div className={`content-wrapper`}>
                <StepWizard>
                    <Login />
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
                reauthenticateWithCredential(userCredential.user, userCredential)
            }).then(() => {
                toast.success('Usuario re-autenticado');
                navigate('/Cuenta');
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
                reauthenticateWithCredential(result.user, credential)
            }).then(() => {
                toast.success('Usuario re-autenticado');
                navigate('/Cuenta')
            })
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
                reauthenticateWithCredential(result.user, credential)
            }).then(() => {
                toast.success('Usuario re-autenticado');
                navigate('/Cuenta')
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
                reauthenticateWithCredential(credential.user, credential)
            }).then(() => {
                toast.success('Usuario re-autenticado');
                navigate('/Cuenta');
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
                reauthenticateWithCredential(result.user, credential)
            }).then(() => {
                toast.success('Usuario re-autenticado');
                navigate('/Cuenta');
            })
            .catch((error) => {
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
        <div className="iphone login">
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

export default ReAuth;