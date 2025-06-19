import React from 'react';
import useTheme from '../../context/useTheme';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <header className="bg-blue-600 text-white p-4 flex items-center justify-between">
      <span>Student Progress Management System</span>
      <button
        onClick={toggleTheme}
        className="ml-4 px-3 py-1 rounded bg-white text-blue-600 hover:bg-gray-200 transition-colors border border-blue-600"
        aria-label="Toggle theme"
      >
        {theme === 'light' ? '🌞 Light' : '🌙 Dark'}
      </button>
    </header>
  );
};

export default Header;