import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';
type Language = 'en' | 'tc';
type FlowerTheme = 'default' | 'rose' | 'sunflower' | 'lavender' | 'lotus' | 'orchid' | 'tulip' | 'daisy' | 'lily' | 'peony' | 'cherryblossom' | 'iris' | 'hibiscus' | 'jasmine' | 'marigold' | 'poppy' | 'violet' | 'dahlia' | 'camellia' | 'magnolia' | 'aster';

interface AppState {
  theme: Theme;
  language: Language;
  flowerTheme: FlowerTheme;
  apiKeys: {
    gemini: string;
    openai: string;
    anthropic: string;
    grok: string;
  };
  settings: {
    defaultModel: string;
    temperature: number;
    maxTokens: number;
  };
  setTheme: (theme: Theme) => void;
  setLanguage: (lang: Language) => void;
  setFlowerTheme: (theme: FlowerTheme) => void;
  setApiKey: (provider: keyof AppState['apiKeys'], key: string) => void;
  updateSettings: (settings: Partial<AppState['settings']>) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    dashboard: 'Dashboard',
    ingestion: 'Guidance Ingestion',
    template: 'Template Rewriter',
    infographics: 'Infographics',
    skillStudio: 'Skill Studio',
    settings: 'Settings',
    runAgent: 'Run Agent',
    status: 'Status',
    pending: 'Pending',
    running: 'Running',
    done: 'Done',
    error: 'Error',
    // add more as needed
  },
  tc: {
    dashboard: '儀表板',
    ingestion: '指引匯入與研究',
    template: '範本改寫器',
    infographics: '資訊圖表',
    skillStudio: '技能工作室',
    settings: '設定',
    runAgent: '執行代理',
    status: '狀態',
    pending: '等待中',
    running: '執行中',
    done: '完成',
    error: '錯誤',
  }
};

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [language, setLanguage] = useState<Language>('tc');
  const [flowerTheme, setFlowerTheme] = useState<FlowerTheme>('default');
  
  const [apiKeys, setApiKeys] = useState({
    gemini: '',
    openai: '',
    anthropic: '',
    grok: ''
  });

  const [settings, setSettings] = useState({
    defaultModel: 'gemini-2.5-flash',
    temperature: 0.2,
    maxTokens: 12000
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    const root = window.document.documentElement;
    // Remove all theme classes
    const classes = Array.from(root.classList).filter(c => c.startsWith('theme-'));
    root.classList.remove(...classes);
    if (flowerTheme !== 'default') {
      root.classList.add(`theme-${flowerTheme}`);
    }
  }, [flowerTheme]);

  const setApiKey = (provider: keyof typeof apiKeys, key: string) => {
    setApiKeys(prev => ({ ...prev, [provider]: key }));
  };

  const updateSettings = (newSettings: Partial<typeof settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const t = (key: string) => {
    return (translations[language] as any)[key] || key;
  };

  return (
    <AppContext.Provider value={{
      theme, language, flowerTheme, apiKeys, settings,
      setTheme, setLanguage, setFlowerTheme, setApiKey, updateSettings, t
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
