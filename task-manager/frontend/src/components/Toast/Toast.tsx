import React from "react";
import { XIcon } from "../../icons";
import "./Toast.css";

interface ToastProps {
  message: string;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => (
  <div className="toast">
    <p className="toast-message">{message}</p>
    <button
      className="toast-close-btn"
      onClick={onClose}
      aria-label="Dismiss error"
    >
      <XIcon size={16} />
    </button>
  </div>
);
