// types/index.ts
export interface RegexResponse {
  pattern: string;
  explanation: string;
  breakdown: {
    component: string;
    description: string;
  }[];
  testCases: {
    input: string;
    shouldMatch: boolean;
    description: string;
  }[];
  languageVariations?: {
    javascript: string;
    python: string;
    java: string;
  };
}

export interface GenerateRequest {
  prompt: string;
}