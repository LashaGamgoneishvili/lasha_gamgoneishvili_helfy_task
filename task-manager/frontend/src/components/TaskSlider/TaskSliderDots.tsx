import React from "react";

interface TaskSliderDotsProps {
  totalTasks: number;
  currentIndex: number;
  onSelect: (index: number) => void;
}

export const TaskSliderDots: React.FC<TaskSliderDotsProps> = ({
  totalTasks,
  currentIndex,
  onSelect,
}) => (
  <div className="slider-dots">
    {Array.from({ length: totalTasks }, (_, index) => (
      <button
        key={index}
        className={`dot ${index === currentIndex ? "active" : ""}`}
        onClick={() => onSelect(index)}
        aria-label={`Go to slide ${index + 1}`}
      />
    ))}
  </div>
);
