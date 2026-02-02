// app/components/RegexTester.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { AlertCircle, CheckCircle2, XCircle, HelpCircle } from 'lucide-react';

interface RegexTesterProps {
    pattern: string;
}

interface Match {
    text: string;
    index: number;
    length: number;
    line?: number; // Add line number
}

export default function RegexTester({ pattern }: RegexTesterProps) {
    const [testInput, setTestInput] = useState('');
    const [matches, setMatches] = useState<Match[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [flags, setFlags] = useState({
        global: true,
        caseInsensitive: false,
        multiline: false,
    });
    const [showTooltip, setShowTooltip] = useState<string | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Helper function to get line number from character position
    const getLineNumberFromPosition = (position: number, text: string): number => {
        const textUpToPosition = text.substring(0, position);
        return textUpToPosition.split('\n').length;
    };

    useEffect(() => {
        if (!pattern || !testInput) {
            setMatches([]);
            setError(null);
            return;
        }

        try {
            // Build flags string
            let flagsStr = '';
            if (flags.global) flagsStr += 'g';
            if (flags.caseInsensitive) flagsStr += 'i';
            if (flags.multiline) flagsStr += 'm';

            const regex = new RegExp(pattern, flagsStr);
            const foundMatches: Match[] = [];

            if (flags.global) {
                let match;
                while ((match = regex.exec(testInput)) !== null) {
                    foundMatches.push({
                        text: match[0],
                        index: match.index,
                        length: match[0].length,
                        line: getLineNumberFromPosition(match.index, testInput),
                    });
                    // Prevent infinite loop on zero-length matches
                    if (match.index === regex.lastIndex) {
                        regex.lastIndex++;
                    }
                }
            } else {
                const match = regex.exec(testInput);
                if (match) {
                    foundMatches.push({
                        text: match[0],
                        index: match.index,
                        length: match[0].length,
                        line: getLineNumberFromPosition(match.index, testInput),
                    });
                }
            }

            setMatches(foundMatches);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Invalid regex pattern');
            setMatches([]);
        }
    }, [pattern, testInput, flags]);

    // Handle input change with multiline control
    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;

        // If multiline is disabled, prevent newlines
        if (!flags.multiline) {
            const singleLine = value.replace(/[\r\n]+/g, '');
            setTestInput(singleLine);
        } else {
            setTestInput(value);
        }
    };

    // Handle key press to prevent Enter when multiline is off
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (!flags.multiline && e.key === 'Enter') {
            e.preventDefault();
        }
    };

    // Calculate line numbers
    const getLineNumbers = () => {
        if (!flags.multiline) return null;
        const lines = testInput.split('\n');
        return lines.map((_, index) => index + 1);
    };

    // Render text with highlighted matches
    const renderHighlightedText = () => {
        if (!testInput) return null;
        if (matches.length === 0) return <span className="text-gray-700 dark:text-gray-300">{testInput}</span>;

        const parts: React.ReactNode[] = [];
        let lastIndex = 0;

        matches.forEach((match, idx) => {
            // Add text before match
            if (match.index > lastIndex) {
                parts.push(
                    <span key={`text-${idx}`} className="text-gray-700 dark:text-gray-300">
                        {testInput.slice(lastIndex, match.index)}
                    </span>
                );
            }

            // Add highlighted match
            parts.push(
                <mark
                    key={`match-${idx}`}
                    className="bg-yellow-200 text-gray-900 font-semibold rounded px-0.5"
                >
                    {match.text}
                </mark>
            );

            lastIndex = match.index + match.length;
        });

        // Add remaining text
        if (lastIndex < testInput.length) {
            parts.push(
                <span key="text-end" className="text-gray-700 dark:text-gray-300">
                    {testInput.slice(lastIndex)}
                </span>
            );
        }

        return <>{parts}</>;
    };

    const lineNumbers = getLineNumbers();

    // Tooltip component
    const Tooltip = ({ id, text }: { id: string; text: string }) => (
        <div className="relative inline-block">
            <button
                type="button"
                onMouseEnter={() => setShowTooltip(id)}
                onMouseLeave={() => setShowTooltip(null)}
                className="ml-1 text-gray-400 hover:text-gray-600"
            >
                <HelpCircle className="w-3.5 h-3.5" />
            </button>
            {showTooltip === id && (
                <div className="absolute left-0 bottom-full mb-2 w-64 p-2 bg-gray-900 text-white text-xs rounded shadow-lg z-10">
                    {text}
                    <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                </div>
            )}
        </div>
    );

    return (
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">      <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Live Tester</h3>
            {/* Match counter */}
            <div className="flex items-center gap-2">
                {matches.length > 0 && (
                    <span className="flex items-center gap-1 text-sm font-medium text-green-600">
                        <CheckCircle2 className="w-4 h-4" />
                        {matches.length} {matches.length === 1 ? 'match' : 'matches'}
                    </span>
                )}
                {testInput && matches.length === 0 && !error && (
                    <span className="flex items-center gap-1 text-sm font-medium text-gray-500">
                        <XCircle className="w-4 h-4" />
                        No matches
                    </span>
                )}
            </div>
        </div>

            {/* Flags */}
            <div className="flex gap-4 mb-4 flex-wrap">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                        type="checkbox"
                        checked={flags.global}
                        onChange={(e) => setFlags({ ...flags, global: e.target.checked })}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-gray-700 dark:text-gray-300 flex items-center">
                        Global <code className="text-xs bg-gray-100 px-1 rounded ml-1">g</code>
                        <Tooltip
                            id="global"
                            text="When enabled, finds ALL matches in the text. When disabled, stops after finding the first match."
                        />
                    </span>
                </label>

                <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                        type="checkbox"
                        checked={flags.caseInsensitive}
                        onChange={(e) => setFlags({ ...flags, caseInsensitive: e.target.checked })}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-gray-700 dark:text-gray-300 flex items-center">
                        Case Insensitive <code className="text-xs bg-gray-100 px-1 rounded ml-1">i</code>
                        <Tooltip
                            id="case"
                            text="When enabled, ignores letter case. For example, 'A' and 'a' are treated as the same character."
                        />
                    </span>
                </label>

                <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                        type="checkbox"
                        checked={flags.multiline}
                        onChange={(e) => {
                            const newMultiline = e.target.checked;
                            setFlags({ ...flags, multiline: newMultiline });
                            // If disabling multiline, convert to single line
                            if (!newMultiline) {
                                setTestInput(testInput.replace(/[\r\n]+/g, ' '));
                            }
                        }}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-gray-700 dark:text-gray-300 flex items-center">
                        Multiline <code className="text-xs bg-gray-100 px-1 rounded ml-1">m</code>
                        <Tooltip
                            id="multiline"
                            text="When enabled, ^ and $ match the start/end of each line (not just the entire string). Also allows testing with multiple lines of text."
                        />
                    </span>
                </label>
            </div>

            {/* Test Input */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Test String {!flags.multiline && <span className="text-gray-500">(single line)</span>}
                </label>
                <div className="relative flex border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
                    {/* Line numbers - only show when multiline is enabled */}
                    {flags.multiline && lineNumbers && (
                        <div className="bg-gray-100 px-3 py-3 border-r border-gray-300 select-none">
                            {lineNumbers.map((num) => (
                                <div
                                    key={num}
                                    className="text-xs font-mono text-gray-500 leading-[1.5] h-[21px]"
                                >
                                    {num}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Text input */}
                    <textarea
                        ref={textareaRef}
                        value={testInput}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder={
                            flags.multiline
                                ? "Enter text to test against the regex pattern...\nYou can use multiple lines."
                                : "Enter text to test against the regex pattern..."
                        }
                        className="flex-1 p-3 resize-none focus:outline-none font-mono text-sm"
                        rows={flags.multiline ? 8 : 3}
                        style={{
                            lineHeight: '1.5',
                        }}
                    />
                </div>
                {!flags.multiline && (
                    <p className="text-xs text-gray-500 mt-1">
                        Enable "Multiline" to test with multiple lines of text
                    </p>
                )}
            </div>

            {/* Error Display */}
            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-medium text-red-700">Invalid Pattern</p>
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                </div>
            )}

            {/* Highlighted Output */}
            {testInput && !error && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-xs font-medium text-gray-600 mb-2">Result with Matches Highlighted:</p>
                    <div className="font-mono text-sm whitespace-pre-wrap break-words">
                        {renderHighlightedText()}
                    </div>
                </div>
            )}

            {/* Match Details */}
            {matches.length > 0 && (
                <div className="mt-4">
                    <p className="text-xs font-medium text-gray-600 mb-2">Match Details:</p>
                    <div className="space-y-2">
                        {matches.map((match, idx) => (
                            <div
                                key={idx}
                                className="flex items-center gap-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm"
                            >
                                <span className="font-mono font-semibold text-gray-900">
                                    "{match.text}"
                                </span>
                                <span className="text-gray-600">
                                    {flags.multiline
                                        ? `on line ${match.line}`
                                        : `at position ${match.index}`
                                    }
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}