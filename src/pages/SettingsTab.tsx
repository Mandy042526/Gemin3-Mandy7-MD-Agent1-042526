import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Key, Settings as SettingsIcon, Save } from 'lucide-react';

export function SettingsTab() {
  const { apiKeys, setApiKey, settings, updateSettings, t } = useAppContext();
  const [localKeys, setLocalKeys] = useState(apiKeys);
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSave = () => {
    Object.entries(localKeys).forEach(([provider, key]) => {
      setApiKey(provider as any, key);
    });
    updateSettings(localSettings);
    alert('Settings saved successfully!');
  };

  const hasEnvGemini = !!process.env.GEMINI_API_KEY;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <SettingsIcon className="text-primary" />
          {t('settings')}
        </h2>
        <p className="text-muted-foreground mt-2">Configure models, parameters, and API keys.</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Key size={20} className="text-primary" />
          API Keys
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Google Gemini API Key</label>
            {hasEnvGemini ? (
              <div className="text-sm text-green-600 bg-green-50 dark:bg-green-900/20 p-3 rounded-md border border-green-200 dark:border-green-800">
                Loaded from environment (Hidden for security)
              </div>
            ) : (
              <input
                type="password"
                value={localKeys.gemini}
                onChange={(e) => setLocalKeys({ ...localKeys, gemini: e.target.value })}
                className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="AIzaSy..."
              />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">OpenAI API Key</label>
            <input
              type="password"
              value={localKeys.openai}
              onChange={(e) => setLocalKeys({ ...localKeys, openai: e.target.value })}
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="sk-..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Anthropic API Key</label>
            <input
              type="password"
              value={localKeys.anthropic}
              onChange={(e) => setLocalKeys({ ...localKeys, anthropic: e.target.value })}
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="sk-ant-..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Grok API Key</label>
            <input
              type="password"
              value={localKeys.grok}
              onChange={(e) => setLocalKeys({ ...localKeys, grok: e.target.value })}
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="xai-..."
            />
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold mb-4">Global Parameters</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Default Model</label>
            <select
              value={localSettings.defaultModel}
              onChange={(e) => setLocalSettings({ ...localSettings, defaultModel: e.target.value })}
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="gemini-2.5-flash">gemini-2.5-flash</option>
              <option value="gemini-3-flash-preview">gemini-3-flash-preview</option>
              <option value="gemini-3.1-flash-lite-preview">gemini-3.1-flash-lite-preview</option>
              <option value="gpt-4o-mini">gpt-4o-mini</option>
              <option value="gpt-4.1-mini">gpt-4.1-mini</option>
              <option value="claude-3-haiku-20240307">claude-3-haiku</option>
              <option value="grok-4-fast-reasoning">grok-4-fast-reasoning</option>
              <option value="grok-3-mini">grok-3-mini</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Temperature ({localSettings.temperature})</label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={localSettings.temperature}
                onChange={(e) => setLocalSettings({ ...localSettings, temperature: parseFloat(e.target.value) })}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Max Tokens</label>
              <input
                type="number"
                value={localSettings.maxTokens}
                onChange={(e) => setLocalSettings({ ...localSettings, maxTokens: parseInt(e.target.value) })}
                className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2 rounded-md hover:opacity-90 transition-opacity font-medium"
        >
          <Save size={18} />
          Save Settings
        </button>
      </div>
    </div>
  );
}
