import React from "react";
import { XIcon } from "../Icons";

interface TaskModalHeaderProps {
  onClose: () => void;
}

export const TaskModalHeader: React.FC<TaskModalHeaderProps> = ({ onClose }) => (
  <div className="modal-header">
    <h2>Edit Task</h2>
    <button className="close-btn" onClick={onClose}>
      <XIcon size={20} />
    </button>
  </div>
);
