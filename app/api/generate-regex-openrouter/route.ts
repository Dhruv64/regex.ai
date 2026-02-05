// app/api/generate-regex-deepseek/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { OpenRouter } from '@openrouter/sdk';

const openrouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Invalid prompt provided' },
        { status: 400 }
      );
    }

    const systemPrompt = `You are a regex expert. Generate a regular expression based on the user's description.
    
Return your response as a VALID JSON object with this exact structure. DO NOT use Python raw string notation (r"..."). Use regular JSON strings only.

{
  "pattern": "the regex pattern as a string",
  "explanation": "clear explanation of what this regex matches",
  "breakdown": [
    {
      "component": "part of the regex",
      "description": "what this part does"
    }
  ],
  "testCases": [
    {
      "input": "example string",
      "shouldMatch": true,
      "description": "why this test case matters"
    }
  ],
  "languageVariations": {
    "javascript": "/pattern/flags",
    "python": "pattern as a string (NOT r-string)",
    "java": "pattern as a string"
  }
}

CRITICAL: 
- Return ONLY valid JSON
- Do NOT use Python r-string syntax like r"pattern"
- Use plain strings like "pattern" for all languages
- Do NOT include markdown code blocks
- Provide at least 5 test cases (3 that should match, 2 that shouldn't)`;

    const completion = await openrouter.chat.send({
      model: 'google/gemini-2.5-flash-lite-preview-09-2025',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      stream: false, // We want the full response, not streaming
    });

    const responseContent = completion.choices[0]?.message?.content;
    
    if (!responseContent || typeof responseContent !== 'string') {
      throw new Error('No response from AI');
    }

    // Clean response (remove markdown if present)
    let cleanedResponse = responseContent.trim();
    
    // Remove markdown code blocks
    if (cleanedResponse.includes('```json')) {
      cleanedResponse = cleanedResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (cleanedResponse.includes('```')) {
      cleanedResponse = cleanedResponse.replace(/```\n?/g, '');
    }

    // Remove any leading/trailing whitespace
    cleanedResponse = cleanedResponse.trim();

    // Try to parse
    let regexData;
    try {
      regexData = JSON.parse(cleanedResponse);
    } catch (parseError) {
      // If parsing fails, try to fix common issues
      console.log('First parse failed, attempting fixes...');
      console.log('Raw response:', cleanedResponse.substring(0, 200));
      
      // Fix Python r-strings: r"..." -> "..."
      cleanedResponse = cleanedResponse.replace(/r"([^"]+)"/g, '"$1"');
      // Fix Python r'...' -> "..."
      cleanedResponse = cleanedResponse.replace(/r'([^']+)'/g, '"$1"');
      
      try {
        regexData = JSON.parse(cleanedResponse);
      } catch (secondError) {
        console.error('Failed to parse even after fixes');
        console.error('Cleaned response:', cleanedResponse.substring(0, 300));
        throw new Error('Invalid JSON response from AI');
      }
    }

    return NextResponse.json(regexData);
  } catch (error) {
    console.error('Error generating regex:', error);
    
    if (error instanceof Error) {
      console.error('Error message:', error.message);
    }
    
    return NextResponse.json(
      { error: 'Failed to generate regex. Please try again.' },
      { status: 500 }
    );
  }
}