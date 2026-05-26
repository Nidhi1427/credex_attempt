import React from 'react';
import { type ToolName, type AuditFormData } from '../types';

interface SpendFormProps {
  formData: AuditFormData;
  setFormData: React.Dispatch<React.SetStateAction<AuditFormData>>;
  onRunAudit: () => void;
}

export default function SpendForm({ formData, setFormData, onRunAudit }: SpendFormProps) {
  
  if (!formData || !formData.tools) {
    return <div style={{ color: '#94a3b8', textAlign: 'center', padding: '40px', fontFamily: 'sans-serif' }}>Initializing Optimization Engine...</div>;
  }

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
    <div style={{
      width: '100%',
      maxWidth: '640px',
      margin: '40px auto',
      backgroundColor: '#0d111c',
      border: '1px solid #1e293b',
      borderRadius: '16px',
      color: '#f1f5f9',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      overflow: 'hidden',
      textAlign: 'left'
    }}>
      
      {/* Glow Top Accent Border */}
      <div style={{ height: '2px', background: 'linear-gradient(to right, transparent, #10b981, transparent)' }} />

      {/* Header Banner */}
      <div style={{ padding: '24px', borderBottom: '1px solid #1e293b', background: 'linear-gradient(to bottom, #111827, #0d111c)' }}>
        <span style={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#34d399', backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '4px 12px', borderRadius: '9999px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
          SaaS Spend Intelligence
        </span>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#ffffff', margin: '12px 0 4px 0', tracking: '-0.025em' }}>
          AI Spend Audit Console
        </h1>
        <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0, lineHeight: '1.5' }}>
          Instantly audit software footprints, isolate overlapping assistant licenses, and unlock capital efficiency vectors.
        </p>
      </div>

      <div style={{ padding: '24px' }}>
        
        {/* Global Configurations Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', padding: '16px', backgroundColor: '#070a12', border: '1px solid rgba(30, 41, 59, 0.5)', borderRadius: '12px', marginBottom: '24px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8', marginBottom: '6px' }}>Team Footprint</label>
            <input
              type="number" min="1" value={formData.companySize}
              onChange={(e) => handleMetadataChange('companySize', parseInt(e.target.value) || 1)}
              style={{ width: '100%', backgroundColor: '#0d111c', border: '1px solid #334155', borderRadius: '6px', padding: '8px 12px', color: '#fff', fontSize: '14px', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8', marginBottom: '6px' }}>Currency</label>
            <select
              value={formData.currency} onChange={(e) => handleMetadataChange('currency', e.target.value)}
              style={{ width: '100%', backgroundColor: '#0d111c', border: '1px solid #334155', borderRadius: '6px', padding: '8px 12px', color: '#fff', fontSize: '14px', cursor: 'pointer', boxSizing: 'border-box' }}
            >
              <option value="USD">USD ($) Global</option>
              <option value="INR">INR (₹) Local</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8', marginBottom: '6px' }}>Primary Focus</label>
            <select
              value={formData.primaryUseCase} onChange={(e) => handleMetadataChange('primaryUseCase', e.target.value)}
              style={{ width: '100%', backgroundColor: '#0d111c', border: '1px solid #334155', borderRadius: '6px', padding: '8px 12px', color: '#fff', fontSize: '14px', cursor: 'pointer', boxSizing: 'border-box' }}
            >
              <option value="mixed">Mixed Stack</option>
              <option value="coding">Engineering</option>
              <option value="writing">Content Gen</option>
              <option value="data">Data & BI</option>
            </select>
          </div>
        </div>

        {/* Active Tool List Tracker Tray */}
        <h2 style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8', marginBottom: '12px', paddingLeft: '2px' }}>Active Software Traces</h2>
        
        {/* CRITICAL FIX: Explicitly locked heights and scrolling styles using basic HTML properties */}
        <div style={{ maxHeight: '280px', overflowY: 'auto', paddingRight: '4px', marginBottom: '24px' }}>
          {(Object.keys(formData.tools) as ToolName[]).map((toolName) => {
            const tool = formData.tools[toolName];
            return (
              <div
                key={toolName}
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid #1e293b',
                  backgroundColor: tool.selected ? '#070a12' : 'transparent',
                  borderColor: tool.selected ? 'rgba(16, 185, 129, 0.3)' : '#1e293b',
                  marginBottom: '10px',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', width: '100%', fontWeight: '600', fontSize: '14px' }}>
                    <input
                      type="checkbox" checked={tool.selected} onChange={() => toggleTool(toolName)}
                      style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#10b981' }}
                    />
                    <span>{toolName}</span>
                  </label>
                </div>

                {tool.selected && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #1e293b' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '6px' }}>Plan Structure</label>
                      <select
                        value={tool.plan} onChange={(e) => handleToolFieldChange(toolName, 'plan', e.target.value)}
                        style={{ width: '100%', backgroundColor: '#0d111c', border: '1px solid #334155', borderRadius: '6px', padding: '6px 10px', color: '#fff', fontSize: '12px', cursor: 'pointer' }}
                      >
                        {toolName === 'Claude' || toolName === 'ChatGPT' ? (
                          <>
                            <option value="Individual">Individual Tier</option>
                            <option value="Team">Team Tier</option>
                          </>
                        ) : toolName.includes('API direct') ? (
                          <option value="API direct">API Metered</option>
                        ) : (
                          <>
                            <option value="Individual">Individual Plus</option>
                            <option value="Enterprise">Enterprise Spec</option>
                          </>
                        )}
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '6px' }}>Monthly Cost ({formData.currency === 'INR' ? '₹' : '$'})</label>
                      <input
                        type="number" min="0" value={tool.monthlySpend || ''} placeholder="0"
                        onChange={(e) => handleToolFieldChange(toolName, 'monthlySpend', parseFloat(e.target.value) || 0)}
                        style={{ width: '100%', backgroundColor: '#0d111c', border: '1px solid #334155', borderRadius: '6px', padding: '6px 10px', color: '#fff', fontSize: '12px', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '6px' }}>Seats Provisioned</label>
                      <input
                        type="number" min="1" value={tool.seats}
                        onChange={(e) => handleToolFieldChange(toolName, 'seats', parseInt(e.target.value) || 1)}
                        style={{ width: '100%', backgroundColor: '#0d111c', border: '1px solid #334155', borderRadius: '6px', padding: '6px 10px', color: '#fff', fontSize: '12px', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* The Action Button: Welded safely right here inside the layout box */}
        <div style={{ paddingTop: '16px', borderTop: '1px solid #1e293b' }}>
          <button
            type="button"
            onClick={onRunAudit}
            style={{
              width: '100%',
              background: 'linear-gradient(to right, #10b981, #14b8a6)',
              color: '#020617',
              fontWeight: '900',
              fontSize: '13px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              padding: '14px 0',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.2)',
              transition: 'transform 0.1s ease'
            }}
          >
            Run Instant Spend Audit →
          </button>
        </div>
      </div>

    </div>
  );
}