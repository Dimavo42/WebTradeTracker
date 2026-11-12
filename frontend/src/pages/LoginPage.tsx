import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../hooks/reduxHooks";
import styles from "../styles/auth.module.css";
import { login as loginAction } from "../features/auth/authSlice";
import ErrorMessage from "../components/common/ErrorMessage";
import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loginWithGoogleMock,loading, error } = useAuth();


  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await login({ email, password });
      dispatch(loginAction(response));
      navigate("/");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      // Error is handled in useLogin hook, no need to do anything here
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const response = await loginWithGoogleMock();
      dispatch(loginAction(response));
      navigate("/");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      // Error is handled in useAuth hook
    }
  };


  return (
  <div className={styles.container}>
    <form className={styles.card} onSubmit={handleSubmit}>
      <h2>Login</h2>

      {error && <ErrorMessage message={error} />}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button type="submit" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>

      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
      <button
        type="button"
        className="loginGoogle"
        onClick={handleGoogleLogin}
        disabled={loading}
      >
        Login with Google
      </button>
    </form>
  </div>
);
} ;