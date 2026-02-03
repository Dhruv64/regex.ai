// app/components/Header.tsx
'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🎯</div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">RegexAI</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                AI-Powered Regex Generator & Workbench
              </p>
            </div>
          </div>
          <div className="w-24 h-6" /> {/* Placeholder */}
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-2xl">🎯</div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">RegexAI</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              AI-Powered Regex Generator & Workbench
            </p>
          </div>
        </div>

        {/* Dark Mode Toggle with Icons */}
        <div className="flex items-center gap-3">
          {/* Sun Icon */}
          <Sun className={`w-5 h-5 transition-colors ${
            theme === 'light' 
              ? 'text-yellow-500' 
              : 'text-gray-400 dark:text-gray-600'
          }`} />
          
          {/* Toggle Switch */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="relative inline-flex h-6 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 bg-gray-200 dark:bg-gray-700"
            role="switch"
            aria-checked={theme === 'dark'}
            aria-label="Toggle dark mode"
          >
            <span
              className={`${
                theme === 'dark' ? 'translate-x-7' : 'translate-x-1'
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />
          </button>

          {/* Moon Icon */}
          <Moon className={`w-5 h-5 transition-colors ${
            theme === 'dark' 
              ? 'text-blue-400' 
              : 'text-gray-400'
          }`} />
        </div>
      </div>
    </header>
  );
}