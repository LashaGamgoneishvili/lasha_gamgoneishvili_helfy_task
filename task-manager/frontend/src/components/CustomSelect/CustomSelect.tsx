import React, { useEffect, useRef, useState } from "react";
import { CustomSelectOptions } from "./CustomSelectOptions";
import { CustomSelectTrigger } from "./CustomSelectTrigger";
import "./CustomSelect.css";

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  leftIcon?: React.ReactNode;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  options,
  onChange,
  className = "",
  placeholder = "Select an option",
  leftIcon,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((option) => option.value === value);
  const selectedLabel = selectedOption ? selectedOption.label : placeholder;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className={`custom-select-container ${className} ${isOpen ? "is-open" : ""}`}
      ref={containerRef}
    >
      <CustomSelectTrigger
        label={selectedLabel}
        isOpen={isOpen}
        leftIcon={leftIcon}
        onToggle={() => setIsOpen((prev) => !prev)}
      />

      {isOpen && (
        <CustomSelectOptions
          options={options}
          selectedValue={value}
          onSelect={(selectedValue) => {
            onChange(selectedValue);
            setIsOpen(false);
          }}
        />
      )}
    </div>
  );
};
