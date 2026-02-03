// app/components/Header.tsx
'use client';

import { Moon, Sun, ArrowLeft } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const isLanding = pathname === '/';

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <Image
              src="/icon.png"
              alt="RegexAI Logo"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">RegexAI</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                AI-Powered Regex Generator & Workbench
              </p>
            </div>
          </div>
          <div className="w-24 h-6" />
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 transition-colors">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          {!isLanding && (
            <Link
              href="/"
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Back to home"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </Link>
          )}
          
          <Link href="/" className="flex items-center gap-3">
            <Image
              src={theme === 'dark' ? '/icon-dark.png' : '/icon.png'}
              alt="RegexAI Logo"
              width={40}
              height={40}
              className="rounded-lg hover:opacity-80 transition-opacity"
            />
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">RegexAI</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                AI-Powered Regex Generator & Workbench
              </p>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Sun className={`w-5 h-5 transition-colors ${
            theme === 'light' 
              ? 'text-yellow-500' 
              : 'text-gray-400 dark:text-gray-600'
          }`} />
          
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