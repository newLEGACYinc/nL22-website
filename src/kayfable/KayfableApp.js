import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from './KayfableApp.module.css';

function Guess(props) {
    return (
        <tr>
            {props.evaluations.Name === 1 ?
                <th style={{ background: "#00ff2b", width: "20%" }}>{props.guess.name}</th> :
                <th style={{ background: "#fff", width: "20%" }}>{props.guess.name}</th>}
            {
                props.evaluations.Gender === 1 ?
                    <td style={{ background: "#00ff2b" }}>{props.guess.gender}</td> :
                    <td style={{ background: "#fff" }}>{props.guess.gender}</td>
            }
            {props.evaluations.Age === 1 ?
                <td style={{ background: "#00ff2b" }}>{props.guess.age}</td> : <>{
                    props.evaluations.Age === 2 ?
                        <td style={{ background: "#FFFF00" }}>{props.guess.age}</td> :
                        <>{
                            props.evaluations.Age === 3 ?
                                <td style={{ background: "#FFA500" }}>{props.guess.age}</td> :
                                <td style={{ background: "#fff" }}>{props.guess.age}</td>
                        }</>
                }</>
            }
            {
                props.evaluations.Country === 1 ?
                    <td style={{ background: "#00ff2b" }}>{props.guess.birth_place}</td> :
                    <td style={{ background: "#fff" }}>{props.guess.birth_place}</td>
            }
            {
                props.evaluations.Debut === 1 ?
                    <td style={{ background: "#00ff2b" }}>{props.guess.debut_year}</td> : <>{
                        props.evaluations.Debut === 2 ?
                            <td style={{ background: "#FFFF00" }}>{props.guess.debut_year}</td> :
                            <>{
                                props.evaluations.Debut === 3 ?
                                    <td style={{ background: "#FFA500" }}>{props.guess.debut_year}</td> :
                                    <td style={{ background: "#fff" }}>{props.guess.debut_year}</td>
                            }</>
                    }</>
            }
            {
                props.evaluations.Height === 1 ?
                    <td style={{ background: "#00ff2b" }}>{props.guess.height}</td> : <>{
                        props.evaluations.Height === 2 ?
                            <td style={{ background: "#FFFF00" }}>{props.guess.height}</td> :
                            <>{
                                props.evaluations.Height === 3 ?
                                    <td style={{ background: "#FFA500" }}>{props.guess.height}</td> :
                                    <td style={{ background: "#fff" }}>{props.guess.height}</td>
                            }</>
                    }</>
            }
            {
                props.evaluations.Weight === 1 ?
                    <td style={{ background: "#00ff2b" }}>{props.guess.weight}</td> : <>{
                        props.evaluations.Weight === 2 ?
                            <td style={{ background: "#FFFF00" }}>{props.guess.weight}</td> :
                            <>{
                                props.evaluations.Weight === 3 ?
                                    <td style={{ background: "#FFA500" }}>{props.guess.weight}</td> :
                                    <td style={{ background: "#fff" }}>{props.guess.weight}</td>
                            }</>
                    }</>
            }
        </tr >

    );
}

function KayfableApp() {
    const [searchTerm, setSearchTerm] = useState('');
    const [wrestlerList, setWrestlerList] = useState([]);
    const [nameList, setNameList] = useState([]);
    const [autoComplete, setAutoComplete] = useState([]);

    const [gameStatus, setGameStatus] = useState(() => {
        const savedResult = localStorage.getItem("gameState");
        if (savedResult !== null) {
            const gameState = JSON.parse(savedResult);
            return gameState.game_status;
        }
        return "IN PROGRESS";
    })

    const [answer, setAnswer] = useState(() => {
        const savedResult = localStorage.getItem("gameState");
        if (savedResult !== null) {
            const gameState = JSON.parse(savedResult);
            return gameState.answer;
        }
        return "";
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

    const [localStats, setLocalStats] = useState(() => {
        const savedResult = localStorage.getItem("localStats");
        if (savedResult !== null) {
            const local = JSON.parse(savedResult);
            return local;
        }
        return "";
    })

    async function getWrestlerList() {
        axios.get('/kayfable/check/database').then((res) => {
            setWrestlerList(res.data);
        })
    };

    async function getNameList() {
        axios.get('/kayfable/check/gimmick').then((res) => {
            setNameList(res.data);
        })
    };

    useEffect(() => {
        getWrestlerList()
        getNameList();
        getLocalStats();
        getAnswer();
    }, [])

    useEffect(() => {
        async function searchFunction() {
            if (searchTerm.length) {
                try {
                    const searchAutoComplete = matchFunction(searchTerm);
                    setAutoComplete(() => searchAutoComplete);
                } catch (error) {
                    console.error(error);
                }

            } else {
                setAutoComplete([])
            }
        };
        searchFunction();
    }, [searchTerm])

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
                "average_attempts": 0
            };
            localStorage.setItem("localStats", JSON.stringify(stats));
            setLocalStats(stats);
        }
    }

    function matchFunction(searchTerm) {
        let suggestions = [];
        if (searchTerm.length > 0) {
            const regex = new RegExp(`${searchTerm}`, "i")
            suggestions = nameList.filter((v) => regex.test(v.gimmick));
        }
        const suggestionList = Array.from(new Set(suggestions.sort(compare).map(v => v.id))).map(id => {
            return suggestions.find(v => v.id === id)
        });
        return suggestionList.splice(0, 9)
    }

    function compare(a, b) {
        const gimmickA = a.gimmick.toUpperCase();
        const gimmickB = b.gimmick.toUpperCase();

        var comparison = 0;
        var x = gimmickA.match(searchTerm.toUpperCase())
        var y = gimmickB.match(searchTerm.toUpperCase())
        if (x.index === y.index) {
            if (gimmickA > gimmickB) {
                comparison = 1
            } else if (gimmickA < gimmickB) {
                comparison = -1
            }
        }
        else if (x.index > y.index) {
            comparison = 1;
        } else if (x.index < y.index) {
            comparison = -1;
        }
        return comparison;
    }

    async function match(id) {
        if (id) {
            try {
                let guess = wrestlerList.find(x => x.id === id)
                console.log(guess)
                console.log(answer)
                const guessResponse = validateGuess(guess)
                const newGuesses = [...guesses, guess];
                setGuesses(newGuesses);
                setEvaluations([...evaluations, guessResponse])
                if (guessResponse.Correct === true) {
                    setGameStatus("WIN");
                    let newStats = {
                        ...localStats, "games_won": localStats.games_won + 1, "games_played": localStats.games_played + 1,
                        "current_streak": localStats.current_streak + 1, attempts: { ...localStats.attempts, [guesses.length + 1]: localStats.attempts[guesses.length + 1] + 1 }
                    };
                    if (localStats.current_streak + 1 > localStats.max_streak) {
                        newStats = { ...newStats, "max_streak": localStats.current_streak + 1 }
                    }
                    setLocalStats(newStats)
                } else if (guesses.length >= 9) {
                    setGameStatus("LOSE");
                    let newStats = {
                        ...localStats, "games_played": localStats.games_played + 1, "current_streak": 0,
                        attempts: { ...localStats.attempts, "fail": localStats.attempts["fail"] + 1 }
                    };
                    setLocalStats(newStats)
                }
            } catch (error) {
                console.error(error);
            }
        } else {
            console.log("Nothing to match against");
        };
    }

    function validateGuess(data) {
        let result = answer
        let Correct;
        let Name;
        let Gender;
        let Age;
        let Country;
        let Debut;
        let Height;
        let Weight;
        let response;

        if (data.id === result.id) {
            response = {
                "Correct": true,
                "Name": 1,
                "Gender": 1,
                "Age": 1,
                "Country": 1,
                "Debut": 1,
                "Height": 1,
                "Weight": 1
            }
        } else {
            Correct = false;
            Name = 0;

            if (data.gender === result.gender) {
                Gender = 1
            } else {
                Gender = 0
            }

            if (data.age === "N/A" || result.age === "N/A") {
                Age = 3
            } else {
                if (data.age === result.age) {
                    Age = 1
                } else if (Math.abs(result.age - data.age) < 5) {
                    Age = 2
                } else {
                    Age = 0
                }
            }

            if (data.birth_place === result.birth_place) {
                Country = 1
            } else {
                Country = 0
            }

            if (data.debut_year === "N/A" || result.debut_year === "N/A") {
                Debut = 3
            } else {
                if (data.debut_year === result.debut_year) {
                    Debut = 1
                } else if (Math.abs(result.debut_year - data.debut_year) < 5) {
                    Debut = 2
                } else {
                    Debut = 0
                }
            }

            if (data.debut_year === "N/A" || result.debut_year === "N/A") {
                Debut = 3
            } else {
                if (data.debut_year === result.debut_year) {
                    Debut = 1
                } else if (Math.abs(result.debut_year - data.debut_year) < 5) {
                    Debut = 2
                } else {
                    Debut = 0
                }
            }

            if (data.height === "N/A" || result.height === "N/A") {
                Height = 3
            } else {
                if (data.height === result.height) {
                    Height = 1
                } else if (Math.abs(result.height - data.height) < 5) {
                    Height = 2
                } else {
                    Height = 0
                }
            }

            if (data.weight === "N/A" || result.weight === "N/A") {
                Weight = 3
            } else {
                if (data.weight === result.weight) {
                    Weight = 1
                } else if (Math.abs(result.weight - data.weight) < 5) {
                    Weight = 2
                } else {
                    Weight = 0
                }
            }

            response = {
                "Correct": Correct,
                "Name": Name,
                "Gender": Gender,
                "Age": Age,
                "Country": Country,
                "Debut": Debut,
                "Height": Height,
                "Weight": Weight
            }
        }
        return response;
    }

    function handleSelect(id) {
        setSearchTerm('');
        match(id);
    };

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

    return (
        <div className={styles["Kayfable"]}>
            <h2>Kayfable</h2>
            <h3>A Wrestling Wordle-like Game</h3>

            {gameStatus !== "IN PROGRESS" ?
                <button>See Results</button> :
                <div className={styles["kayfable-guess-area"]}>
                    <form>
                        <input
                            className={styles["kayfable-dropdown-input"]}
                            type="text"
                            placeholder={`Guess ${guesses.length + 1} out of 10`}
                            onChange={(e) => { setSearchTerm(e.target.value); }}
                            value={searchTerm || ""}
                            required></input>
                    </form>
                    {autoComplete.length > 0 &&
                        <ul className={styles["kayfable-dropdown-list"]}>
                            {
                                autoComplete.map((definition, index) => (
                                    <li
                                        className={styles["kayfable-dropdown-content"]}
                                        key={index}
                                        onClick={() => handleSelect(definition.id)}>
                                        {definition.name === definition.gimmick ? definition.name : `${definition.gimmick} (${definition.name})`}
                                    </li>
                                ))
                            }

                        </ul>
                    }
                </div>}
            <div className={styles["kayfable-table"]}>
                <table>
                    <thead>
                        <tr>
                            <th scope="col">Name</th>
                            <th scope="col">Gender</th>
                            <th scope="col">Age</th>
                            <th scope="col">Country of Birth</th>
                            <th scope="col">Debut Year</th>
                            <th scope="col">Height (cm)</th>
                            <th scope="col">Weight (kg)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {guesses.length === evaluations.length &&
                            guesses.map((guess, index) => (
                                <Guess
                                    key={`guess ${index}`}
                                    guess={guess}
                                    evaluations={evaluations[index]}
                                />
                            ))}
                    </tbody>
                </table>
            </div>
        </div >
    );
}

export default KayfableApp;
