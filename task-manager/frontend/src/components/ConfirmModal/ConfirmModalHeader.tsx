import React from "react";
import { TrashIcon, XIcon } from "../../icons";

interface ConfirmModalHeaderProps {
  title: string;
  onClose: () => void;
}

export const ConfirmModalHeader: React.FC<ConfirmModalHeaderProps> = ({
  title,
  onClose,
}) => (
  <div className="confirm-header">
    <div className="warning-icon">
      <TrashIcon size={24} />
    </div>
    <h3>{title}</h3>
    <button className="close-btn" onClick={onClose}>
      <XIcon size={20} />
    </button>
  </div>
);
