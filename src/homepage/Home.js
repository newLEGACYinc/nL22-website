
import { ReactComponent as Logo } from '../logo.svg';
import styles from './Home.module.css';
import Sound from 'react-sound';
import Sick from '../music/Sick.mp3';
import React, { useState } from "react";

function Homepage() {
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <div className={styles['Homepage']}>
            <Sound
                url={Sick}
                playStatus={isPlaying ? Sound.status.PLAYING : Sound.status.STOPPED}
                playFromPosition={0}
                volume={10}
                loop={true}
            />
            <div className={styles["Homepage-cont"]}>
                <h1>WELCOME TO</h1>
                <Logo fill="white" className={styles["Homepage-logo"]} width="20%" height="20%" onClick={() => setIsPlaying(!isPlaying)} style=
                    {{ animation: isPlaying ? `${styles["Homepage-logo-wobble"]} infinite 5s linear` : '' }}/>
            </div>
        </div>
    );
}

export default Homepage;
