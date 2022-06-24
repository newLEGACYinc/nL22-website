import styles from './KayfableApp.module.css';
import Game from './Game';
import Share from './Share';
import Modal from 'react-modal';
import axios from "axios";
import React, { useState, useEffect } from "react";

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

    const [showModal, setShowModal] = useState(false)

    useEffect(() => {
        getWrestlerList()
        getNameList();
        getLocalStats();
        getAnswer();
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

    async function getWrestlerList() {
        axios.get('/kayfable/check/database').then((res) => {
            setWrestlerList(res.data);
        })
    }

    async function getNameList() {
        axios.get('/kayfable/check/gimmick').then((res) => {
            setNameList(res.data);
        })
    }

    function getAnswer() {
        const savedResult = localStorage.getItem("gameState");
        axios.get('/kayfable/answer').then((res) => {
            let currentGame = JSON.parse(savedResult)
            if (savedResult === null || currentGame.game_id !== res.data.game_id) {
                let result = {
                    "guesses": [],
                    "evaluations": [],
                    "game_id": res.data.game_id,
                    "game_status": "IN PROGRESS"
                }
                localStorage.setItem("gameState", JSON.stringify(result))
                setGuesses([]);
                setEvaluations([]);
                setGameStatus("IN PROGRESS");
            }
            setAnswer(res.data)
        })
    }

    function toggleDifficulty() {
        setHardMode(!hardMode)
    }

    function toggleModal() {
        setShowModal(!showModal)
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
        <div>
            {isAppReady &&
                <div>
                    <header className={styles["kayfable-header"]}>{guesses.length < 1 &&
                        <div>
                            <input
                                type="checkbox"
                                checked={hardMode}
                                onChange={toggleDifficulty}
                                value="Hard Mode" />
                            <span>Hard Mode</span>
                        </div>}
                    </header>
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
                        toggleModal={toggleModal}
                    />
                    <Modal
                        isOpen={showModal}
                        contentLabel="Game Over Modal"
                        className={styles["kayfable-modal"]}
                        overlayClassName={styles["kayfable-overlay"]}
                        appElement={document.getElementById('root')}>
                        <div style={{ textAlign: 'center' }}>
                            <h2 style={{ fontSize: '1.5rem', lineHeight: '2rem', paddingTop: '0.5rem', paddingBottom: '0.5rem', fontWeight: '700' }}>
                                {gameStatus === 'WIN' ? "Good Job!" : "Better Luck Next Time"}
                            </h2>
                            <span>Today's Wrestler Was</span><br />
                            <span style={{ fontWeight: '700' }}>{answer.name}</span><br />
                            <Share result={gameStatus} evaluations={evaluations} answer={answer} hardMode={hardMode} /><br />
                            <a href={`https://www.cagematch.net/?id=2&nr=${answer.id}`} target="_blank" >View Cagematch Profile</a>
                        </div>
                    </Modal></div>}
        </div>
    )
}

export default KayfableApp;
