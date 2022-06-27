import Modal from 'react-modal'
import React, { useState, useEffect } from "react";
import styles from './KayfableApp.module.css';
import {
    ChartBarIcon,
    InformationCircleIcon,
    CogIcon,
    XIcon
} from '@heroicons/react/outline'
import { Switch } from '@headlessui/react'


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
        <div className="flex py-4 justify-center bg-pickleBlue w-full items-center">
            <InformationCircleIcon onClick={openHelpModal} className='h-8 w-8 cursor-pointer stroke-black' />
            <ChartBarIcon onClick={openStatsModal} className='h-8 w-8 cursor-pointer stroke-black' />
            <CogIcon onClick={openSettingsModal} className='h-8 w-8 cursor-pointer stroke-black' />
            <Modal
                isOpen={helpIsOpen}
                onRequestClose={closeHelpModal}
                contentLabel="Help Modal"
                className={styles["kayfable-modal"]}
                overlayClassName={styles["kayfable-overlay"]}
                appElement={document.getElementById('root')}>
                <XIcon className='h-8 w-8 cursor-pointer stroke-black mt-4' onClick={closeHelpModal} />
                <h2 className='text-sky-900 text-center text-xl md:text-3xl font-bold md:mb-10'>Guess the Wrestler</h2>
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
                <XIcon className='h-8 w-8 cursor-pointer stroke-black mt-4' onClick={closeSettingsModal} />
                <h2 className='text-sky-900 text-center text-xl md:text-3xl font-bold md:mb-4'>Settings</h2>
                <ul className='list-none mx-2 md:mx-8'>
                    <li className="m-2">
                        <Switch.Group>
                            <Switch.Label className="mr-80">Hard Mode</Switch.Label>
                            <Switch
                                checked={props.hardMode}
                                onChange={props.toggleDifficulty}
                                className={`${props.hardMode ? 'bg-blue-600' : 'bg-gray-200'
                                    } relative inline-flex h-6 w-11 items-center rounded-full`} >
                                <span
                                    className={`transform transition ease-in-out duration-200 
                                    ${props.hardMode ? 'translate-x-6' : 'translate-x-1'
                                        } inline-block h-4 w-4 transform rounded-full bg-white`}
                                />
                            </Switch>
                        </Switch.Group>
                    </li>
                    <li className="m-2">
                        <Switch.Group>
                            <Switch.Label className="mr-80">Dark Mode</Switch.Label>
                            <Switch
                                checked={props.darkMode}
                                onChange={props.toggleDarkMode}
                                className={`${props.darkMode ? 'bg-blue-600' : 'bg-gray-200'
                                    } relative inline-flex h-6 w-11 items-center rounded-full`} >
                                <span
                                    className={`transform transition ease-in-out duration-200 
                                    ${props.darkMode ? 'translate-x-6' : 'translate-x-1'
                                        } inline-block h-4 w-4 transform rounded-full bg-white`}
                                />
                            </Switch>
                        </Switch.Group>
                    </li>
                </ul>

            </Modal>

        </div >
    )

}

export default Header;