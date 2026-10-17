import { useContext } from 'react';
import { MdLightMode, MdDarkMode } from 'react-icons/md';
import { ThemeContext } from '../ThemeContext';

export default function ThemeToggleButton({ color, size, className = '' }: any) {
  const { isDarkMode, setIsDarkMode } = useContext(ThemeContext);

  function toggleMode() {
    const value = !isDarkMode;
    setIsDarkMode(value);
  }

  return (
    <button
      className={`p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors flex items-center justify-center ${className}`}
      title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{ color: color, fontSize: size }}
      onClick={toggleMode}
    >
      {isDarkMode ? <MdLightMode size={size} color={color} /> : <MdDarkMode size={size} color={color} />}
    </button>
  );
}
