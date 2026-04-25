import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { FileEdit, Play, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { generateText } from '../services/llm';
import Markdown from 'react-markdown';

export function TemplateTab() {
  const { t, language, settings, apiKeys } = useAppContext();
  const [reportInput, setReportInput] = useState('');
  const [templateInput, setTemplateInput] = useState('Default Template: FDA 510(k) Review Memo\n\n1. Device Description\n2. Intended Use\n3. Substantial Equivalence\n4. Performance Testing');
  const [status, setStatus] = useState<'idle' | 'running' | 'done' | 'error'>('idle');
  const [result, setResult] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleRun = async () => {
    if (!reportInput.trim() || !templateInput.trim()) return;
    
    setStatus('running');
    try {
      const prompt = `
        Rewrite the following comprehensive research report to match the provided template structure.
        Maintain all citations and grounded facts.
        Output language: ${language === 'tc' ? 'Traditional Chinese' : 'English'}.
        
        Template:
        ${templateInput}
        
        Original Report:
        ${reportInput}
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
          <FileEdit className="text-primary" />
          {t('template')}
        </h2>
        <p className="text-muted-foreground mt-2">
          Rewrite the comprehensive report into a specific regulatory template format.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-[500px]">
        {/* Input Section */}
        <div className="flex flex-col space-y-4 lg:col-span-1">
          <div className="bg-card border border-border rounded-xl p-4 flex-1 flex flex-col shadow-sm">
            <h3 className="font-semibold mb-2">Stage 1 Report</h3>
            <textarea
              value={reportInput}
              onChange={(e) => setReportInput(e.target.value)}
              placeholder="Paste the comprehensive report here..."
              className="flex-1 w-full bg-background border border-border rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>
          <div className="bg-card border border-border rounded-xl p-4 flex-1 flex flex-col shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">Template</h3>
              <select className="text-xs border border-border rounded px-2 py-1 bg-background">
                <option>FDA 510(k) Memo</option>
                <option>Standards & Test Plan</option>
                <option>Clinical Evidence Summary</option>
                <option>Custom...</option>
              </select>
            </div>
            <textarea
              value={templateInput}
              onChange={(e) => setTemplateInput(e.target.value)}
              className="flex-1 w-full bg-background border border-border rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none font-mono"
            />
          </div>
          <button
            onClick={handleRun}
            disabled={status === 'running' || !reportInput.trim()}
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-md hover:opacity-90 transition-opacity font-medium disabled:opacity-50"
          >
            {status === 'running' ? <Loader2 size={18} className="animate-spin" /> : <Play size={18} />}
            Run Template Rewriter
          </button>
        </div>

        {/* Output Section */}
        <div className="flex flex-col space-y-4 lg:col-span-2">
          <div className="bg-card border border-border rounded-xl p-4 flex-1 flex flex-col shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">Template-Based Output</h3>
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
                  <p>Restructuring report...</p>
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
                  Pass to Skill Studio
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
