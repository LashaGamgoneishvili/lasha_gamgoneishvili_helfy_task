import React from "react";
import { CalendarIcon } from "../../icons";
import "./DateInput.css";

interface DateInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const DateInput: React.FC<DateInputProps> = (props) => {
  return (
    <div className="date-input-wrapper">
      <input
        {...props}
        type="date"
        className={`date-input ${props.className || ""}`}
      />
      <CalendarIcon size={18} className="date-input-icon" />
    </div>
  );
};
