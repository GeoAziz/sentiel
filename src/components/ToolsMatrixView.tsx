import React, { useState } from 'react';
import { Agent, ToolItem, Decision } from '../types/sentinel';
import { Sliders, Search, ShieldCheck, Check, AlertTriangle, X, RefreshCw } from 'lucide-react';

interface ToolsMatrixViewProps {
  agents: Agent[];
  tools: ToolItem[];
  matrixPermissions: Record<string, Record<string, Decision>>;
  onTogglePermission: (toolName: string, agentId: string) => void;
}

export const ToolsMatrixView: React.FC<ToolsMatrixViewProps> = ({
  agents,
  tools,
  matrixPermissions,
  onTogglePermission,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = ['ALL', 'Filesystem', 'Shell', 'Git', 'Deployment', 'Database', 'Network'];

  const filteredTools = tools.filter((tool) => {
    if (selectedCategory !== 'ALL' && tool.category !== selectedCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        tool.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-[#E8EAED] flex items-center gap-2">
          Tool & Capability Authorization Matrix
        </h1>
        <p className="text-xs text-[#9AA3AD] mt-1 max-w-2xl">
          Granular capability enforcement matrix. Click any permission cell to cycle authority level (ALLOW → REVIEW → BLOCK).
        </p>
      </div>

      {/* Filter and Category Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#0E1013] border border-[#1E232A] rounded-lg">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded mono text-[11px] font-medium border transition-colors cursor-pointer shrink-0 ${
                selectedCategory === cat
                  ? 'bg-[#14171B] border-[#2A3038] text-[#E8EAED]'
                  : 'text-[#626B76] border-transparent hover:text-[#9AA3AD]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-60">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#626B76]" />
          <input
            type="text"
            placeholder="Search tools & APIs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#14171B] border border-[#2A3038] rounded-md pl-8 pr-3 py-1 text-xs text-[#E8EAED] focus:outline-none focus:border-[#4A9EFF]"
          />
        </div>
      </div>

      {/* Matrix Table */}
      <div className="bg-[#0E1013] border border-[#1E232A] rounded-lg overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-[#1E232A] bg-[#0A0C0E] text-[10px] uppercase tracking-wider mono text-[#626B76] font-semibold">
              <th className="p-3.5 px-4 min-w-[200px]">Capability / Tool</th>
              <th className="p-3.5 px-3 min-w-[100px]">Risk Tier</th>
              {agents.map((a) => (
                <th key={a.id} className="p-3.5 px-4 min-w-[140px] text-center">
                  <div className="text-[#E8EAED]">{a.name}</div>
                  <div className="text-[9px] text-[#626B76] lowercase mt-0.5">{a.model}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1E232A]">
            {filteredTools.map((tool) => {
              const riskColor =
                tool.riskWeight === 'Critical'
                  ? 'text-[#FF4D4F] bg-[#FF4D4F]/10 border-[#FF4D4F]/30'
                  : tool.riskWeight === 'High'
                  ? 'text-[#F5A524] bg-[#F5A524]/10 border-[#F5A524]/30'
                  : tool.riskWeight === 'Medium'
                  ? 'text-[#4A9EFF] bg-[#4A9EFF]/10 border-[#4A9EFF]/30'
                  : 'text-[#626B76] bg-[#14171B] border-[#2A3038]';

              return (
                <tr key={tool.name} className="hover:bg-[#171B21]/60 transition-colors">
                  {/* Tool info */}
                  <td className="p-3.5 px-4">
                    <div className="mono text-xs font-semibold text-[#E8EAED]">
                      {tool.name}
                    </div>
                    <div className="text-[11px] text-[#626B76] mt-0.5 max-w-xs">
                      {tool.description}
                    </div>
                  </td>

                  {/* Risk Tier */}
                  <td className="p-3.5 px-3">
                    <span className={`mono text-[10px] px-2 py-0.5 rounded font-semibold border ${riskColor}`}>
                      {tool.riskWeight}
                    </span>
                  </td>

                  {/* Dynamic Agent Decision Cells */}
                  {agents.map((agent) => {
                    const currentDecision: Decision =
                      matrixPermissions[tool.name]?.[agent.id] ||
                      tool.defaultDecisions[agent.id] ||
                      'BLOCK';

                    const toneCls =
                      currentDecision === 'ALLOW'
                        ? 'bg-[#2ED47A]/15 text-[#2ED47A] border-[#2ED47A]/30 hover:bg-[#2ED47A]/25'
                        : currentDecision === 'REVIEW'
                        ? 'bg-[#F5A524]/15 text-[#F5A524] border-[#F5A524]/30 hover:bg-[#F5A524]/25'
                        : 'bg-[#FF4D4F]/15 text-[#FF4D4F] border-[#FF4D4F]/30 hover:bg-[#FF4D4F]/25';

                    const glyph =
                      currentDecision === 'ALLOW' ? '✓' : currentDecision === 'REVIEW' ? '⚠' : '✕';

                    return (
                      <td key={agent.id} className="p-3.5 px-4 text-center">
                        <button
                          onClick={() => onTogglePermission(tool.name, agent.id)}
                          className={`mono text-[10px] px-2.5 py-1 rounded font-bold border transition-all cursor-pointer ${toneCls}`}
                          title="Click to cycle permission (ALLOW → REVIEW → BLOCK)"
                        >
                          <span className="mr-1">{glyph}</span>
                          {currentDecision}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
