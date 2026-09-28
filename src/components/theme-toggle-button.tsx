import { useEffect, useState } from 'react';
import { MdLightMode, MdDarkMode } from 'react-icons/md';

type ThemeToggleButtonProps = {
  color?: string;
  size?: number | string;
  className?: string;
};

export default function ThemeToggleButton({ color, size, className = '' }: ThemeToggleButtonProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial preference from localStorage or system preference
    const isDarkMode =
      localStorage.getItem('theme') === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);

    setIsDark(isDarkMode);

    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newThemeDark = !isDark;
    setIsDark(newThemeDark);

    if (newThemeDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors flex items-center justify-center ${className}`}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{ color: color, fontSize: size }}
    >
      {isDark ? <MdLightMode size={size} color={color} /> : <MdDarkMode size={size} color={color} />}
    </button>
  );
}
