'use client';
import Image from 'next/image';
import Head from 'next/head';
import { Howl } from 'howler';
import React, { useState } from 'react';
import { saveAs } from 'file-saver';
import audioBufferToWav from 'audiobuffer-to-wav';
import { AudioContext } from 'standardized-audio-context';
import styles from '../styles/main.module.scss';
import logo from "../public/icons/logo.svg";
import nookies from 'nookies';
import axios from '../core/axios.js';
import * as Api from "../api";

const Main = () => {
    const audioRef = React.createRef(null);
    const soundRef = React.createRef(null);
    const [audioSrc, setAudioSrc] = useState('');
    const [audioName, setAudioName] = useState('');
    const [isFileUploaded, setFileUploaded] = useState(false);
    const [speed, setSpeed] = useState(1);

    const handlePlay = () => {
        if (audioRef.current) {
            const sound = new Howl({
                src: [audioSrc], // Replace with the path to your audio file
                rate: speed, // Initial playback rate (normal speed)
                format: ["mp3", "opus", "ogg", "wav", "aac", "m4a", "m4b", "mp4", "webm"]
            });

            // Start playing the audio

            sound.play();

            soundRef.current = sound;
            console.log(soundRef.current);
        }
    };

    const handleChange = () => { }

    function handleFileSelect(event) {
        const file = event.target.files[0];
        const fileUrl = URL.createObjectURL(file);
        setAudioName(event.target.files[0].name);

        setAudioSrc(fileUrl);

        if (file) {
            setFileUploaded(true);
        }
    }

    function handleDownload() {
        console.log(soundRef.current);
        if (soundRef.current) {
            console.log('here');
            const audioCtx = new AudioContext();
            const sound = soundRef.current;

            // save in wav format
            const audioBuffer = audioCtx.createBuffer(2, sound._sounds[0]._node.bufferSource.buffer.length, sound._sounds[0]._node.bufferSource.buffer.sampleRate * speed);
            audioBuffer.copyToChannel(sound._sounds[0]._node.bufferSource.buffer.getChannelData(0), 0);
            audioBuffer.copyToChannel(sound._sounds[0]._node.bufferSource.buffer.getChannelData(1), 1);
            const wav = audioBufferToWav(audioBuffer);
            const wavBlob = new Blob([new DataView(wav)], { type: 'audio/wav' });
            saveAs(wavBlob, `${audioName}_blb<3.wav`);
        };
    }

    function handleStop() {
        if (soundRef.current) {
            soundRef.current.stop();
        }
    }

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
                <div className={styles.audioWrapper}>

                    {
                        isFileUploaded ? (
                            <>
                                <h2 className={styles.titleAudio}>{audioName}</h2>
                                <p className={styles.audioSpeed}>{speed}x</p>
                                <audio ref={audioRef} />
                                <input className={styles.range} type="range" id="speed" name="speed" min="0.5" max="3" step="0.1" value={speed} onChange={(evt) => {
                                    setSpeed(evt.target.value)
                                }} />
                                <div className={styles.btnWrapper}>
                                    <button className={styles.playBtn} onClick={handlePlay}>
                                        Play
                                    </button>
                                    {/* <button className={styles.playBtn} onClick={handleStop}>
                                        Stop
                                    </button> */}

                                    <button className={styles.downloadBtn} onClick={handleDownload}>Download</button>
                                </div>
                            </>
                        ) : (
                            <>
                                <label htmlFor="file-upload" className={styles.labelSelect}>
                                    Select audio
                                </label>
                                <input className={styles.btnSelect} id="file-upload" type="file" onChange={handleFileSelect} />
                            </>
                        )
                    }

                </div>
            </div>
        </>
    );
};

export const getServerSideProps = async (ctx) => {
    const { _token } = nookies.get(ctx);

    console.log(_token);

    axios.defaults.headers.Authorization = "Bearer " + _token;

    try {
        await Api.auth.getMe();

        return {
            props: {},
        };
    } catch (err) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };
    }
};


export default Main;


