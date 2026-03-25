import React, { useEffect, useState } from "react";
import { ConfirmModalFooter } from "./ConfirmModalFooter";
import { ConfirmModalHeader } from "./ConfirmModalHeader";
import "./ConfirmModal.css";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const EXIT_ANIMATION_MS = 220;

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}) => {
  const [isRendered, setIsRendered] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      setIsClosing(false);
      return;
    }

    if (!isRendered) return;

    setIsClosing(true);
    const timer = window.setTimeout(() => {
      setIsRendered(false);
      setIsClosing(false);
    }, EXIT_ANIMATION_MS);

    return () => window.clearTimeout(timer);
  }, [isOpen, isRendered]);

  if (!isRendered) return null;

  return (
    <div
      className={`confirm-modal-overlay ${isClosing ? "is-closing" : "is-open"}`}
      onClick={onClose}
      aria-hidden={!isOpen}
    >
      <div
        className="confirm-modal-content"
        onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
      >
        <ConfirmModalHeader title={title} onClose={onClose} />

        <div className="confirm-body">
          <p>{message}</p>
        </div>

        <ConfirmModalFooter onClose={onClose} onConfirm={onConfirm} />
      </div>
    </div>
  );
};
