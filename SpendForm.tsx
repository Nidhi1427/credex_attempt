import React from 'react';
import { usePersistentAuditForm } from '../hooks/usePersistentAuditForm'; // adjust path as needed
import { ToolName } from '../types';

export default function SpendForm() {
  const [formData, setFormData] = usePersistentAuditForm();

  const handleMetadataChange = (field: 'companySize' | 'primaryUseCase', value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleToolCheckbox = (tool: ToolName) => {
    setFormData(prev => ({
      ...prev,
      tools: {
        ...prev.tools,
        [tool]: {
          ...prev.tools[tool],
          selected: !prev.tools[tool].selected
        }
      }
    }));
  };

  const handleToolFieldChange = (tool: ToolName, field: 'plan' | 'monthlySpend' | 'seats', value: any) => {
    setFormData(prev => ({
      ...prev,
      tools: {
        ...prev.tools,
        [tool]: {
          ...prev.tools[tool],
          [field]: value
        }
      }
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-slate-900 text-white rounded-xl shadow-md border border-slate-800">
      <h2 className="text-2xl font-bold mb-6 text-emerald-400">1. Tell us about your team & stack</h2>
      
      {/* Metadata Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Total Team Size</label>
          <input 
            type="number" 
            min="1"
            value={formData.companySize}
            onChange={(e) => handleMetadataChange('companySize', parseInt(e.target.value) || 1)}
            className="w-full bg-slate-800 border border-slate-700 rounded p-2.5 text-white focus:outline-none focus:border-emerald-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Primary AI Use Case</label>
          <select 
            value={formData.primaryUseCase}
            onChange={(e) => handleMetadataChange('primaryUseCase', e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded p-2.5 text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="mixed">Mixed Usage</option>
            <option value="coding">Software Engineering / Coding</option>
            <option value="writing">Content Writing / Copywriting</option>
            <option value="data">Data Analysis & BI</option>
            <option value="research">Academic & Market Research</option>
          </select>
        </div>
      </div>

      <h3 className="text-xl font-semibold mb-4 text-slate-200">Select the tools you pay for:</h3>

      {/* Tools Dynamic Section */}
      <div className="space-y-4">
        {(Object.keys(formData.tools) as ToolName[]).map((toolName) => {
          const tool = formData.tools[toolName];
          return (
            <div key={toolName} className="p-4 bg-slate-800/50 border border-slate-800 rounded-lg transition-colors duration-200 hover:border-slate-700">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={tool.selected}
                  onChange={() => handleToolCheckbox(toolName)}
                  className="w-5 h-5 rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-900"
                />
                <span className="font-medium text-lg text-slate-200">{toolName}</span>
              </label>

              {/* Collapsible Inputs inside selected tool card */}
              {tool.selected && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-800 animate-fadeIn">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Plan Tier</label>
                    <input 
                      type="text"
                      placeholder="e.g. Pro, Business, API"
                      value={tool.plan}
                      onChange={(e) => handleToolFieldChange(toolName, 'plan', e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Monthly Spend ($)</label>
                    <input 
                      type="number"
                      min="0"
                      value={tool.monthlySpend || ''}
                      placeholder="0"
                      onChange={(e) => handleToolFieldChange(toolName, 'monthlySpend', parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Seats Active</label>
                    <input 
                      type="number"
                      min="1"
                      value={tool.seats}
                      onChange={(e) => handleToolFieldChange(toolName, 'seats', parseInt(e.target.value) || 1)}
                      className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-sm text-white focus:outline-none focus:border-emerald-500"
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