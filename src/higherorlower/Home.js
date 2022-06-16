import styles from './HoLApp.module.css';

function Home(props) {

    function showGame() {
        props.showMenuCallback(false)
        props.showGameCallback(true)
    }

    return (
        <div id={styles["home-cont"]}>
            <img src="images/gamelogo.png" alt="Game Logo" className={styles["site-logo"]} style={{ filter: "drop-shadow(2px 2px 5px black)" }} />

            <div className={styles["description"]}><div className={styles["desc-title"]}>Find out who is more over (on Twitter)</div><div id={styles["mode-desc"]}>Choose the wrestler with the higher follower count!</div></div>

            <div className={styles["buttons"]}>
                <img src="images/buttonlogo.png" alt="New game" className={styles["button-logo"]} id="lfrog" /><button id="ytbtn" onClick={() => showGame()} className={`${styles["wlogo"]} ${styles["HoL-button"]}`}>&nbsp;&nbsp;&nbsp;&nbsp;New Game</button>
            </div>
        </div>
    );
}

export default Home;