// app/page.tsx
'use client';

import { useState } from 'react';
import PromptPanel from './components/PromptPanel';
import TestingWorkbench from './components/TestingWorkbench';
import { RegexResponse } from '@/types';

export default function Home() {
  const [regexData, setRegexData] = useState<RegexResponse | null>(null);

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🎯</div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">RegexAI</h1>
              <p className="text-sm text-gray-600">
                AI-Powered Regex Generator & Workbench
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Split Pane */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel */}
        <div className="w-1/3 min-w-[400px]">
          <PromptPanel onGenerate={setRegexData} />
        </div>

        {/* Right Panel */}
        <div className="flex-1">
          <TestingWorkbench regexData={regexData} />
        </div>
      </div>
    </div>
  );
}