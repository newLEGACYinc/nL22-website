import styles from './HoLApp.module.css';
import React, { useState } from "react";
import Home from './Home';
import Game from './Game';
import Lose from './Lose';

function HoLApp() {
  const [showMenu, setShowMenu] = useState(true);
  const [showGame, setShowGame] = useState(false);
  const [showLose, setShowLose] = useState(false);

  function showMenuCallback(bool) {
    setShowMenu(bool);
  }

  function showGameCallback(bool) {
    setShowGame(bool);
  }

  function showLoseCallback(bool) {
    setShowLose(bool);
  }

  return (
    <div className={styles["HoL"]}>
      {showMenu
        ? <Home showMenuCallback={showMenuCallback} showGameCallback={showGameCallback} />
        : ""
      }
      {showGame
        ? <Game showMenuCallback={showMenuCallback} showGameCallback={showGameCallback} showLoseCallback={showLoseCallback} />
        : ""
      }
      {showLose
        ? <Lose showMenuCallback={showMenuCallback} showGameCallback={showGameCallback} showLoseCallback={showLoseCallback} />
        : ""
      }
    </div>
  );
}

export default HoLApp;
