import React from "react";
import { LogoIcon, MoonIcon, SunIcon } from "../Icons";

interface AppHeaderStats {
  total: number;
  completed: number;
  pending: number;
}

interface AppHeaderSectionProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
  stats: AppHeaderStats;
}

const StatItem: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <div className="stat-item">
    <span className="stat-value">{value}</span>
    <span className="stat-label">{label}</span>
  </div>
);

const ThemeToggleButton: React.FC<{
  isDarkMode: boolean;
  onToggle: () => void;
}> = ({ isDarkMode, onToggle }) => (
  <button className="theme-toggle" onClick={onToggle} aria-label="Toggle theme">
    {isDarkMode ? <SunIcon size={20} /> : <MoonIcon size={20} />}
  </button>
);

export const AppHeaderSection: React.FC<AppHeaderSectionProps> = ({
  isDarkMode,
  onToggleTheme,
  stats,
}) => (
  <header className="app-header">
    <div className="header-top">
      <div className="header-content">
        <LogoIcon className="logo-icon" size={32} />
        <h1>TaskFlow</h1>
      </div>
      <ThemeToggleButton isDarkMode={isDarkMode} onToggle={onToggleTheme} />
    </div>

    <div className="stats-bar">
      <StatItem label="Total" value={stats.total} />
      <StatItem label="Done" value={stats.completed} />
      <StatItem label="Pending" value={stats.pending} />
    </div>
  </header>
);
