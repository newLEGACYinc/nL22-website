import Modal from 'react-modal'
import React, { useState, useEffect } from "react";
import styles from './KayfableApp.module.css';

function Header(props) {
    const [helpIsOpen, setHelpIsOpen] = useState(false);
    const [settingsIsOpen, setSettingsIsOpen] = useState(false);
    const [statsIsOpen, setStatsIsOpen] = useState(false);

    function openHelpModal() {
        setHelpIsOpen(true);
    }

    function closeHelpModal() {
        setHelpIsOpen(false);
    }

    function openSettingsModal() {
        setSettingsIsOpen(true);
    }

    function closeSettingsModal() {
        setSettingsIsOpen(false);
    }

    function openStatsModal() {
        setStatsIsOpen(true);
    }

    function closeStatsModal() {
        setStatsIsOpen(false);
    }

    return (
        <div>
            <button onClick={openHelpModal}>Help</button>
            <button onClick={openStatsModal}>Stats</button>
            <button onClick={openSettingsModal}>Settings</button>
            <Modal
                isOpen={helpIsOpen}
                onRequestClose={closeHelpModal}
                contentLabel="Help Modal"
                className={styles["kayfable-modal"]}
                overlayClassName={styles["kayfable-overlay"]}
                appElement={document.getElementById('root')}>
                <button className='' onClick={closeHelpModal}>Close</button>
                <h2 className='text-sky-900 text-center text-xl md:text-3xl font-bold m-4 md:m-10'>Guess the Wrestler</h2>
                <ul className='list-disc mx-2 md:mx-8'>
                    <li className="m-2">You get ten guesses.</li>
                    <li className="m-2"><span className="bg-green-500 p-1">Green</span> in any column indicates a match!</li>
                    <li className="m-2"><span className="bg-yellow-300 p-1">Yellow</span> in any column indicates 5 years within the number given.</li>
                    <li className="m-2"><span className="bg-orange-400 p-1">Orange</span> in any column indicates that there isn't information to compare with.</li>
                    <li className="m-2">Hard Mode will hide if a guess in a column is higher or lower than the answer.</li>
                    <li className="m-2">Wrestler data collected from <a href="https://www.cagematch.net" target="_blank" rel="noreferrer">Cagematch</a>.</li>
                    <li className="m-2">A new Mystery Wrestler daily.</li>
                    <li className='m-2'>Created by Sprite (<a href="https://twitter.com/i/user/473382081" target="_blank" rel="noreferrer">@CanOfSpriteMan</a>).</li>
                </ul>
            </Modal>
            <Modal
                isOpen={statsIsOpen}
                onRequestClose={closeStatsModal}
                contentLabel="Stats Modal"
                className={styles["kayfable-modal"]}
                overlayClassName={styles["kayfable-overlay"]}
                appElement={document.getElementById('root')}>

            </Modal>
            <Modal
                isOpen={settingsIsOpen}
                onRequestClose={closeSettingsModal}
                contentLabel="Settings Modal"
                className={styles["kayfable-modal"]}
                overlayClassName={styles["kayfable-overlay"]}
                appElement={document.getElementById('root')}>
                <button className='' onClick={closeSettingsModal}>Close</button>
                <ul>
                    <li>
                        <input
                            type="checkbox"
                            checked={props.hardMode}
                            onChange={props.toggleDifficulty}
                            value="Hard Mode" 
                            disabled={props.guesses.length >= 1 ? true: false}/>
                        <span>Hard Mode</span></li>
                    <li>
                        <input
                            type="checkbox"
                            value="Dark Mode" />
                        <span>Dark Mode</span></li>
                </ul>

            </Modal>

        </div >
    )

}

export default Header;