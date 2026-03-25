import React from "react";

interface Option {
  value: string;
  label: string;
}

interface CustomSelectOptionsProps {
  options: Option[];
  selectedValue: string;
  onSelect: (value: string) => void;
}

export const CustomSelectOptions: React.FC<CustomSelectOptionsProps> = ({
  options,
  selectedValue,
  onSelect,
}) => (
  <div className="custom-select-options">
    {options.map((option) => (
      <div
        key={option.value}
        className={`custom-select-option ${
          option.value === selectedValue ? "is-selected" : ""
        }`}
        onClick={() => onSelect(option.value)}
      >
        {option.label}
      </div>
    ))}
  </div>
);
