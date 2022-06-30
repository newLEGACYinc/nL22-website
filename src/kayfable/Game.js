import React, { useState, useEffect, Fragment } from "react";
import styles from './KayfableApp.module.css';
import Guess from './Guess';
import { Combobox } from '@headlessui/react'

function Game(props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [autoComplete, setAutoComplete] = useState([]);

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

    function matchFunction(searchTerm) {
        let suggestions = [];
        if (searchTerm.length > 0) {
            const regex = new RegExp(`${searchTerm}`, "i")
            suggestions = props.nameList.filter((v) => regex.test(v.gimmick));
        }
        const suggestionList = Array.from(new Set(suggestions.sort(compare).map(v => v.id))).map(id => {
            return suggestions.find(v => v.id === id)
        });
        return suggestionList.splice(0, 9)
    };

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
    };

    async function match(id) {
        if (id) {
            try {
                let guess = props.wrestlerList.find(x => x.id === id)
                if (!props.guesses.includes(guess)) {
                    const guessResponse = validateGuess(guess)
                    const newGuesses = [...props.guesses, guess];
                    props.guessCallback(newGuesses);
                    props.evaluationsCallback([...props.evaluations, guessResponse])
                    if (guessResponse.Correct === true) {
                        props.stateCallback("WIN");
                        let newStats = {
                            ...props.localStats, "games_won": props.localStats.games_won + 1, "games_played": props.localStats.games_played + 1,
                            "current_streak": props.localStats.current_streak + 1, attempts: { ...props.localStats.attempts, [props.guesses.length + 1]: props.localStats.attempts[props.guesses.length + 1] + 1 }
                        };
                        if (props.localStats.current_streak + 1 > props.localStats.max_streak) {
                            newStats = { ...newStats, "max_streak": props.localStats.current_streak + 1 }
                        }
                        props.localStatsCallback(newStats)
                        props.toggleModal();
                    } else if (props.guesses.length >= 9) {
                        props.stateCallback("LOSE");
                        let newStats = {
                            ...props.localStats, "games_played": props.localStats.games_played + 1, "current_streak": 0,
                            attempts: { ...props.localStats.attempts, "fail": props.localStats.attempts["fail"] + 1 }
                        };
                        props.localStatsCallback(newStats)
                        props.toggleModal();
                    }
                }
            } catch (error) {
                console.error(error);
            }
        } else {
            console.log("Nothing to match against");
        };
    };

    function validateGuess(data) {
        let result = props.answer
        let Correct;
        let Name;
        let Gender;
        let Age;
        let Age_HOL;
        let Country;
        let Debut;
        let Debut_HOL;
        let Height;
        let Height_HOL;
        let Weight;
        let Weight_HOL;
        let response;

        if (data.id === result.id) {
            response = {
                "Correct": true,
                "Name": 1,
                "Gender": 1,
                "Age": 1,
                "Age_HOL": 0,
                "Country": 1,
                "Debut": 1,
                "Debut_HOL": 0,
                "Height": 1,
                "Height_HOL": 0,
                "Weight": 1,
                "Weight_HOL": 0
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
                } else if (Math.abs(result.age - data.age) < 6) {
                    Age = 2
                } else {
                    Age = 0
                }
            }

            if (result.age > data.age) {
                Age_HOL = 1
            } else if (result.age < data.age) {
                Age_HOL = 2
            } else {
                Age_HOL = 0
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
                } else if (Math.abs(result.debut_year - data.debut_year) < 6) {
                    Debut = 2
                } else {
                    Debut = 0
                }
            }

            if (result.debut_year > data.debut_year) {
                Debut_HOL = 1
            } else if (result.debut_year < data.debut_year) {
                Debut_HOL = 2
            } else {
                Debut_HOL = 0
            }

            if (data.height === "N/A" || result.height === "N/A") {
                Height = 3
            } else {
                if (data.height === result.height) {
                    Height = 1
                } else if (Math.abs(result.height - data.height) < 6) {
                    Height = 2
                } else {
                    Height = 0
                }
            }

            if (result.height > data.height) {
                Height_HOL = 1
            } else if (result.height < data.height) {
                Height_HOL = 2
            } else {
                Height_HOL = 0
            }

            if (data.weight === "N/A" || result.weight === "N/A") {
                Weight = 3
            } else {
                if (data.weight === result.weight) {
                    Weight = 1
                } else if (Math.abs(result.weight - data.weight) < 6) {
                    Weight = 2
                } else {
                    Weight = 0
                }
            }

            if (result.weight > data.weight) {
                Weight_HOL = 1
            } else if (result.weight < data.weight) {
                Weight_HOL = 2
            } else {
                Weight_HOL = 0
            }

            response = {
                "Correct": Correct,
                "Name": Name,
                "Gender": Gender,
                "Age": Age,
                "Age_HOL": Age_HOL,
                "Country": Country,
                "Debut": Debut,
                "Debut_HOL": Debut_HOL,
                "Height": Height,
                "Height_HOL": Height_HOL,
                "Weight": Weight,
                "Weight_HOL": Weight_HOL
            }
        }
        return response;
    };

    return (
        <>
            <div className="flex flex-col justify-center text-center pt-4 md:pt-8">
                <div className='flex justify-center md:mb-4 pb-4'>
                    {props.gameStatus !== "IN PROGRESS" ?
                        <button type="button" onClick={props.toggleModal} className="text-white bg-blue-600 hover:text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-bold rounded-lg text-sm px-5 py-2 text-center">
                            <span>See Results</span>
                        </button>
                        : <div className="relative mt-6 md:max-w-lg pb-0 md:mx-auto">
                            <div className="flex">
                                <Combobox value={searchTerm} onChange={(id) => {
                                    setSearchTerm('');
                                    match(id);
                                }}>
                                    <Combobox.Input placeholder={`Guess ${props.guesses.length + 1} out of 10`}onChange={(event) => setSearchTerm(event.target.value)} className="w-64 md:w-80 border text-center rounded-md md:pl-4 md:pr-4 py-2 focus:border-indigo-600 focus:outline-none focus:shadow-outline" />
                                    {autoComplete.length > 0 && (
                                        <Combobox.Options className='absolute inset-x-0 top-full bg-blue-200 border border-blue-500 rounded-md z-20'>{autoComplete.map((definition, index) => (
                                            <Combobox.Option key={index} value={definition.id} as={Fragment}>
                                                {({ active }) => (
                                                    <li
                                                        className={`px-4 py-2 ${active ? 'bg-blue-500 text-white' : 'bg-indigo-200 text-blue-700'
                                                            }`}
                                                    >
                                                        {definition.name === definition.gimmick ? definition.name : `${definition.gimmick} (${definition.name})`}
                                                    </li>
                                                )}
                                            </Combobox.Option>))}
                                        </Combobox.Options>)}
                                </Combobox>
                            </div>
                        </div>
                    }
                </div>
                <div id="table-scroll" className={`${styles["kayfable-table"]} !text-sm md:!text-xl !w-full md:!w-4/5`}>
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
                            {props.guesses.length === props.evaluations.length &&
                                props.guesses.map((guess, index) => (
                                    <Guess
                                        key={`guess ${index}`}
                                        guess={guess}
                                        evaluations={props.evaluations[index]}
                                        hardMode={props.hardMode}
                                    />
                                ))}
                        </tbody>
                    </table>
                </div>
            </div >
        </>
    );
}

export default Game;
