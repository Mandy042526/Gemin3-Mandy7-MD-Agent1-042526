import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { FileText, Upload, Play, CheckCircle, AlertCircle, Loader2, ShieldAlert } from 'lucide-react';
import { generateText } from '../services/llm';
import Markdown from 'react-markdown';

export function IngestionTab() {
  const { t, language, settings, apiKeys } = useAppContext();
  const [inputText, setInputText] = useState('');
  const [status, setStatus] = useState<'idle' | 'scanning' | 'running' | 'done' | 'error'>('idle');
  const [result, setResult] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [shieldWarning, setShieldWarning] = useState<string | null>(null);

  const handleRun = async () => {
    if (!inputText.trim()) return;
    
    // WOW Feature #2: Prompt Injection & Secret Leakage Shield
    setStatus('scanning');
    setShieldWarning(null);
    
    // Simple heuristic scan
    if (inputText.includes('sk-') || inputText.includes('AIzaSy') || inputText.toLowerCase().includes('ignore previous instructions')) {
      setShieldWarning('Warning: Potential secrets or prompt injection detected in input. Please review before proceeding.');
      setStatus('idle');
      return;
    }

    setStatus('running');
    try {
      const prompt = `
        Analyze the following medical device guidance document.
        Perform FDA and international regulatory research based on this.
        Output language: ${language === 'tc' ? 'Traditional Chinese' : 'English'}.
        Create a comprehensive summary in markdown (2000 to 3000 words).
        Include citations and a traceability matrix.
        
        Document Content:
        ${inputText}
      `;

      const response = await generateText({
        prompt,
        model: settings.defaultModel,
        temperature: settings.temperature,
        maxTokens: settings.maxTokens,
        apiKeys
      });

      setResult(response);
      setStatus('done');
    } catch (err: any) {
      setErrorMsg(err.message);
      setStatus('error');
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 h-full flex flex-col">
      <div>
        <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <FileText className="text-primary" />
          {t('ingestion')}
        </h2>
        <p className="text-muted-foreground mt-2">
          Paste published guidance or upload documents. The agent will analyze and generate a grounded research report.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 min-h-[500px]">
        {/* Input Section */}
        <div className="flex flex-col space-y-4">
          <div className="bg-card border border-border rounded-xl p-4 flex-1 flex flex-col shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">Input Guidance</h3>
              <button className="text-xs flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
                <Upload size={14} /> Upload File
              </button>
            </div>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste guidance text here..."
              className="flex-1 w-full bg-background border border-border rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
            {shieldWarning && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md flex items-start gap-2 text-red-600 dark:text-red-400 text-sm">
                <ShieldAlert size={16} className="mt-0.5 flex-shrink-0" />
                <p>{shieldWarning}</p>
              </div>
            )}
            <div className="mt-4 flex justify-between items-center">
              <div className="text-xs text-muted-foreground">
                Model: {settings.defaultModel}
              </div>
              <button
                onClick={handleRun}
                disabled={status === 'running' || status === 'scanning' || !inputText.trim()}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2 rounded-md hover:opacity-90 transition-opacity font-medium disabled:opacity-50"
              >
                {status === 'running' || status === 'scanning' ? <Loader2 size={18} className="animate-spin" /> : <Play size={18} />}
                {status === 'scanning' ? 'Scanning...' : 'Run Research Agent'}
              </button>
            </div>
          </div>
        </div>

        {/* Output Section */}
        <div className="flex flex-col space-y-4">
          <div className="bg-card border border-border rounded-xl p-4 flex-1 flex flex-col shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">Research Report Output</h3>
              <div className="flex items-center gap-2">
                {status === 'done' && <span className="flex items-center gap-1 text-xs text-green-600"><CheckCircle size={14} /> Done</span>}
                {status === 'error' && <span className="flex items-center gap-1 text-xs text-red-600"><AlertCircle size={14} /> Error</span>}
              </div>
            </div>
            
            <div className="flex-1 w-full bg-background border border-border rounded-md p-4 overflow-auto">
              {status === 'idle' && !result && (
                <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                  Output will appear here...
                </div>
              )}
              {status === 'running' && (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4">
                  <Loader2 size={32} className="animate-spin text-primary" />
                  <p>Agent is researching and synthesizing...</p>
                </div>
              )}
              {status === 'error' && (
                <div className="text-red-500 text-sm">{errorMsg}</div>
              )}
              {status === 'done' && result && (
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <Markdown>{result}</Markdown>
                </div>
              )}
            </div>
            
            {status === 'done' && (
              <div className="mt-4 flex justify-end gap-2">
                <button className="px-4 py-2 text-sm border border-border rounded-md hover:bg-secondary transition-colors">
                  Edit Output
                </button>
                <button className="px-4 py-2 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors">
                  Pass to Template Rewriter
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
