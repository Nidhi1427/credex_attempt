import React from 'react';
import { type ToolName, type AuditFormData } from '../types';

interface SpendFormProps {
  formData: AuditFormData;
  setFormData: React.Dispatch<React.SetStateAction<AuditFormData>>;
}

export default function SpendForm({ formData, setFormData }: SpendFormProps) {
  
  const handleMetadataChange = (field: 'companySize' | 'primaryUseCase' | 'currency', value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleTool = (tool: ToolName) => {
    setFormData(prev => ({
      ...prev,
      tools: {
        ...prev.tools,
        [tool]: { ...prev.tools[tool], selected: !prev.tools[tool].selected }
      }
    }));
  };

  const handleToolFieldChange = (tool: ToolName, field: 'plan' | 'monthlySpend' | 'seats', value: any) => {
    setFormData(prev => ({
      ...prev,
      tools: {
        ...prev.tools,
        [tool]: { ...prev.tools[tool], [field]: value }
      }
    }));
  };

  return (
    <div className="max-w-3xl mx-auto my-10 p-8 bg-slate-900 border border-slate-800 rounded-2xl text-slate-100 shadow-2xl">
      <header className="mb-8 border-b border-slate-800 pb-6">
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 tracking-tight">
          AI Spend Audit Engine
        </h1>
        <p className="text-slate-400 mt-2 text-sm">
          Expose redundant software footprints and seat-minimum overcharges instantly.
        </p>
      </header>

      {/* Metadata Control Row */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Total Team Size</label>
          <input
            type="number"
            min="1"
            value={formData.companySize}
            onChange={(e) => handleMetadataChange('companySize', parseInt(e.target.value) || 1)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 focus:outline-none focus:border-emerald-500 transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Display Currency</label>
          <select
            value={formData.currency}
            onChange={(e) => handleMetadataChange('currency', e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 focus:outline-none focus:border-emerald-500 transition-all cursor-pointer"
          >
            <option value="USD">USD ($) - Global Corporate</option>
            <option value="INR">INR (₹) - Regional Localized</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Primary Use-Case</label>
          <select
            value={formData.primaryUseCase}
            onChange={(e) => handleMetadataChange('primaryUseCase', e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 focus:outline-none focus:border-emerald-500 transition-all cursor-pointer"
          >
            <option value="mixed">Mixed Architecture</option>
            <option value="coding">Software Engineering</option>
            <option value="writing">Content Generation</option>
            <option value="data">Data Analytics & BI</option>
          </select>
        </div>
      </section>

      {/* Interactive Tool Parameter Cards */}
      <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Active Infrastructure Trackers</h2>
      <div className="space-y-4">
        {(Object.keys(formData.tools) as ToolName[]).map((toolName) => {
          const tool = formData.tools[toolName];
          return (
            <div
              key={toolName}
              className={`p-5 rounded-xl border transition-all duration-200 ${
                tool.selected ? 'bg-slate-950/80 border-emerald-500/30 shadow-lg shadow-emerald-500/2' : 'bg-slate-950/20 border-slate-800/60 hover:border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-4 cursor-pointer flex-1 py-1">
                  <input
                    type="checkbox"
                    checked={tool.selected}
                    onChange={() => toggleTool(toolName)}
                    className="w-5 h-5 rounded border-slate-800 bg-slate-950 text-emerald-500 focus:ring-emerald-500/30"
                  />
                  <span className="font-semibold text-slate-200">{toolName}</span>
                </label>
              </div>

              {tool.selected && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5 pt-5 border-t border-slate-800/80">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Plan Tier</label>
                    <select
                      value={tool.plan}
                      onChange={(e) => handleToolFieldChange(toolName, 'plan', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 cursor-pointer"
                    >
                      {toolName === 'Claude' || toolName === 'ChatGPT' ? (
                        <>
                          <option value="Individual">Individual Tier</option>
                          <option value="Team">Team Tier</option>
                        </>
                      ) : toolName.includes('API direct') ? (
                        <option value="API direct">API Metered Usage</option>
                      ) : (
                        <>
                          <option value="Individual">Individual Plus</option>
                          <option value="Enterprise">Enterprise Spec</option>
                        </>
                      )}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Monthly Spend ({formData.currency === 'INR' ? '₹' : '$'})
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={tool.monthlySpend || ''}
                      placeholder="0"
                      onChange={(e) => handleToolFieldChange(toolName, 'monthlySpend', parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Seats Provisioned</label>
                    <input
                      type="number"
                      min="1"
                      value={tool.seats}
                      onChange={(e) => handleToolFieldChange(toolName, 'seats', parseInt(e.target.value) || 1)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}