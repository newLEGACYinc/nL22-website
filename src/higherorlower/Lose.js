import styles from './HoLApp.module.css';
import { useState } from 'react'

function Lose(props) {
    const [newHighScore] = useState(() => {
        const prevHighScore = localStorage.getItem("highscore");
        const score = localStorage.getItem("score");
        console.log(prevHighScore)
        console.log(score)
        if (parseInt(score) > parseInt(prevHighScore)) {
            localStorage.setItem("highscore", score);
            return true;
        } else {
            return false;
        }
    })
    
    function showGame() {
        props.showLoseCallback(false)
        props.showGameCallback(true)
    }

    function showMenu() {
        props.showLoseCallback(false)
        props.showMenuCallback(true)
    }

    return (
        <div id={styles["lose-cont"]}>
            <div className={styles['lose-center']}>
                {newHighScore ?
                    <img src="images/highscore.png" alt="Sadge" className={styles["sadge"]} style={{ filter: "drop-shadow(2px 2px 5px black)" }} /> :
                    <img src="images/lose.png" alt="Sadge" className={styles["sadge"]} style={{ filter: "drop-shadow(2px 2px 5px black)" }} />}
                {newHighScore ?
                    <div className={styles["lose-desc"]}>You got a new high score!</div> :
                    <div className={styles["lose-desc"]}>You lost!</div>}
                <div id={styles["lose-score"]}>You got a score of {localStorage.getItem("score")}!</div>
                <button className={styles["HoL-button"]} style={{ marginTop: "25px" }} onClick={() => showGame()}>Play Again</button><br />
                <button className={styles["HoL-button"]} style={{ marginTop: "25px" }} onClick={() => showMenu()}>Home</button>
            </div>
        </div>
    )
}

export default Lose;