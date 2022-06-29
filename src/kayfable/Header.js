import React, { useState, Fragment } from "react";
import {
    ChartBarIcon,
    InformationCircleIcon,
    CogIcon
} from '@heroicons/react/outline'
import { Switch, Dialog, Transition } from '@headlessui/react'
import logo from '../kayfable.svg';


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
        <div className="flex py-4 justify-center w-full items-center">
            <div className='h-8 w-8 cursor-pointer stroke-black dark:stroke-white' />
            <InformationCircleIcon onClick={openHelpModal} className='h-8 w-8 cursor-pointer stroke-black dark:stroke-white' />
            <Transition appear show={helpIsOpen} as={Fragment}>
                <Dialog
                    as="div"
                    onClose={closeHelpModal}
                    className="absolute z-10">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>
                    <div className={`${props.darkMode && 'dark'} fixed inset-0 flex items-center justify-center p-4`}>
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-slate-200 text-black dark:bg-slate-800 dark:text-white p-6 text-left align-middle shadow-xl transition-all ">
                                    <Dialog.Title className='text-sky-900 dark:text-sky-300 text-center text-xl md:text-3xl font-bold md:mb-10'>
                                        Guess the Wrestler
                                    </Dialog.Title>
                                    <ul className='list-disc mx-2 md:mx-8'>
                                        <li className="m-2">You get ten guesses.</li>
                                        <li className="m-2"><span className="bg-green-500 dark:bg-green-800 p-1">Green</span> in any column indicates a match!</li>
                                        <li className="m-2"><span className="bg-yellow-300 dark:bg-yellow-600 p-1">Yellow</span> in any column indicates 5 years within the number given.</li>
                                        <li className="m-2"><span className="bg-orange-400 dark:bg-orange-700 p-1">Orange</span> in any column indicates that there isn't information to compare with.</li>
                                        <li className="m-2">Hard Mode will hide if a guess in a column is higher or lower than the answer.</li>
                                        <li className="m-2">Wrestler data collected from <a href="https://www.cagematch.net" target="_blank" rel="noreferrer">Cagematch</a>.</li>
                                        <li className="m-2">A new Mystery Wrestler daily.</li>
                                        <li className='m-2'>Created by Sprite (<a href="https://twitter.com/i/user/473382081" target="_blank" rel="noreferrer">@CanOfSpriteMan</a>).</li>
                                    </ul>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            <div className='flex flex-col w-1/6 text-center items-center'>
                <img src={logo} />
                <div className='flex text-black text-sm md:text-lg font-bold'>The Wrestler Guessing Game</div>
            </div>
            <ChartBarIcon onClick={openStatsModal} className='h-8 w-8 cursor-pointer stroke-black dark:stroke-white' />
            <CogIcon onClick={openSettingsModal} className='h-8 w-8 cursor-pointer stroke-black dark:stroke-white' />

            <Transition appear show={statsIsOpen} as={Fragment}>
                <Dialog
                    as="div"
                    onClose={closeStatsModal}
                    className="absolute z-10">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>
                    <div className={`${props.darkMode && 'dark'} fixed inset-0 flex items-center justify-center p-4`}>
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-slate-200 text-black dark:bg-slate-800 dark:text-white p-6 text-left align-middle shadow-xl transition-all ">
                                    <Dialog.Title className='text-sky-900 dark:text-sky-300 text-center text-xl md:text-3xl font-bold md:mb-10'>
                                        Statistics
                                    </Dialog.Title>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
            <Transition appear show={settingsIsOpen} as={Fragment}>
                <Dialog
                    as="div"
                    onClose={closeSettingsModal}
                    className="absolute z-10">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>
                    <div className={`${props.darkMode && 'dark'} fixed inset-0 flex items-center justify-center p-4`}>
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-slate-200 text-black dark:bg-slate-800 dark:text-white p-6 text-left align-middle shadow-xl transition-all ">
                                    <Dialog.Title className='text-sky-900 dark:text-sky-300 text-center text-xl md:text-3xl font-bold md:mb-10'>
                                        Settings
                                    </Dialog.Title>
                                    <ul className='list-none mx-2 md:mx-8'>
                                        <li className="m-2">
                                            <Switch.Group>
                                                <Switch.Label className="mr-40">Hard Mode</Switch.Label>
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
                                                <Switch.Label className="mr-40">Dark Mode</Switch.Label>
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
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

        </div >
    )

}

export default Header;