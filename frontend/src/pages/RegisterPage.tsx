import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../api/authApi";
import styles from "../styles/auth.module.css";
import { useAppDispatch } from "../hooks/reduxHooks";
import { login as loginAction } from "../features/auth/authSlice";

export default function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await register(form);
    dispatch(loginAction(response.token));
    navigate("/");
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.card}>
        <h2>Register</h2>

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

        <button type="submit">Register</button>

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}


