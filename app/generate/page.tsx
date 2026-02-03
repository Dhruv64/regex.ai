// app/generate/page.tsx
'use client';

import { useState } from 'react';
import PromptPanel from '../components/PromptPanel';
import TestingWorkbench from '../components/TestingWorkbench';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { RegexResponse } from '@/types';

export default function GeneratePage() {
  const [regexData, setRegexData] = useState<RegexResponse | null>(null);

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors">
      <Header />

      <div className="flex-1 flex overflow-hidden">
        <div className="w-1/3 min-w-[400px]">
          <PromptPanel onGenerate={setRegexData} />
        </div>

        <div className="flex-1">
          <TestingWorkbench regexData={regexData} />
        </div>
      </div>

      <Footer />
    </div>
  );
}