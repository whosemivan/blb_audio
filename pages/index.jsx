'use client';
import Image from 'next/image';
import Head from 'next/head';
import { Howl } from 'howler';
import React, { useState, useEffect } from 'react';
import { saveAs } from 'file-saver';
import audioBufferToWav from 'audiobuffer-to-wav';
import { AudioContext } from 'standardized-audio-context';
import styles from '../styles/index.module.scss';
import logo from "../public/icons/logo.svg";

const Main = () => {
    const [audioName, setAudioName] = useState('');
    const [isFileUploaded, setFileUploaded] = useState(false);
    const [speed, setSpeed] = useState(1);
    const [sound, setSound] = useState();
    // i decided to do this state, because audio has AudioBufer object only when it plays, when i stop it, AudioBuffer = null, i should do it because my programm is depened of AudioBuffer object.
    const [audioBuf, setAudioBuf] = useState({});
    const [isPlay, setPlay] = useState(false);
    const [isBegin, setBegin] = useState(true);
    const [isLoad, setLoad] = useState(false);

    useEffect(() => {
        speedChange();
    }, [speed])

    const handleFileSelect = async (event) => {
        const file = event.target.files[0];
        const fileUrl = URL.createObjectURL(file);
        setAudioName(event.target.files[0].name);

        if (event.target.files[0].size > 283613579) {
            alert("File is too big!");
            return;
        };

        if (file) {
            setFileUploaded(true);

            const soundHowl = new Howl({
                src: [fileUrl], // Replace with the path to your audio file
                rate: speed, // Initial playback rate (normal speed)
                format: ["mp3", "opus", "ogg", "wav", "aac", "m4a", "m4b", "mp4", "webm"],
                onend: function () {
                    setPlay(false);
                },
                onload: function () {
                    setLoad(true);
                }
            });

            soundHowl.mobileAutoEnable = false;
            soundHowl.autoUnlock = false;
            // soundHowl.play()
            // setPlay(true);
            setSound(soundHowl);
        }
    }

    const handlePlay = () => {
        if (!isPlay) {
            sound.play();
            setAudioBuf(sound._sounds[0]._node.bufferSource.buffer);
            setPlay(true);
            setBegin(false);
        }
    };

    const handleStop = () => {
        setAudioBuf(sound._sounds[0]._node.bufferSource.buffer);
        // setBegin(false);

        if (sound && isPlay) {
            sound.stop();
            setPlay(false);
        }
    }

    const speedChange = () => {
        if (sound) {
            sound._rate = speed;
        }
    }

    const handleDownload = () => {
        if (sound) {
            const audioCtx = new AudioContext();
            // save in wav format
            const audioBuffer = audioCtx.createBuffer(2, audioBuf.length, audioBuf.sampleRate * speed);
            audioBuffer.copyToChannel(audioBuf.getChannelData(0), 0);
            audioBuffer.copyToChannel(audioBuf.getChannelData(1), 1);
            const wav = audioBufferToWav(audioBuffer);
            const wavBlob = new Blob([new DataView(wav)], { type: 'audio/wav' });
            saveAs(wavBlob, `blb_planet.wav`);
        };
    }

    const handleBackBtn = () => {
        setAudioName('');
        setFileUploaded(false);
        setBegin(true);

        if (isPlay) {
            setPlay(false);
            sound.stop();
        }
        setSound();
        setLoad(false);
    }


    return (
        <>
            <Head>
                <meta keywords="Ускорить песню, nightcore, speedup, slowed, замедлить песню, slowed music, blb" />
                <link rel="icon" href="/icons/logo.svg" sizes="any" />
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
                                <input className={styles.range} type="range" id="speed" name="speed" min="0.5" max="3" step="0.1" value={speed} onChange={(evt) => {
                                    setSpeed(evt.target.value);
                                }} disabled={isPlay ? 'disabled' : ''} />
                                <div className={styles.btnWrapper}>
                                    <button className={styles.playBtn} onClick={isPlay ? handleStop : handlePlay} disabled={!isLoad ? 'disabled' : ''}>
                                        {isPlay ? "Stop" : "Play"}
                                    </button>

                                    <button className={styles.downloadBtn} onClick={handleDownload} disabled={isBegin ? 'disabled' : ''}>Download</button>
                                    <button className={styles.backBtn} onClick={handleBackBtn}>Back</button>
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
            <footer className={styles.footer}>
                <nav className={styles.nav}>
                    <ul className={styles.list}>
                        <li className={styles.item}>
                            <a className={styles.link} href="https://linktr.ee/blbplanet" target="_blank">©blb projects</a>
                        </li>
                        <li className={styles.item}>
                            20222
                        </li>
                        <li className={styles.item}>
                            <a className={styles.link} href="https://www.donationalerts.com/r/alienba6y_blb" target="_blank">
                                donate
                            </a>
                        </li>
                    </ul>
                </nav>
            </footer>
        </>
    );
};

export default Main;


