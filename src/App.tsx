import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardTab } from './pages/DashboardTab';
import { IngestionTab } from './pages/IngestionTab';
import { TemplateTab } from './pages/TemplateTab';
import { InfographicsTab } from './pages/InfographicsTab';
import { SkillStudioTab } from './pages/SkillStudioTab';
import { SettingsTab } from './pages/SettingsTab';

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto">
          {activeTab === 'dashboard' && <DashboardTab />}
          {activeTab === 'ingestion' && <IngestionTab />}
          {activeTab === 'template' && <TemplateTab />}
          {activeTab === 'infographics' && <InfographicsTab />}
          {activeTab === 'skillStudio' && <SkillStudioTab />}
          {activeTab === 'settings' && <SettingsTab />}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
