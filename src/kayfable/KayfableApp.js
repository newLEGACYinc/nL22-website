import styles from './KayfableApp.module.css';
import Game from './Game';
import Share from './Share';
import Modal from 'react-modal';
import { Dialog, Transition } from '@headlessui/react'
import Header from './Header';
import axios from "axios";
import React, { useState, useEffect, Fragment } from "react";

function KayfableApp() {
    const [isAppReady, setIsAppReady] = useState(false);
    const [wrestlerList, setWrestlerList] = useState([]);
    const [nameList, setNameList] = useState([]);

    const [gameStatus, setGameStatus] = useState(() => {
        const savedResult = localStorage.getItem("gameState");
        if (savedResult !== null) {
            const gameState = JSON.parse(savedResult);
            return gameState.game_status;
        }
        return "IN PROGRESS";
    })

    const [guesses, setGuesses] = useState(() => {
        const savedResult = localStorage.getItem("gameState");
        if (savedResult !== null) {
            const gameState = JSON.parse(savedResult);
            return gameState.guesses;
        }
        return [];
    })

    const [evaluations, setEvaluations] = useState(() => {
        const savedResult = localStorage.getItem("gameState");
        if (savedResult !== null) {
            const gameState = JSON.parse(savedResult);
            return gameState.evaluations;
        }
        return [];
    })

    const [answer, setAnswer] = useState(() => {
        const savedResult = localStorage.getItem("gameState");
        if (savedResult !== null) {
            return {
                "game_id": savedResult.game_id,
                "id": "",
                "name": "",
                "gender": "",
                "age": "",
                "birth_place": "",
                "debut_year": "",
                "height": "",
                "weight": "",
            }
        }
        return "";
    })

    const [localStats, setLocalStats] = useState(() => {
        const savedResult = localStorage.getItem("localStats");
        if (savedResult !== null) {
            const local = JSON.parse(savedResult);
            return local;
        }
        return {
            "current_streak": 0,
            "max_streak": 0,
            "attempts": { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0, "9": 0, "10": 0, "fail": 0 },
            "games_played": 0,
            "games_won": 0,
            "average_attempts": 0,
            "hard_mode": false
        };
    })

    const [hardMode, setHardMode] = useState(() => {
        const savedResult = localStorage.getItem("localStats");
        if (savedResult !== null) {
            const local = JSON.parse(savedResult);
            return local.hard_mode;
        }
        return false;
    })

    const [darkMode, setDarkMode] = useState(() => {
        const savedResult = localStorage.getItem("localStats");
        if (savedResult !== null) {
            const local = JSON.parse(savedResult);
            return local.hard_mode;
        }
        return false;
    })

    const [showModal, setShowModal] = useState(false)

    useEffect(() => {
        getData();
        getLocalStats();
        setIsAppReady(true);
    }, [])

    function getLocalStats() {
        const savedResult = localStorage.getItem("localStats");
        if (savedResult !== null) {
            const local = JSON.parse(savedResult);
            setLocalStats(local);
        } else {
            let stats = {
                "current_streak": 0,
                "max_streak": 0,
                "attempts": { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0, "9": 0, "10": 0, "fail": 0 },
                "games_played": 0,
                "games_won": 0,
                "average_attempts": 0,
                "hard_mode": false
            };
            localStorage.setItem("localStats", JSON.stringify(stats));
            setLocalStats(stats);
        }
    }

    function getData() {
        const savedResult = localStorage.getItem("gameState");
        axios.get('/api/kayfable/data').then((res) => {
            let currentGame = JSON.parse(savedResult)
            if (savedResult === null || currentGame.game_id !== res.data.answer.game_id) {
                let result = {
                    "guesses": [],
                    "evaluations": [],
                    "game_id": res.data.answer.game_id,
                    "game_status": "IN PROGRESS"
                }
                localStorage.setItem("gameState", JSON.stringify(result))
                setGuesses([]);
                setEvaluations([]);
                setGameStatus("IN PROGRESS");
            }
            setWrestlerList(res.data.wrestlers)
            setNameList(res.data.gimmicks)
            setAnswer(res.data.answer)
        })

    }

    function toggleDifficulty() {
        if (guesses.length < 1) {
            setHardMode(!hardMode)
        }
    }

    function toggleDarkMode() {
        setDarkMode(!darkMode)
    }

    function openModal() {
        setShowModal(true)
    }

    function closeModal() {
        setShowModal(false)
    }

    function guessCallback(guesses) {
        setGuesses(guesses);
    }

    function evaluationsCallback(evals) {
        setEvaluations(evals)
    }

    function stateCallback(gameState) {
        setGameStatus(gameState);
    }

    function localStatsCallback(stats) {
        setLocalStats(stats);
    }

    useEffect(() => {
        let newStats = {
            ...localStats, "hard_mode": hardMode
        };
        setLocalStats(newStats)
    }, [hardMode])

    useEffect(() => {
        const savedResult = localStorage.getItem("gameState");
        if (savedResult !== null) {
            const gameState = JSON.parse(savedResult)
            gameState.game_status = gameStatus
            localStorage.setItem("gameState", JSON.stringify(gameState))
        }
    }, [gameStatus]);

    useEffect(() => {
        const savedResult = localStorage.getItem("localStats");
        if (savedResult !== null) {
            localStorage.setItem("localStats", JSON.stringify(localStats))
        }
    }, [localStats]);

    useEffect(() => {
        const savedResult = localStorage.getItem("gameState");
        if (savedResult !== null) {
            const gameState = JSON.parse(savedResult)
            gameState.guesses = guesses
            localStorage.setItem("gameState", JSON.stringify(gameState))
        }
    }, [guesses.length, guesses]);

    useEffect(() => {
        const savedResult = localStorage.getItem("gameState");
        if (savedResult !== null) {
            const gameState = JSON.parse(savedResult)
            gameState.evaluations = evaluations
            localStorage.setItem("gameState", JSON.stringify(gameState))
        }
    }, [evaluations.length, evaluations]);

    return (
        <div className={`${darkMode && 'dark'}`}>
            <div className="flex flex-col bg-slate-200 dark:bg-slate-800 h-screen w-screen">
                {isAppReady &&
                    <>
                        <Header
                            guesses={guesses}
                            hardMode={hardMode}
                            darkMode={darkMode}
                            toggleDifficulty={toggleDifficulty}
                            toggleDarkMode={toggleDarkMode} />
                        <div className="justify-center flex-grow lg:m-auto">
                            <Game
                                wrestlerList={wrestlerList}
                                nameList={nameList}
                                localStats={localStats}
                                answer={answer}
                                guesses={guesses}
                                evaluations={evaluations}
                                gameStatus={gameStatus}
                                hardMode={hardMode}
                                guessCallback={guessCallback}
                                evaluationsCallback={evaluationsCallback}
                                stateCallback={stateCallback}
                                localStatsCallback={localStatsCallback}
                                toggleModal={openModal}
                            />
                            <Transition appear show={showModal} as={Fragment}>
                                <Dialog
                                    as="div"
                                    onClose={closeModal}
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
                                    <div className="fixed inset-0 flex items-center justify-center p-4">

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
                                                            {gameStatus === 'WIN' ? "Good Job!" : "Better Luck Next Time"}
                                                    </Dialog.Title>

                                                    <span>Today's Wrestler Was</span><br />
                                                    <span style={{ fontWeight: '700' }}>{answer.name}</span><br /><br />
                                                    <Share result={gameStatus} evaluations={evaluations} answer={answer} hardMode={hardMode} /><br />
                                                    <a href={`https://www.cagematch.net/?id=2&nr=${answer.id}`} target="_blank" rel="noreferrer">View Cagematch Profile</a>
                                                </Dialog.Panel>
                                            </Transition.Child>
                                        </div>
                                    </div>
                                </Dialog>
                            </Transition>
                        </div>
                    </>
                }
            </div>
        </div>
    )
}

export default KayfableApp;
