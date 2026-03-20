import { Link, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";
import { useAppSelector, useAppDispatch } from "../../hooks/reduxHooks";
import { logout } from "../../features/auth/authSlice";

type NavbarProps = {
  title?: string;
};

export default function Navbar({ title = "Trade Tracker" }: NavbarProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const isAuthenticated = useAppSelector(
    (state) => state.auth.isAuthenticated
  );

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <header className={styles.navbar}>
      <div className={styles.brand}>
        <span className={styles.logo}>📈</span>
        <h1>{title}</h1>
      </div>

      <nav className={styles.links}>
        <Link to="/">Trades</Link>
        {isAuthenticated && <Link to="/stocks">Stocks</Link>}
        {isAuthenticated ? (
          <button onClick={handleLogout} className={styles.logoutBtn}>
            Logout
          </button>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </nav>
    </header>
  );
}