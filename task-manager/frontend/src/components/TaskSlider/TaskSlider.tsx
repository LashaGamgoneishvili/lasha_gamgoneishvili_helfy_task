import React, { useState, useEffect, useCallback, useRef } from "react";
import type { Task } from "../../types/Tasks";
import { TaskSliderDots } from "./TaskSliderDots";
import { TaskSliderHeader } from "./TaskSliderHeader";
import { TaskSliderViewport } from "./TaskSliderViewport";
import "./TaskSlider.css";

interface TaskSliderProps {
  tasks: Task[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (task: Task) => void;
}

const ANIMATION_DURATION_MS = 380;
const AUTOPLAY_INTERVAL_MS = 5000;
const SWIPE_THRESHOLD = 50;
const WHEEL_THRESHOLD = 10;

export const TaskSlider: React.FC<TaskSliderProps> = ({
  tasks,
  onToggle,
  onDelete,
  onEdit,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [leavingIndex, setLeavingIndex] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const currentIndexRef = useRef(currentIndex);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  useEffect(() => {
    if (tasks.length === 0) {
      setCurrentIndex(0);
      setLeavingIndex(null);
      setIsAnimating(false);
      return;
    }

    if (currentIndex >= tasks.length) {
      setCurrentIndex(tasks.length - 1);
    }

    if (leavingIndex !== null && leavingIndex >= tasks.length) {
      setLeavingIndex(null);
    }
  }, [tasks.length, currentIndex, leavingIndex]);

  const goToIndex = useCallback(
    (nextIndex: number, nextDirection: 1 | -1) => {
      if (tasks.length <= 1) return;
      const previousIndex = currentIndexRef.current;
      if (nextIndex === previousIndex) return;

      setDirection(nextDirection);
      setLeavingIndex(previousIndex);
      setCurrentIndex(nextIndex);
      setIsAnimating(true);
    },
    [tasks.length],
  );

  const nextSlide = useCallback(() => {
    if (tasks.length <= 1) return;
    goToIndex((currentIndexRef.current + 1) % tasks.length, 1);
  }, [tasks.length, goToIndex]);

  const prevSlide = useCallback(() => {
    if (tasks.length <= 1) return;
    goToIndex((currentIndexRef.current - 1 + tasks.length) % tasks.length, -1);
  }, [tasks.length, goToIndex]);

  useEffect(() => {
    if (!isAnimating) return;

    const timer = window.setTimeout(() => {
      setLeavingIndex(null);
      setIsAnimating(false);
    }, ANIMATION_DURATION_MS);

    return () => window.clearTimeout(timer);
  }, [isAnimating, currentIndex, direction]);

  useEffect(() => {
    if (tasks.length <= 1) return;

    const timer = window.setTimeout(nextSlide, AUTOPLAY_INTERVAL_MS);
    return () => window.clearTimeout(timer);
  }, [currentIndex, tasks.length, nextSlide]);

  if (tasks.length === 0) return null;

  const safeCurrentIndex =
    currentIndex >= tasks.length ? tasks.length - 1 : currentIndex;
  const currentTask = tasks[safeCurrentIndex];
  const leavingTask =
    leavingIndex !== null && leavingIndex < tasks.length
      ? tasks[leavingIndex]
      : null;

  const handleWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) > WHEEL_THRESHOLD) {
      if (e.deltaX > 0) nextSlide();
      else prevSlide();
      return;
    }

    if (Math.abs(e.deltaY) > WHEEL_THRESHOLD) {
      if (e.deltaY > 0) nextSlide();
      else prevSlide();
    }
  };

  const handleTouchEnd = () => {
    if (touchStart === null || touchEnd === null) return;

    const swipeDistance = touchStart - touchEnd;
    if (swipeDistance > SWIPE_THRESHOLD) nextSlide();
    if (swipeDistance < -SWIPE_THRESHOLD) prevSlide();
    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <div
      className="task-slider-container"
      onWheel={handleWheel}
      onTouchStart={(e) => setTouchStart(e.targetTouches[0].clientX)}
      onTouchMove={(e) => setTouchEnd(e.targetTouches[0].clientX)}
      onTouchEnd={handleTouchEnd}
    >
      <TaskSliderHeader
        currentIndex={safeCurrentIndex}
        totalTasks={tasks.length}
        onPrev={prevSlide}
        onNext={nextSlide}
      />

      <TaskSliderViewport
        currentTask={currentTask}
        leavingTask={leavingTask}
        leavingIndex={leavingIndex}
        currentIndex={safeCurrentIndex}
        direction={direction}
        isAnimating={isAnimating}
        onToggle={onToggle}
        onDelete={onDelete}
        onEdit={onEdit}
      />

      <TaskSliderDots
        totalTasks={tasks.length}
        currentIndex={safeCurrentIndex}
        onSelect={(index) => {
          if (index === safeCurrentIndex) return;
          goToIndex(index, index > safeCurrentIndex ? 1 : -1);
        }}
      />
    </div>
  );
};
