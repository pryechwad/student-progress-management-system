import React from 'react';
import { Link } from 'react-router-dom';
import useTheme from '../../context/useTheme';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <header className="bg-blue-600 text-white p-4 flex items-center justify-between">
      <Link to="/" className="text-xl font-bold hover:text-blue-200">
        Student Progress Management System
      </Link>
      <div className="flex items-center gap-4">
        <Link to="/settings" className="hover:text-blue-200">
          Settings
        </Link>
        <button
        onClick={toggleTheme}
        className="ml-4 px-3 py-1 rounded bg-white text-blue-600 hover:bg-gray-200 transition-colors border border-blue-600"
        aria-label="Toggle theme"
      >
          {theme === 'light' ? '🌞 Light' : '🌙 Dark'}
        </button>
      </div>
    </header>
  );
};

export default Header;