import { NavLink, useNavigate } from "react-router-dom";
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

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? `${styles.link} ${styles.active}` : styles.link;

  return (
    <header className={styles.navbar}>
      <div className={styles.brand}>
        <span className={styles.logo}>📈</span>
        <h1>{title}</h1>
      </div>

      <nav className={styles.links}>
        <NavLink to="/" end className={linkClass}>
          Home
        </NavLink>

        {isAuthenticated ? (
          <>
            <NavLink to="/stocks" className={linkClass}>
              Stocks
            </NavLink>
            <NavLink to="/trades" className={linkClass}>
              Trades Journal
            </NavLink>
            <button onClick={handleLogout} className={styles.logoutBtn}>
              Logout
            </button>
          </>
        ) : (
          <NavLink to="/login" className={linkClass}>
            Login
          </NavLink>
        )}
      </nav>
    </header>
  );
}