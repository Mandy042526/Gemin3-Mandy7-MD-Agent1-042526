import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Activity, Clock, CheckCircle, AlertTriangle, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockData = [
  { name: 'Mon', runs: 4, tokens: 24000 },
  { name: 'Tue', runs: 7, tokens: 45000 },
  { name: 'Wed', runs: 2, tokens: 12000 },
  { name: 'Thu', runs: 9, tokens: 67000 },
  { name: 'Fri', runs: 5, tokens: 32000 },
  { name: 'Sat', runs: 1, tokens: 5000 },
  { name: 'Sun', runs: 0, tokens: 0 },
];

export function DashboardTab() {
  const { t, language } = useAppContext();

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Activity className="text-primary" />
          {t('dashboard')}
        </h2>
        <p className="text-muted-foreground mt-2">
          {language === 'tc' ? '系統狀態與執行歷史概覽' : 'System status and run history overview.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card border border-border p-6 rounded-xl shadow-sm flex flex-col items-center justify-center text-center">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full mb-4">
            <Activity size={24} />
          </div>
          <h4 className="text-sm font-medium text-muted-foreground">Active Workspace</h4>
          <p className="text-xl font-bold mt-1">Orthopedic_Fixator_v2.pdf</p>
        </div>
        <div className="bg-card border border-border p-6 rounded-xl shadow-sm flex flex-col items-center justify-center text-center">
          <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full mb-4">
            <CheckCircle size={24} />
          </div>
          <h4 className="text-sm font-medium text-muted-foreground">Citation Coverage Meter</h4>
          <p className="text-3xl font-bold mt-1 text-green-600">94%</p>
          <p className="text-xs text-muted-foreground mt-1">Highly Grounded</p>
        </div>
        <div className="bg-card border border-border p-6 rounded-xl shadow-sm flex flex-col items-center justify-center text-center">
          <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full mb-4">
            <BarChart3 size={24} />
          </div>
          <h4 className="text-sm font-medium text-muted-foreground">Est. Tokens Used</h4>
          <p className="text-3xl font-bold mt-1">185K</p>
          <p className="text-xs text-muted-foreground mt-1">This week</p>
        </div>
        <div className="bg-card border border-border p-6 rounded-xl shadow-sm flex flex-col items-center justify-center text-center">
          <div className="p-3 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full mb-4">
            <AlertTriangle size={24} />
          </div>
          <h4 className="text-sm font-medium text-muted-foreground">Warnings</h4>
          <p className="text-3xl font-bold mt-1 text-amber-600">2</p>
          <p className="text-xs text-muted-foreground mt-1">Unsupported claims detected</p>
        </div>
      </div>

      <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
        <h3 className="text-xl font-semibold mb-6">Run History (Tokens)</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.2} />
              <XAxis dataKey="name" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                itemStyle={{ color: 'var(--primary)' }}
              />
              <Bar dataKey="tokens" fill="var(--primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
        <h3 className="text-xl font-semibold mb-4">Recent Pipeline Runs</h3>
        <div className="space-y-3">
          {[
            { id: 'RUN-004', task: 'Skill Generator', status: 'done', time: '10 mins ago' },
            { id: 'RUN-003', task: 'Template Rewriter', status: 'done', time: '15 mins ago' },
            { id: 'RUN-002', task: 'Research Report', status: 'done', time: '22 mins ago' },
            { id: 'RUN-001', task: 'Guidance Ingestion', status: 'done', time: '25 mins ago' },
          ].map((run) => (
            <div key={run.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 text-primary p-2 rounded-md">
                  <Clock size={16} />
                </div>
                <div>
                  <p className="font-medium">{run.task}</p>
                  <p className="text-xs text-muted-foreground">{run.id} • {run.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  {run.status.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
