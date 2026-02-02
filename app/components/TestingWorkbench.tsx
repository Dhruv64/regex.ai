// app/components/TestingWorkbench.tsx
'use client';

import { RegexResponse } from '@/types';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface TestingWorkbenchProps {
  regexData: RegexResponse | null;
}

export default function TestingWorkbench({ regexData }: TestingWorkbenchProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!regexData) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Ready to Generate
          </h3>
          <p className="text-gray-500">
            Describe your pattern and we'll create the regex for you
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Pattern Display */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Generated Pattern
            </h3>
            <button
              onClick={() => handleCopy(regexData.pattern)}
              className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
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
          </div>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-lg overflow-x-auto">
            {regexData.pattern}
          </div>
        </div>

        {/* Explanation */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Explanation
          </h3>
          <p className="text-gray-700 leading-relaxed">{regexData.explanation}</p>
        </div>

        {/* Breakdown */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Pattern Breakdown
          </h3>
          <div className="space-y-3">
            {regexData.breakdown.map((item, index) => (
              <div
                key={index}
                className="flex gap-4 p-3 bg-gray-50 rounded-lg"
              >
                <code className="font-mono text-sm text-blue-600 font-semibold shrink-0">
                  {item.component}
                </code>
                <p className="text-sm text-gray-700">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Test Cases */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Suggested Test Cases
          </h3>
          <div className="space-y-2">
            {regexData.testCases.map((testCase, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <span
                  className={`shrink-0 px-2 py-1 rounded text-xs font-medium ${
                    testCase.shouldMatch
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {testCase.shouldMatch ? 'Match' : 'No Match'}
                </span>
                <div className="flex-1">
                  <code className="text-sm font-mono text-gray-900">
                    {testCase.input}
                  </code>
                  <p className="text-xs text-gray-600 mt-1">
                    {testCase.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}