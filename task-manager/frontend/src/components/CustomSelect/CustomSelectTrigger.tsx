import React from "react";
import { ChevronDownIcon } from "../Icons";

interface CustomSelectTriggerProps {
  label: string;
  isOpen: boolean;
  leftIcon?: React.ReactNode;
  onToggle: () => void;
}

export const CustomSelectTrigger: React.FC<CustomSelectTriggerProps> = ({
  label,
  isOpen,
  leftIcon,
  onToggle,
}) => (
  <div className="custom-select-trigger" onClick={onToggle}>
    <div className="trigger-content">
      {leftIcon && <span className="left-icon-wrapper">{leftIcon}</span>}
      <span className="selected-value">{label}</span>
    </div>
    <ChevronDownIcon size={16} className={`chevron-icon ${isOpen ? "rotate" : ""}`} />
  </div>
);
