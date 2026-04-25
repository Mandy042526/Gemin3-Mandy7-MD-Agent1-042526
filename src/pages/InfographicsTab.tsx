import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { PieChart as PieChartIcon, Play, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import { generateText } from '../services/llm';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export function InfographicsTab() {
  const { t, language, settings, apiKeys } = useAppContext();
  const [status, setStatus] = useState<'idle' | 'running' | 'done' | 'error'>('idle');
  const [chartData, setChartData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleGenerate = async () => {
    setStatus('running');
    try {
      const prompt = `
        Generate JSON data for 4 infographics based on medical device regulatory requirements.
        Output ONLY valid JSON without markdown formatting.
        
        Structure:
        {
          "pieData": [{ "name": "Biocompatibility", "value": 400 }, ...],
          "barData": [{ "name": "Phase 1", "reqs": 40, "tests": 24 }, ...],
          "lineData": [{ "name": "Phase 1", "reqs": 40 }, ...],
          "areaData": [{ "name": "Phase 1", "tests": 24 }, ...]
        }
      `;

      const response = await generateText({
        prompt,
        model: settings.defaultModel,
        temperature: 0.1, // Low temp for JSON
        maxTokens: 2000,
        apiKeys
      });

      // Clean up markdown code blocks if present
      const cleanedResponse = response.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsedData = JSON.parse(cleanedResponse);
      
      setChartData(parsedData);
      setStatus('done');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message);
      setStatus('error');
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <PieChartIcon className="text-primary" />
            {t('infographics')}
          </h2>
          <p className="text-muted-foreground mt-2">
            Generate 5 WOW infographics based on the research report.
          </p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={status === 'running'}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2 rounded-md hover:opacity-90 transition-opacity font-medium disabled:opacity-50"
        >
          {status === 'running' ? <Loader2 size={18} className="animate-spin" /> : <Play size={18} />}
          Generate Infographics
        </button>
      </div>

      {status === 'idle' && (
        <div className="h-64 border-2 border-dashed border-border rounded-xl flex items-center justify-center text-muted-foreground">
          Click generate to create infographics from the report data.
        </div>
      )}

      {status === 'running' && (
        <div className="h-64 border border-border rounded-xl flex flex-col items-center justify-center text-muted-foreground space-y-4">
          <Loader2 size={32} className="animate-spin text-primary" />
          <p>Analyzing report and generating charts...</p>
        </div>
      )}

      {status === 'error' && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl border border-red-200 dark:border-red-800">
          Error generating charts: {errorMsg}
        </div>
      )}

      {status === 'done' && chartData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Chart 1 */}
          <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Requirement Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData.pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.pieData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2 */}
          <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Testing Coverage by Phase</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData.barData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="reqs" fill="#8884d8" />
                  <Bar dataKey="tests" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3 */}
          <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Standards Alignment Trend</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData.lineData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="reqs" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 4 */}
          <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Risk Mitigation Area</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData.areaData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="tests" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Chart 5 */}
          <div className="bg-card border border-border p-6 rounded-xl shadow-sm md:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Standards Crosswalk Matrix (WOW Feature #3)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-secondary/50">
                  <tr>
                    <th className="px-6 py-3 rounded-tl-lg">Requirement Category</th>
                    <th className="px-6 py-3">Candidate Standards</th>
                    <th className="px-6 py-3">Rationale</th>
                    <th className="px-6 py-3 rounded-tr-lg">Expected Evidence</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="px-6 py-4 font-medium">Biocompatibility</td>
                    <td className="px-6 py-4">ISO 10993-1</td>
                    <td className="px-6 py-4">Patient contact duration &gt; 30 days</td>
                    <td className="px-6 py-4">Cytotoxicity, Sensitization reports</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="px-6 py-4 font-medium">Sterilization</td>
                    <td className="px-6 py-4">ISO 11137</td>
                    <td className="px-6 py-4">Radiation sterilization method</td>
                    <td className="px-6 py-4">VDmax25 validation report</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium">Software</td>
                    <td className="px-6 py-4">IEC 62304</td>
                    <td className="px-6 py-4">Class B software safety</td>
                    <td className="px-6 py-4">Software architecture, SRS</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

