import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Moon, Sun, Languages, Palette, Dices } from 'lucide-react';

const FLOWER_THEMES = ['default', 'rose', 'sunflower', 'lavender', 'lotus', 'orchid', 'tulip', 'daisy', 'lily', 'peony', 'cherryblossom', 'iris', 'hibiscus', 'jasmine', 'marigold', 'poppy', 'violet', 'dahlia', 'camellia', 'magnolia', 'aster'] as const;

export function Header() {
  const { theme, setTheme, language, setLanguage, flowerTheme, setFlowerTheme } = useAppContext();

  const handleJackpot = () => {
    const randomTheme = FLOWER_THEMES[Math.floor(Math.random() * FLOWER_THEMES.length)];
    setFlowerTheme(randomTheme);
  };

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        {/* Status indicators could go here */}
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 bg-secondary rounded-lg p-1">
          <button
            onClick={() => setLanguage('tc')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${language === 'tc' ? 'bg-background shadow text-foreground' : 'text-muted-foreground'}`}
          >
            繁中
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${language === 'en' ? 'bg-background shadow text-foreground' : 'text-muted-foreground'}`}
          >
            EN
          </button>
        </div>

        <button
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="p-2 rounded-full hover:bg-secondary text-muted-foreground transition-colors"
          title="Toggle Theme"
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        <div className="relative group">
          <button className="p-2 rounded-full hover:bg-secondary text-muted-foreground transition-colors flex items-center">
            <Palette size={20} />
          </button>
          <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-2 grid grid-cols-2 gap-1">
            {FLOWER_THEMES.map(ft => (
              <button
                key={ft}
                onClick={() => setFlowerTheme(ft)}
                className={`text-xs p-2 rounded text-left hover:bg-secondary ${flowerTheme === ft ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground'}`}
              >
                {ft}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleJackpot}
          className="p-2 rounded-full hover:bg-secondary text-muted-foreground transition-colors"
          title="Jackpot Style Picker"
        >
          <Dices size={20} />
        </button>
      </div>
    </header>
  );
}
