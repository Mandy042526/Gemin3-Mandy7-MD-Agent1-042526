import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Wrench, Play, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { generateText } from '../services/llm';

export function SkillStudioTab() {
  const { t, language, settings, apiKeys } = useAppContext();
  const [status, setStatus] = useState<'idle' | 'running' | 'done' | 'error'>('idle');
  const [skillContent, setSkillContent] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleGenerateSkill = async () => {
    setStatus('running');
    try {
      const prompt = `
        Generate a skill.md file content that defines a new agent skill in the standard skill-creator format.
        Output language: ${language === 'tc' ? 'Traditional Chinese' : 'English'}.
        Include 3 WOW features:
        1. Guidance Structure Fingerprinting + Auto-Outline Recovery
        2. Requirement-to-Evidence Traceability Builder
        3. Bilingual Terminology Consistency Table (TC/EN)
        
        Ensure it has YAML frontmatter with name, description, and triggers.
      `;

      const response = await generateText({
        prompt,
        model: settings.defaultModel,
        temperature: settings.temperature,
        maxTokens: settings.maxTokens,
        apiKeys
      });

      setSkillContent(response);
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
          <Wrench className="text-primary" />
          {t('skillStudio')}
        </h2>
        <p className="text-muted-foreground mt-2">
          Generate, improve, and test reusable agent skills (skill.md).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 min-h-[500px]">
        {/* Left Col: Generation & Improvement */}
        <div className="flex flex-col space-y-6">
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-4">1. Generate Skill</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create a new skill.md based on the template report and original guidance. Includes 3 WOW features automatically.
            </p>
            <button
              onClick={handleGenerateSkill}
              disabled={status === 'running'}
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-2 rounded-md hover:opacity-90 transition-opacity font-medium disabled:opacity-50"
            >
              {status === 'running' ? <Loader2 size={18} className="animate-spin" /> : <Play size={18} />}
              Generate skill.md
            </button>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex-1 flex flex-col">
            <h3 className="text-xl font-semibold mb-4">2. Improve Skill</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Paste a doc and an existing skill.md to improve it and add 3 additional WOW AI features.
            </p>
            <textarea
              placeholder="Paste reference document here..."
              className="w-full h-24 bg-background border border-border rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none mb-4"
            />
            <button
              className="w-full flex items-center justify-center gap-2 bg-secondary text-secondary-foreground px-6 py-2 rounded-md hover:opacity-90 transition-opacity font-medium"
            >
              Improve Skill
            </button>
          </div>
        </div>

        {/* Right Col: Output & Testing */}
        <div className="flex flex-col space-y-4">
          <div className="bg-card border border-border rounded-xl p-4 flex-1 flex flex-col shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">skill.md Content</h3>
              <div className="flex items-center gap-2">
                {status === 'done' && <span className="flex items-center gap-1 text-xs text-green-600"><CheckCircle size={14} /> Done</span>}
                {status === 'error' && <span className="flex items-center gap-1 text-xs text-red-600"><AlertCircle size={14} /> Error</span>}
              </div>
            </div>
            
            <textarea
              value={skillContent}
              onChange={(e) => setSkillContent(e.target.value)}
              placeholder="Generated skill.md will appear here..."
              className="flex-1 w-full bg-background border border-border rounded-md p-4 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
            
            {status === 'done' && (
              <div className="mt-4 flex justify-end gap-2">
                <button className="px-4 py-2 text-sm border border-border rounded-md hover:bg-secondary transition-colors">
                  Download .md
                </button>
                <button className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity">
                  Run 3 Use Cases
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
