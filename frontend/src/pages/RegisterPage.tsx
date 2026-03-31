import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "../styles/auth.module.css";
import { useAppDispatch } from "../hooks/reduxHooks";
import { login as loginAction } from "../features/auth/authSlice";
import { useAuth } from "../hooks/useAuth";
import ErrorMessage from "../components/common/ErrorMessage";

export default function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { register, loading, error } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
   const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }
    setLocalError(null);
    try {
      const response = await register({
        email: form.email,
        password: form.password,
      });

      dispatch(loginAction(response.token));
      navigate("/");
    } catch {
      // handled in hook
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.card}>
        <h2>Register</h2>
        {localError && <ErrorMessage message={localError} />}
        {error && <ErrorMessage message={error} />}
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />

        <input
          type="password"
          placeholder="Confirm Password"
          onChange={(e) =>
            setForm({ ...form, confirmPassword: e.target.value })
          }
          required
        />

         <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}
