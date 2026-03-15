import styles from "./ErrorMessage.module.css";

type ErrorMessageProps = {
  message: string;
};

export default function ErrorMessage({ message }: ErrorMessageProps) {
  if (!message) return null;

  return <p className={styles.error}>{message}</p>;
}