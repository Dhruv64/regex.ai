// app/test/page.tsx
'use client';

import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import RegexTester from '../components/RegexTester';
import { Copy, Check } from 'lucide-react';

export default function TestPage() {
  const [pattern, setPattern] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Test Your Regex
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Enter your regex pattern and test it against your own data
          </p>
        </div>

        <div className="space-y-6">
          {/* Pattern Input */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Regex Pattern
                </label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Enter your regular expression pattern to test
                </p>
              </div>
              {pattern && (
                <button
                  onClick={() => handleCopy(pattern)}
                  className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </button>
              )}
            </div>
            
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="e.g., ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
              className="w-full p-4 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg font-mono text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            {/* Quick Examples */}
            <div className="mt-4">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                Quick Examples:
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'Email', pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$' },
                  { label: 'Phone', pattern: '^\\(?\\d{3}\\)?[\\s.-]?\\d{3}[\\s.-]?\\d{4}$' },
                  { label: 'URL', pattern: '^https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b' },
                  { label: 'Hex Color', pattern: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$' },
                ].map((example) => (
                  <button
                    key={example.label}
                    onClick={() => setPattern(example.pattern)}
                    className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-gray-700 dark:text-gray-300 transition-colors"
                  >
                    {example.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tester */}
          {pattern ? (
            <RegexTester pattern={pattern} />
          ) : (
            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Enter a pattern to get started
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Type your regex pattern above or choose a quick example
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}