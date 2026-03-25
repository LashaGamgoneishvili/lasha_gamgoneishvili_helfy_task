import React from "react";

interface ConfirmModalFooterProps {
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmModalFooter: React.FC<ConfirmModalFooterProps> = ({
  onClose,
  onConfirm,
}) => (
  <div className="confirm-footer">
    <button className="cancel-btn" onClick={onClose}>
      Cancel
    </button>
    <button
      className="confirm-delete-btn"
      onClick={() => {
        onConfirm();
        onClose();
      }}
    >
      Delete Task
    </button>
  </div>
);
