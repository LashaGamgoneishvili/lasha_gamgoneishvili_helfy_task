import React from "react";

interface TaskModalActionsProps {
  onClose: () => void;
}

export const TaskModalActions: React.FC<TaskModalActionsProps> = ({ onClose }) => (
  <div className="modal-actions">
    <button type="button" className="cancel-btn" onClick={onClose}>
      Cancel
    </button>
    <button type="submit" className="save-btn">
      Save Changes
    </button>
  </div>
);
