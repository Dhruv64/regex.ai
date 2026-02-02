// app/api/generate-regex-mock/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Mock data for different types of regex patterns
const mockResponses: Record<string, any> = {
  email: {
    pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
    explanation: "This regex matches standard email addresses with common formats including letters, numbers, and special characters in the local part, followed by @ symbol, domain name, and top-level domain.",
    breakdown: [
      { component: "^", description: "Start of string anchor - ensures the match begins at the start" },
      { component: "[a-zA-Z0-9._%+-]+", description: "Matches the local part (username) - one or more alphanumeric characters or special characters (._%+-)" },
      { component: "@", description: "Literal @ symbol separating local part from domain" },
      { component: "[a-zA-Z0-9.-]+", description: "Matches the domain name with letters, numbers, dots, and hyphens" },
      { component: "\\.", description: "Literal dot before the TLD (escaped because . is a special character)" },
      { component: "[a-zA-Z]{2,}", description: "Matches the top-level domain with at least 2 letters (com, org, uk, etc.)" },
      { component: "$", description: "End of string anchor - ensures the match ends at the end" }
    ],
    testCases: [
      { input: "user@example.com", shouldMatch: true, description: "Standard email format with common TLD" },
      { input: "john.doe+filter@company.co.uk", shouldMatch: true, description: "Email with plus sign for filtering and multi-part TLD" },
      { input: "test_user123@domain-name.com", shouldMatch: true, description: "Email with underscore, numbers, and hyphenated domain" },
      { input: "invalid@", shouldMatch: false, description: "Missing domain and TLD" },
      { input: "@example.com", shouldMatch: false, description: "Missing local part (username)" }
    ],
    languageVariations: {
      javascript: "/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/",
      python: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
      java: "\"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\\\.[a-zA-Z]{2,}$\""
    }
  },
  phone: {
    pattern: "^\\(?\\d{3}\\)?[\\s.-]?\\d{3}[\\s.-]?\\d{4}$",
    explanation: "This regex matches US phone numbers in various common formats including (123) 456-7890, 123-456-7890, 123.456.7890, and 1234567890.",
    breakdown: [
      { component: "^", description: "Start of string anchor" },
      { component: "\\(?", description: "Optional opening parenthesis (escaped)" },
      { component: "\\d{3}", description: "Exactly 3 digits for area code" },
      { component: "\\)?", description: "Optional closing parenthesis (escaped)" },
      { component: "[\\s.-]?", description: "Optional separator (space, dot, or hyphen)" },
      { component: "\\d{3}", description: "Exactly 3 digits for exchange code" },
      { component: "[\\s.-]?", description: "Optional separator again" },
      { component: "\\d{4}", description: "Exactly 4 digits for line number" },
      { component: "$", description: "End of string anchor" }
    ],
    testCases: [
      { input: "(123) 456-7890", shouldMatch: true, description: "Standard format with parentheses and hyphen" },
      { input: "123-456-7890", shouldMatch: true, description: "Format with hyphens only" },
      { input: "123.456.7890", shouldMatch: true, description: "Format with dots as separators" },
      { input: "1234567890", shouldMatch: true, description: "No separators, just digits" },
      { input: "123-45-6789", shouldMatch: false, description: "Wrong digit grouping (SSN format)" }
    ],
    languageVariations: {
      javascript: "/^\\(?\\d{3}\\)?[\\s.-]?\\d{3}[\\s.-]?\\d{4}$/",
      python: "^\\(?\\d{3}\\)?[\\s.-]?\\d{3}[\\s.-]?\\d{4}$",
      java: "\"^\\\\(?\\\\d{3}\\\\)?[\\\\s.-]?\\\\d{3}[\\\\s.-]?\\\\d{4}$\""
    }
  },
  url: {
    pattern: "^https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&\\/=]*)$",
    explanation: "This regex matches HTTP and HTTPS URLs including optional www subdomain, domain name, TLD, and optional path/query parameters.",
    breakdown: [
      { component: "^", description: "Start of string anchor" },
      { component: "https?", description: "Matches http or https (s is optional)" },
      { component: ":\\/\\/", description: "Matches :// (slashes are escaped)" },
      { component: "(www\\.)?", description: "Optional www. subdomain" },
      { component: "[-a-zA-Z0-9@:%._\\+~#=]{1,256}", description: "Domain name characters (1-256 chars)" },
      { component: "\\.", description: "Literal dot before TLD" },
      { component: "[a-zA-Z0-9()]{1,6}", description: "TLD (1-6 characters)" },
      { component: "\\b", description: "Word boundary" },
      { component: "([-a-zA-Z0-9()@:%_\\+.~#?&\\/=]*)", description: "Optional path and query parameters" },
      { component: "$", description: "End of string anchor" }
    ],
    testCases: [
      { input: "https://example.com", shouldMatch: true, description: "Simple HTTPS URL" },
      { input: "http://www.example.com/path", shouldMatch: true, description: "HTTP with www and path" },
      { input: "https://api.example.com/users?id=123", shouldMatch: true, description: "Subdomain with query params" },
      { input: "ftp://example.com", shouldMatch: false, description: "FTP protocol not supported" },
      { input: "not-a-url", shouldMatch: false, description: "Missing protocol" }
    ],
    languageVariations: {
      javascript: "/^https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&\\/=]*)$/",
      python: "^https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&\\/=]*)$",
      java: "\"^https?:\\\\/\\\\/(www\\\\.)?[-a-zA-Z0-9@:%._\\\\+~#=]{1,256}\\\\.[a-zA-Z0-9()]{1,6}\\\\b([-a-zA-Z0-9()@:%_\\\\+.~#?&\\\\/=]*)$\""
    }
  },
  hashtag: {
    pattern: "#[a-zA-Z0-9_]+",
    explanation: "This regex matches hashtags commonly used in social media, starting with # followed by letters, numbers, or underscores.",
    breakdown: [
      { component: "#", description: "Literal hashtag symbol" },
      { component: "[a-zA-Z0-9_]+", description: "One or more alphanumeric characters or underscores" }
    ],
    testCases: [
      { input: "#javascript", shouldMatch: true, description: "Simple hashtag with lowercase letters" },
      { input: "#ReactJS2024", shouldMatch: true, description: "Hashtag with mixed case and numbers" },
      { input: "#hello_world", shouldMatch: true, description: "Hashtag with underscore separator" },
      { input: "# space", shouldMatch: false, description: "Hashtag with space (invalid)" },
      { input: "no-hashtag", shouldMatch: false, description: "Missing # symbol" }
    ],
    languageVariations: {
      javascript: "/#[a-zA-Z0-9_]+/g",
      python: "#[a-zA-Z0-9_]+",
      java: "\"#[a-zA-Z0-9_]+\""
    }
  },
  ipv4: {
    pattern: "^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$",
    explanation: "This regex matches valid IPv4 addresses where each octet is between 0-255, with proper validation for each number range.",
    breakdown: [
      { component: "^", description: "Start of string anchor" },
      { component: "25[0-5]", description: "Matches 250-255 (highest range)" },
      { component: "2[0-4][0-9]", description: "Matches 200-249 (middle-high range)" },
      { component: "[01]?[0-9][0-9]?", description: "Matches 0-199 (lower ranges)" },
      { component: "\\.", description: "Literal dot separator between octets" },
      { component: "{3}", description: "Repeat the octet pattern exactly 3 times" },
      { component: "$", description: "End of string anchor" }
    ],
    testCases: [
      { input: "192.168.1.1", shouldMatch: true, description: "Common private IP address" },
      { input: "255.255.255.255", shouldMatch: true, description: "Maximum valid IP (broadcast address)" },
      { input: "0.0.0.0", shouldMatch: true, description: "Minimum valid IP (any address)" },
      { input: "256.1.1.1", shouldMatch: false, description: "First octet over 255 (invalid)" },
      { input: "192.168.1", shouldMatch: false, description: "Missing fourth octet" }
    ],
    languageVariations: {
      javascript: "/^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/",
      python: "^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$",
      java: "\"^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$\""
    }
  },
  date: {
    pattern: "^(0[1-9]|1[0-2])\\/(0[1-9]|[12][0-9]|3[01])\\/(19|20)\\d{2}$",
    explanation: "This regex matches dates in MM/DD/YYYY format with proper validation for month (01-12), day (01-31), and year (1900-2099).",
    breakdown: [
      { component: "^", description: "Start of string anchor" },
      { component: "(0[1-9]|1[0-2])", description: "Month: 01-09 or 10-12" },
      { component: "\\/", description: "Literal forward slash separator" },
      { component: "(0[1-9]|[12][0-9]|3[01])", description: "Day: 01-09, 10-29, or 30-31" },
      { component: "\\/", description: "Second forward slash separator" },
      { component: "(19|20)\\d{2}", description: "Year: 1900-2099 (19xx or 20xx)" },
      { component: "$", description: "End of string anchor" }
    ],
    testCases: [
      { input: "12/25/2024", shouldMatch: true, description: "Valid date - Christmas 2024" },
      { input: "01/01/2000", shouldMatch: true, description: "Valid date - Y2K" },
      { input: "06/15/1995", shouldMatch: true, description: "Valid date - mid-90s" },
      { input: "13/01/2024", shouldMatch: false, description: "Invalid month (13)" },
      { input: "12/32/2024", shouldMatch: false, description: "Invalid day (32)" }
    ],
    languageVariations: {
      javascript: "/^(0[1-9]|1[0-2])\\/(0[1-9]|[12][0-9]|3[01])\\/(19|20)\\d{2}$/",
      python: "^(0[1-9]|1[0-2])\\/(0[1-9]|[12][0-9]|3[01])\\/(19|20)\\d{2}$",
      java: "\"^(0[1-9]|1[0-2])\\\\/(0[1-9]|[12][0-9]|3[01])\\\\/(19|20)\\\\d{2}$\""
    }
  },
  zipcode: {
    pattern: "^\\d{5}(-\\d{4})?$",
    explanation: "This regex matches US ZIP codes in both 5-digit format (12345) and ZIP+4 format (12345-6789).",
    breakdown: [
      { component: "^", description: "Start of string anchor" },
      { component: "\\d{5}", description: "Exactly 5 digits for basic ZIP code" },
      { component: "(-\\d{4})?", description: "Optional hyphen followed by 4 digits for extended ZIP+4" },
      { component: "$", description: "End of string anchor" }
    ],
    testCases: [
      { input: "12345", shouldMatch: true, description: "Valid 5-digit ZIP code" },
      { input: "12345-6789", shouldMatch: true, description: "Valid ZIP+4 format" },
      { input: "02134", shouldMatch: true, description: "ZIP code with leading zero" },
      { input: "1234", shouldMatch: false, description: "Too few digits" },
      { input: "12345-678", shouldMatch: false, description: "Incomplete ZIP+4 (only 3 digits after hyphen)" }
    ],
    languageVariations: {
      javascript: "/^\\d{5}(-\\d{4})?$/",
      python: "^\\d{5}(-\\d{4})?$",
      java: "\"^\\\\d{5}(-\\\\d{4})?$\""
    }
  },
  hexcolor: {
    pattern: "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$",
    explanation: "This regex matches hexadecimal color codes in both 6-digit (#RRGGBB) and 3-digit shorthand (#RGB) formats.",
    breakdown: [
      { component: "^", description: "Start of string anchor" },
      { component: "#", description: "Literal hash/pound symbol" },
      { component: "[A-Fa-f0-9]{6}", description: "6 hexadecimal characters for full color (RRGGBB)" },
      { component: "|", description: "OR operator for alternative format" },
      { component: "[A-Fa-f0-9]{3}", description: "3 hexadecimal characters for shorthand (RGB)" },
      { component: "$", description: "End of string anchor" }
    ],
    testCases: [
      { input: "#FF5733", shouldMatch: true, description: "Valid 6-digit hex color (orange-red)" },
      { input: "#000", shouldMatch: true, description: "Valid 3-digit shorthand (black)" },
      { input: "#abc123", shouldMatch: true, description: "Valid hex with lowercase letters" },
      { input: "#GG0000", shouldMatch: false, description: "Invalid characters (G is not hex)" },
      { input: "FF5733", shouldMatch: false, description: "Missing hash symbol" }
    ],
    languageVariations: {
      javascript: "/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/",
      python: "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$",
      java: "\"^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$\""
    }
  },
  ssn: {
    pattern: "^(?!000|666|9\\d{2})\\d{3}-(?!00)\\d{2}-(?!0000)\\d{4}$",
    explanation: "This regex matches valid US Social Security Numbers (SSN) in format XXX-XX-XXXX with proper validation to exclude invalid number ranges.",
    breakdown: [
      { component: "^", description: "Start of string anchor" },
      { component: "(?!000|666|9\\d{2})", description: "Negative lookahead: first 3 digits cannot be 000, 666, or 900-999" },
      { component: "\\d{3}", description: "Exactly 3 digits for area number" },
      { component: "-", description: "Literal hyphen separator" },
      { component: "(?!00)", description: "Negative lookahead: middle 2 digits cannot be 00" },
      { component: "\\d{2}", description: "Exactly 2 digits for group number" },
      { component: "-", description: "Second hyphen separator" },
      { component: "(?!0000)", description: "Negative lookahead: last 4 digits cannot be 0000" },
      { component: "\\d{4}", description: "Exactly 4 digits for serial number" },
      { component: "$", description: "End of string anchor" }
    ],
    testCases: [
      { input: "123-45-6789", shouldMatch: true, description: "Valid SSN format" },
      { input: "856-12-3456", shouldMatch: true, description: "Valid SSN with high area number" },
      { input: "001-01-0001", shouldMatch: true, description: "Valid SSN with low numbers (not zero)" },
      { input: "000-12-3456", shouldMatch: false, description: "Invalid: area number cannot be 000" },
      { input: "666-12-3456", shouldMatch: false, description: "Invalid: area number cannot be 666" }
    ],
    languageVariations: {
      javascript: "/^(?!000|666|9\\d{2})\\d{3}-(?!00)\\d{2}-(?!0000)\\d{4}$/",
      python: "^(?!000|666|9\\d{2})\\d{3}-(?!00)\\d{2}-(?!0000)\\d{4}$",
      java: "\"^(?!000|666|9\\\\d{2})\\\\d{3}-(?!00)\\\\d{2}-(?!0000)\\\\d{4}$\""
    }
  }
};

function findBestMatch(prompt: string): any {
  const lowerPrompt = prompt.toLowerCase();
  
  // Email patterns
  if (lowerPrompt.includes('email') || lowerPrompt.includes('e-mail') || lowerPrompt.includes('mail')) {
    return mockResponses.email;
  }
  
  // Phone patterns
  if (lowerPrompt.includes('phone') || lowerPrompt.includes('telephone') || lowerPrompt.includes('mobile')) {
    return mockResponses.phone;
  }
  
  // URL patterns
  if (lowerPrompt.includes('url') || lowerPrompt.includes('link') || lowerPrompt.includes('website') || lowerPrompt.includes('http')) {
    return mockResponses.url;
  }
  
  // Hashtag patterns
  if (lowerPrompt.includes('hashtag') || lowerPrompt.includes('#') || lowerPrompt.includes('tag')) {
    return mockResponses.hashtag;
  }
  
  // IP address patterns
  if (lowerPrompt.includes('ip') || lowerPrompt.includes('address') && lowerPrompt.includes('ipv4')) {
    return mockResponses.ipv4;
  }
  
  // Date patterns
  if (lowerPrompt.includes('date') || lowerPrompt.includes('mm/dd/yyyy')) {
    return mockResponses.date;
  }
  
  // ZIP code patterns
  if (lowerPrompt.includes('zip') || lowerPrompt.includes('postal')) {
    return mockResponses.zipcode;
  }
  
  // Hex color patterns
  if (lowerPrompt.includes('color') || lowerPrompt.includes('hex') || lowerPrompt.includes('colour')) {
    return mockResponses.hexcolor;
  }
  
  // SSN patterns
  if (lowerPrompt.includes('ssn') || lowerPrompt.includes('social security')) {
    return mockResponses.ssn;
  }
  
  // Default to email if no match
  return mockResponses.email;
}

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Invalid prompt provided' },
        { status: 400 }
      );
    }

    // Simulate API delay for realism
    await new Promise(resolve => setTimeout(resolve, 800));

    const response = findBestMatch(prompt);

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in mock API:', error);
    return NextResponse.json(
      { error: 'Failed to generate regex. Please try again.' },
      { status: 500 }
    );
  }
}