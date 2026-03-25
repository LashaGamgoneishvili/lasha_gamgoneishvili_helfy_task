import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "../Icons";

interface TaskSliderHeaderProps {
  currentIndex: number;
  totalTasks: number;
  onPrev: () => void;
  onNext: () => void;
}

const SliderNavigationButton: React.FC<{
  onClick: () => void;
  ariaLabel: string;
  icon: React.ReactNode;
}> = ({ onClick, ariaLabel, icon }) => (
  <button onClick={onClick} className="control-btn" aria-label={ariaLabel}>
    {icon}
  </button>
);

export const TaskSliderHeader: React.FC<TaskSliderHeaderProps> = ({
  currentIndex,
  totalTasks,
  onPrev,
  onNext,
}) => (
  <div className="slider-header">
    <div className="slider-title-group">
      <h3>Featured Tasks</h3>
      <span className="slider-count">
        {currentIndex + 1} / {totalTasks}
      </span>
    </div>

    <div className="slider-controls">
      <SliderNavigationButton
        onClick={onPrev}
        ariaLabel="Previous task"
        icon={<ChevronLeftIcon size={18} />}
      />
      <SliderNavigationButton
        onClick={onNext}
        ariaLabel="Next task"
        icon={<ChevronRightIcon size={18} />}
      />
    </div>
  </div>
);
