import React from 'react';
import { useAppContext } from '../context/AppContext';
import { LayoutDashboard, FileText, FileEdit, PieChart, Wrench, Settings } from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const { t } = useAppContext();

  const navItems = [
    { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { id: 'ingestion', label: t('ingestion'), icon: FileText },
    { id: 'template', label: t('template'), icon: FileEdit },
    { id: 'infographics', label: t('infographics'), icon: PieChart },
    { id: 'skillStudio', label: t('skillStudio'), icon: Wrench },
    { id: 'settings', label: t('settings'), icon: Settings },
  ];

  return (
    <div className="w-64 bg-card border-r border-border h-screen flex flex-col">
      <div className="p-6">
        <h1 className="text-xl font-bold text-primary">MedDevice Reviewer</h1>
        <p className="text-xs text-muted-foreground mt-1">Agentic System v2</p>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                activeTab === item.id 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
              )}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
