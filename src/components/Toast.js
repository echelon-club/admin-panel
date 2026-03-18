import { useEffect, useState } from "react";
import "./Toast.css";

export default function Toast({ message, type, onDone }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false);
      onDone && onDone();
    }, 3500);
    return () => clearTimeout(t);
  }, [onDone]);

  if (!visible || !message) return null;

  return (
    <div className={`toast toast-${type}`}>
      {message}
    </div>
  );
}
