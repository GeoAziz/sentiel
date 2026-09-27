import React from "react";
import {
  Shield,
  Activity,
  AlertTriangle,
  Bot,
  FileText,
  Sliders,
  Radio,
  Lock,
  FlaskConical,
  FileCode,
  Settings,
  Zap,
  Globe,
} from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeType?: "live" | "block" | "review";
  count?: number;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

interface SidebarProps {
  currentRoute: string;
  onNavigate: (route: string, params?: Record<string, string>) => void;
  stats: {
    totalEvents: number;
    blockedCount: number;
    pendingCount: number;
    activeAgents: number;
  };
  isLive: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRoute,
  onNavigate,
  stats,
  isLive,
}) => {
  const navSections: NavSection[] = [
    {
      title: "Portal",
      items: [{ id: "landing", label: "Homepage / Landing", icon: Globe }],
    },
    {
      title: "Real-Time",
      items: [
        { id: "overview", label: "Overview", icon: Shield },
        {
          id: "activity",
          label: "Live Activity",
          icon: Activity,
          badge: isLive ? "LIVE" : undefined,
          badgeType: "live",
        },
        {
          id: "events",
          label: "Security Events",
          icon: AlertTriangle,
          badge:
            stats.blockedCount > 0 ? String(stats.blockedCount) : undefined,
          badgeType: "block",
        },
        {
          id: "approvals",
          label: "Pending Approvals",
          icon: Lock,
          badge:
            stats.pendingCount > 0 ? String(stats.pendingCount) : undefined,
          badgeType: "review",
        },
      ],
    },
    {
      title: "Governance",
      items: [
        {
          id: "agents",
          label: "Agents Fleet",
          icon: Bot,
          count: stats.activeAgents,
        },
        { id: "policies", label: "Policies", icon: FileText },
        { id: "tools", label: "Capability Matrix", icon: Sliders },
      ],
    },
    {
      title: "Testing & Forensics",
      items: [
        { id: "simulator", label: "Attack Simulator", icon: Radio },
        { id: "sandbox", label: "Interceptor Sandbox", icon: FlaskConical },
        { id: "audit", label: "Audit Trail & SIEM", icon: FileCode },
        { id: "settings", label: "Settings", icon: Settings },
      ],
    },
  ];

  return (
    <aside className="w-[260px] bg-[#0E1013] border-r border-[#1E232A] flex flex-col h-screen select-none shrink-0">
      {/* Brand Header */}
      <div className="p-4 pb-3 border-b border-[#1E232A] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-[#1E2A3D] to-[#0F1620] border border-[#2A3038] flex items-center justify-center shadow-lg shadow-[#4A9EFF]/5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#4A9EFF] shadow-[0_0_10px_rgba(74,158,255,0.6)] animate-pulse" />
          </div>
          <div>
            <div className="mono font-bold tracking-[0.16em] text-[13px] text-[#E8EAED] flex items-center gap-1.5">
              SENTINEL
            </div>
            <div className="text-[10px] text-[#626B76] tracking-wider uppercase font-medium">
              Runtime Authorization
            </div>
          </div>
        </div>
      </div>

      {/* System Status Pill */}
      <div className="mx-3 mt-3 p-2 px-3 bg-[#F5A524]/10 border border-[#F5A524]/25 rounded-md flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#F5A524]" />
          <span className="mono text-[11px] font-semibold text-[#F5A524] tracking-wider">
            MOCK MODE
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="mono text-[10px] text-[#626B76]">API-backed demo</span>
        </div>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-4">
        {navSections.map((sec) => (
          <div key={sec.title} className="space-y-1">
            <div className="px-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#3F464E]">
              {sec.title}
            </div>
            <div className="space-y-0.5">
              {sec.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  currentRoute === item.id ||
                  (item.id === "events" && currentRoute === "event-detail") ||
                  (item.id === "agents" && currentRoute === "agent-detail") ||
                  (item.id === "policies" && currentRoute === "policy-detail");

                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-[13px] transition-all duration-150 group text-left ${
                      isActive
                        ? "bg-[#14171B] text-[#E8EAED] font-medium border-l-2 border-l-[#4A9EFF]"
                        : "text-[#9AA3AD] hover:bg-[#171B21] hover:text-[#E8EAED]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={`w-4 h-4 transition-colors shrink-0 ${
                          isActive
                            ? "text-[#4A9EFF]"
                            : "text-[#626B76] group-hover:text-[#9AA3AD]"
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`mono text-[10px] px-1.5 py-0.2 rounded font-medium border ${
                          item.badgeType === "live"
                            ? "bg-[#2ED47A]/15 text-[#2ED47A] border-[#2ED47A]/30"
                            : item.badgeType === "block"
                              ? "bg-[#FF4D4F]/15 text-[#FF4D4F] border-[#FF4D4F]/30"
                              : "bg-[#F5A524]/15 text-[#F5A524] border-[#F5A524]/30"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}

                    {item.count !== undefined && !item.badge && (
                      <span className="mono text-[11px] text-[#626B76]">
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer Info */}
      <div className="p-3 border-t border-[#1E232A] bg-[#0A0C0E] space-y-2">
        <div className="flex items-center justify-between text-[11px] mono">
          <span className="text-[#626B76]">Simulated authorization</span>
          <span className="text-[#F5A524] flex items-center gap-1">
            MOCK
          </span>
        </div>
        <div className="text-[10px] text-[#3F464E] leading-relaxed">
          We don&apos;t need perfect AI. We prevent unlimited authority.
        </div>
      </div>
    </aside>
  );
};
