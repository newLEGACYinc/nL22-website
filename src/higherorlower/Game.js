import React, { useState } from "react";
import axios from "axios";
import styles from './HoLApp.module.css';

function Option(props) {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [followers, setFollowers] = useState(0);
    const [img, setImg] = useState('');
    const [refresh, setRefresh] = useState(props.refresh);
    const [showHOL, setShowHOL] = useState(true);
    const [pos, setPos] = useState(props.cardPos);
    const [bg, setBg] = useState('');

    if (props.cardPos !== pos) {
        setPos(props.cardPos);
        if (props.cardPos === 2) {
            setRefresh(true);
            setTimeout(() => {
                setShowHOL(true);
            }, 1000);

        }
    }

    if (showHOL && props.cardPos === 0) {
        setShowHOL(false);
    }

    if (refresh) {
        if (props.cardPos !== 2) {
            setRefresh(false);
            axios.get('/api/higherorlower/data').then((res) => {
                props.refreshCallback();
                setName(res.data.name);
                setUsername(res.data.username);
                setFollowers(res.data.followers);
                setImg(res.data.profile_image)
                setBg(props.cardBg)
                props.followersCallback(res.data.followers);
            });
        } else {
            setRefresh(false);
            setTimeout(() => {
                axios.get('/api/higherorlower/data').then((res) => {
                    props.refreshCallback();
                    setName(res.data.name);
                    setUsername(res.data.username);
                    setFollowers(res.data.followers);
                    setImg(res.data.profile_image)
                    setBg(props.cardBg)
                    props.followersCallback(res.data.followers);
                })
            }, 750);
        }
    }

    function setHOL(guess) {
        const interval = 50;
        const animTime = 750;
        var frame = 0;

        const tween = Math.ceil(followers / interval)
        var answer = followers;
        var current = 0;
        setFollowers(current);
        setShowHOL(false);

        function numAnim() {
            current += tween;
            setFollowers(current);
            frame++;

            if (frame < interval && current < answer) {
                setTimeout(() => {
                    numAnim()
                }, animTime / interval);
            }
            else {
                current += (answer - current);
                setFollowers(current);
                setTimeout(() => {
                    props.guessCallback(guess)
                    setPos(0);
                    props.cardCallback(0);
                }, 1000);
            }
        }
        numAnim()
    }

    function comma(x) {
        return x.toString().split('').map((x, i, a) => ((a.length - i) % 3 === 0 && i !== 0 ? ',' : '') + x).join('')
    }

    return (
        <div className={`${styles['option-cont']} ${pos === 1 ? styles['option-cont-center'] : ''} ${pos === 0 ? styles['option-cont-left'] : ''} ${pos === 2 ? styles['option-cont-right'] : ''}`}
            style={{ background: `${bg}` }}>
            <div className={styles["opt-img"]}><img src={`${img}`} alt={`${name}`}></img></div>
            <div className={styles["opt-info"]}>
                <div className={styles["opt-name"]}>{name}</div>
                <div className={styles["opt-name"]}>{username}</div>
                <div className={styles["opt-small"]} style={{ display: showHOL ? 'none' : '' }}>has</div>
                <div className={styles["opt-big"]} style={{ display: showHOL ? 'none' : '' }}>{comma(followers.toString())}</div>
                <div className={styles["opt-small"]} style={{ display: showHOL ? 'none' : '' }}>followers</div>
                <div className={styles["opt-buttons"]} style={{ display: showHOL ? '' : 'none' }}>
                    <button className={`${styles["higher-btn"]} ${styles["HoL-button"]}`} onClick={() => setHOL('higher')}>Higher &#9650;</button><br />
                    <button className={`${styles["lower-btn"]} ${styles["HoL-button"]}`} onClick={() => setHOL('lower')}>Lower &#9660;</button>
                </div>
            </div>
        </div>
    )
}

function Game(props) {
    const [refresh1, setRefresh1] = useState(true);
    const [refresh2, setRefresh2] = useState(true);
    const [refresh3, setRefresh3] = useState(true);

    const [card1Pos, setCard1Pos] = useState(0);
    const [card2Pos, setCard2Pos] = useState(1);
    const [card3Pos, setCard3Pos] = useState(2);

    const [followers1, setFollowers1] = useState(0);
    const [followers2, setFollowers2] = useState(0);
    const [followers3, setFollowers3] = useState(0);

    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(() => {
        const savedResult = localStorage.getItem("highscore");
        if (savedResult === null)
            savedResult = localStorage.setItem("highscore", "0")
        return savedResult
    });

    function showMenu() {
        props.showGameCallback(false);
        props.showMenuCallback(true);
    }

    function showLose() {
        localStorage.setItem("score", score.toString())
        props.showGameCallback(false);
        props.showLoseCallback(true);
    }

    function posCallback1(num) {
        setCard1Pos(num);
        if (num === 0) {
            setCard2Pos(1)
            setCard3Pos(2)
        }
        if (num === 1) {
            setCard2Pos(2)
            setCard3Pos(0)
        }
        if (num === 2) {
            setCard2Pos(0)
            setCard3Pos(1)
        }
    }

    function posCallback2(num) {
        setCard2Pos(num);
        if (num === 0) {
            setCard3Pos(1)
            setCard1Pos(2)
        }
        if (num === 1) {
            setCard3Pos(2)
            setCard1Pos(0)
        }
        if (num === 2) {
            setCard3Pos(0)
            setCard1Pos(1)
        }
    }

    function posCallback3(num) {
        setCard3Pos(num);
        if (num === 0) {
            setCard1Pos(1)
            setCard2Pos(2)
        }
        if (num === 1) {
            setCard1Pos(2)
            setCard2Pos(0)
        }
        if (num === 2) {
            setCard1Pos(0)
            setCard2Pos(1)
        }

    }

    function refreshCard1() {
        console.log("refreshed card 1");
        setRefresh1(false);
    }

    function refreshCard2() {
        console.log("refreshed card 2");
        setRefresh2(false);
    }

    function refreshCard3() {
        console.log("refreshed card 3");
        setRefresh3(false);
    }

    function followersCallback1(num) {
        setFollowers1(num);
    }

    function followersCallback2(num) {
        setFollowers2(num);
    }

    function followersCallback3(num) {
        setFollowers3(num);
    }

    function updateScore(followers1, followers2) {
        if (followers1 >= followers2) {
            if ((score + 1) > highScore) {
                setHighScore(score + 1);
            }
            setScore(score + 1);
        } else {
            if (score > highScore) {
                setHighScore(score);
            }
            showLose();
        }
    }

    function checkGuess(guess) {
        if (guess === "higher") {
            if (card1Pos === 1) {
                updateScore(followers1, followers3)
            }
            if (card2Pos === 1) {
                updateScore(followers2, followers1)
            }
            if (card3Pos === 1) {
                updateScore(followers3, followers2)
            }
        }
        if (guess === "lower") {
            if (card1Pos === 1) {
                updateScore(followers3, followers1)
            }
            if (card2Pos === 1) {
                updateScore(followers1, followers2)
            }
            if (card3Pos === 1) {
                updateScore(followers2, followers3)
            }
        }
    }

    return (
        <div id="game-cont">
            <div className={styles["option-cont"]}>
                <div><Option refresh={refresh1} refreshCallback={refreshCard1} cardPos={card1Pos} cardCallback={posCallback1} followersCallback={followersCallback1} guessCallback={checkGuess} cardBg="linear-gradient(to bottom, rgba(235, 135, 119, 0.52), rgba(197, 0, 44, 0.73))" /></div>
                <div><Option refresh={refresh2} refreshCallback={refreshCard2} cardPos={card2Pos} cardCallback={posCallback2} followersCallback={followersCallback2} guessCallback={checkGuess} cardBg="linear-gradient(to bottom, rgba(116, 152, 228, 0.52), rgba(0, 81, 200, 0.73))" /></div>
                <div><Option refresh={refresh3} refreshCallback={refreshCard3} cardPos={card3Pos} cardCallback={posCallback3} followersCallback={followersCallback3} guessCallback={checkGuess} cardBg="linear-gradient(to bottom, rgba(113, 225, 125, 0.52), rgba(1, 129, 78, 0.73))" /></div>
            </div>
            <img src="images/gamelogo.png" alt="Home" className={styles["game-site-logo"]} style={{ filter: "drop-shadow(2px 2px 5px black)" }} onClick={() => showMenu()} />
            <div id={styles["high-score"]}>High Score: {highScore}</div>
            <div id={styles["score"]}>Score: {score}</div>
        </div>
    )
}

export default Game;