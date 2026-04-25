import { GoogleGenAI } from '@google/genai';

export interface LLMRequest {
  prompt: string;
  systemInstruction?: string;
  model: string;
  temperature?: number;
  maxTokens?: number;
  apiKeys: {
    gemini?: string;
    openai?: string;
    anthropic?: string;
    grok?: string;
  };
}

export async function generateText(request: LLMRequest): Promise<string> {
  const { prompt, systemInstruction, model, temperature, maxTokens, apiKeys } = request;

  // For this environment, we primarily support Gemini.
  // We check if it's a Gemini model or fallback to Gemini if other keys aren't provided.
  const isGemini = model.startsWith('gemini') || (!apiKeys.openai && !apiKeys.anthropic && !apiKeys.grok);
  
  if (isGemini) {
    const apiKey = apiKeys.gemini || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('Gemini API key is missing. Please provide it in settings or environment.');
    }

    const ai = new GoogleGenAI({ apiKey });
    
    try {
      const response = await ai.models.generateContent({
        model: model.startsWith('gemini') ? model : 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
          temperature: temperature ?? 0.2,
          maxOutputTokens: maxTokens ?? 8192,
        }
      });
      return response.text || '';
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      throw new Error(`Gemini API Error: ${error.message}`);
    }
  }

  // Mock implementation for other providers if keys are provided but we don't have the SDKs installed
  // In a real app, we would use their respective SDKs or REST APIs.
  return `[Mock response from ${model}]\n\nReceived prompt: ${prompt.substring(0, 50)}...\n\nTo fully support ${model}, please implement the respective API client in src/services/llm.ts.`;
}
