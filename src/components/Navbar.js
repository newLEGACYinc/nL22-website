import styles from './Navbar.module.css';
import logo from '../logo.svg';

function Logo() {
    return (
        <div>
            <a href="/">
                <div className={styles["logo-wrap"]}>
                    <img src={logo} style={{'width': '10rem', 'marginTop': '-8rem'}} />
                </div>
            </a>
        </div>
    );
}

function Navbar() {
    return (
        <nav>
            <ul className={styles["navbar"]}>
                <li><a href="/higherorlower">Higher or Lower</a></li>
                {/* <li><a href="/kayfable">Kayfable</a></li>
                <li><a href="/">About</a></li> */}
            </ul>
        </nav>
    );
}

function Header() {
    return (
        <header className={styles['navbar-header']}>
            <div className={styles["h-container"]}>
                <Logo />
                <Navbar />
            </div>
        </header>
    );
}


export default Header;