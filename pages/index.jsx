import Image from 'next/image';
import Head from 'next/head';
import styles from '../styles/index.module.scss';
import logo from "../public/icons/logo.svg";
import { useState } from 'react';
import * as Api from "../api";
import { setCookie } from 'nookies';

const Index = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [isLoginForm, setLoginForm] = useState(false);

    const onSubmitLogin = async () => {
        try {
            const { token } = await Api.auth.login({
                email: email,
                password: password
            });


            setCookie(null, "_token", token, {
                path: "/",
            });

            location.href = "/main";
        } catch (err) {
            console.warn("LoginForm", err);
        }
    };

    const onSubmitRegistration = async () => {
        try {
            const { token } = await Api.auth.register ({
                fullName: fullName,
                email: email,
                password: password
            });


            setCookie(null, "_token", token, {
                path: "/",
            });

            location.href = "/main";
        } catch (err) {
            console.warn("LoginForm", err);
        }
    };


    return (
        <>
            <Head>
                <meta keywords="Ускорить песню, nightcore, speedup, slowed, замедлить песню, slowed music, blb" />
                <title>blbplanet</title>
            </Head>
            <div className={styles.mainWrapper}>
                <header className={styles.header}>
                    <Image
                        priority
                        src={logo}
                        alt="blbplanet logo!"
                        className={styles.logo}
                    />
                    <h1 className={styles.title}>Audio</h1>
                </header>

                {
                    isLoginForm ? (
                        <form onSubmit={(evt) => {
                            evt.preventDefault();
                            onSubmitLogin();
                        }} className={styles.form}>
                            <input type="email" placeholder='Email' onChange={(evt) => setEmail(evt.target.value)} />
                            <input type="password" placeholder='Password' onChange={(evt) => setPassword(evt.target.value)} />
                            <button type='submit'>Sign in</button>
                        </form>
                    ) : (
                        <form onSubmit={(evt) => {
                            evt.preventDefault();
                            onSubmitRegistration();
                        }} className={styles.form}>
                            <input type="text" placeholder='Full Name' onChange={(evt) => setFullName(evt.target.value)} />
                            <input type="email" placeholder='Email' onChange={(evt) => setEmail(evt.target.value)} />
                            <input type="password" placeholder='Password' onChange={(evt) => setPassword(evt.target.value)} />
                            <button type='submit'>Sign up</button>
                        </form>
                    )
                }


                <button onClick={() => {
                    setLoginForm(!isLoginForm);
                }} className={styles.btnToggle} type='button'>{isLoginForm ? "Sign Up" : "Sign In"}</button>
            </div>
        </>
    );
};

export default Index;


