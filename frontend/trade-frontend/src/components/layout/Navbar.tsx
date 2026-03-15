import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";

type NavbarProps = {
  title?: string;
};

export default function Navbar({ title = "Trade Tracker" }: NavbarProps) {
  return (
    <header className={styles.navbar}>
      <div className={styles.brand}>
        <span className={styles.logo}>📈</span>
        <h1>{title}</h1>
      </div>

      <nav className={styles.links}>
        <Link to="/">Trades</Link>
        <Link to="/login">Login</Link>
      </nav>
    </header>
  );
}