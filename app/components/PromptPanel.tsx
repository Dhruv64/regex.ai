// app/components/PromptPanel.tsx
'use client';

import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { RegexResponse } from '@/types';

interface PromptPanelProps {
  onGenerate: (data: RegexResponse) => void;
}

export default function PromptPanel({ onGenerate }: PromptPanelProps) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remainingRequests, setRemainingRequests] = useState<number | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a description');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-regex-openrouter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      // Get rate limit info from headers
      const remaining = response.headers.get('X-RateLimit-Remaining');
      if (remaining) {
        setRemainingRequests(parseInt(remaining));
      }

      // Get the response text first
      const responseText = await response.text();

      // Handle rate limit error specifically
      if (response.status === 429) {
        try {
          const data = JSON.parse(responseText);
          setError(data.error || 'Rate limit exceeded. Please try again later.');
        } catch {
          setError('Rate limit exceeded. Please try again later.');
        }
        return;
      }

      // Handle other errors
      if (!response.ok) {
        try {
          const data = JSON.parse(responseText);
          setError(data.error || 'Failed to generate regex');
        } catch {
          setError(`Failed to generate regex: ${response.status} ${response.statusText}`);
        }
        return;
      }

      // Parse successful response
      try {
        const data: RegexResponse = JSON.parse(responseText);
        onGenerate(data);
      } catch (parseError) {
        console.error('Failed to parse response:', responseText.substring(0, 200));
        setError('Received invalid response from server. Please try again.');
      }

    } catch (err) {
      console.error('Request error:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleGenerate();
    }
  };

  return (
    <div className="flex flex-col h-full p-6 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-colors">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Describe Your Pattern
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Tell us what you want to match, and we'll generate the regex for you
        </p>
      </div>

      <div className="flex-1 flex flex-col gap-4">
        <div className="flex-1">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g., Match valid email addresses&#10;e.g., Extract all URLs from text&#10;e.g., Validate phone numbers in format (123) 456-7890"
            className="w-full h-full p-4 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {remainingRequests !== null && remainingRequests >= 0 && (
          <div className="text-xs text-center text-gray-500 dark:text-gray-400">
            {remainingRequests} {remainingRequests === 1 ? 'request' : 'requests'} remaining today
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate Regex
            </>
          )}
        </button>

        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Press <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded">⌘</kbd> +{' '}
          <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded">Enter</kbd> to generate
        </p>
      </div>

      {/* Example prompts */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Quick Examples:</p>
        <div className="flex flex-wrap gap-2">
          {[
            'Match email addresses',
            'Validate US phone numbers',
            'Extract hashtags',
            'Match IPv4 addresses',
          ].map((example) => (
            <button
              key={example}
              onClick={() => setPrompt(example)}
              className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-gray-700 dark:text-gray-300 transition-colors"
              disabled={loading}
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}