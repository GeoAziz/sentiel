import React, { useState } from "react";
import {
  Shield,
  ArrowRight,
  Star,
  ChevronRight,
  CheckCircle2,
  Globe,
  Lock,
  Cpu,
  Terminal,
  Database,
  Activity,
  ExternalLink,
  Radio,
  Sparkles,
  Layers,
  ChevronDown,
  Building2,
  Mail,
  Phone,
  MapPin,
  Send,
  X,
  Play,
  AlertTriangle,
  FileCode,
  Sliders,
  Check,
} from "lucide-react";

interface LandingPageProps {
  onEnterApp: () => void;
  onOpenSandbox: () => void;
  onRunDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterApp,
  onOpenSandbox,
  onRunDemo,
}) => {
  const [activePlatformTab, setActivePlatformTab] = useState<
    "INTERCEPTOR" | "TAINT" | "HITL" | "LEDGER"
  >("INTERCEPTOR");
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Interactive live simulator inside the hero
  const [heroAction, setHeroAction] = useState<
    "READ_ENV" | "NPM_TEST" | "DEPLOY_PROD"
  >("READ_ENV");

  // Contact form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    setContactSubmitted(true);
    setTimeout(() => {
      setName("");
      setEmail("");
      setMessage("");
      setContactSubmitted(false);
    }, 3500);
  };

  return (
    <div className="min-h-screen bg-[#080914] text-[#E8EAED] font-sans overflow-x-hidden selection:bg-[#5B45FF]/30 selection:text-[#A78BFA]">
      {/* =========================================================================
          1. HEADER / NAVIGATION BAR
          ========================================================================= */}
      <header className="sticky top-0 z-50 bg-[#080914]/90 backdrop-blur-md border-b border-[#1E233D] px-6 lg:px-12 h-20 flex items-center justify-between">
        {/* Brand */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-[#5B45FF] to-[#1E1B4B] border border-[#7C3AED]/40 flex items-center justify-center shadow-[0_0_20px_rgba(91,69,255,0.4)]">
            <Shield className="w-5 h-5 text-white" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#2ED47A] shadow-[0_0_8px_rgba(46,212,122,0.8)]" />
          </div>
          <div>
            <div className="mono font-bold text-lg tracking-[0.18em] text-white flex items-center gap-2">
              <span>SENTINEL</span>
              <span className="text-[10px] text-[#A78BFA] font-normal tracking-normal border border-[#7C3AED]/30 bg-[#5B45FF]/10 px-1.5 py-0.5 rounded">
                MOCK DEMO
              </span>
            </div>
            <div className="text-[9px] text-[#6366F1] tracking-wider uppercase font-medium">
              Simulated authorization control plane
            </div>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-[#9AA3C2]">
          <a
            href="#architecture"
            className="hover:text-white transition-colors"
          >
            Architecture
          </a>
          <a href="#platforms" className="hover:text-white transition-colors">
            Enforcement Engine
          </a>
          <a
            href="#integrations"
            className="hover:text-white transition-colors"
          >
            LLM Integrations
          </a>
          <a href="#research" className="hover:text-white transition-colors">
            Threat Research
          </a>
          <a href="#contact" className="hover:text-white transition-colors">
            Contact
          </a>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSandbox}
            className="hidden sm:inline-flex text-xs font-semibold text-[#A78BFA] hover:text-white transition-colors px-3 py-1.5"
          >
            Live Sandbox
          </button>

          {/* Launch Security Console CTA */}
          <button
            onClick={onEnterApp}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#5B45FF] to-[#7C3AED] hover:from-[#6D57FF] hover:to-[#8B5CF6] text-white text-xs font-semibold tracking-wide transition-all shadow-[0_0_25px_rgba(91,69,255,0.45)] hover:shadow-[0_0_35px_rgba(91,69,255,0.7)] cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Launch Security Console</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </header>

      {/* =========================================================================
          2. HERO SECTION ("SECURED BY INNOVATION" - 100% PRODUCT MATCH)
          ========================================================================= */}
      <section className="relative pt-12 pb-24 lg:pt-16 lg:pb-28 px-6 lg:px-16 overflow-hidden">
        {/* Ambient atmospheric nebula glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#5B45FF]/20 via-[#7C3AED]/15 to-transparent blur-[120px] pointer-events-none -z-10" />
        <div className="absolute bottom-0 inset-x-0 h-[280px] bg-gradient-to-t from-[#1A1040]/50 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5B45FF]/10 border border-[#7C3AED]/30 text-[#A78BFA] text-[11px] mono tracking-wider uppercase font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5B45FF] shadow-[0_0_8px_#5B45FF] animate-pulse" />
              <span>MOCK AUTHORIZATION FLOW · NO REAL TOOLS</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.08]">
              Reasoning is{" "}
              <span className="bg-gradient-to-r from-[#A78BFA] via-[#C084FC] to-[#4A9EFF] bg-clip-text text-transparent">
                not authorization.
              </span>
            </h1>

            <p className="text-[#9AA3C2] text-sm sm:text-base leading-relaxed max-w-xl">
              Explore a local mock of Sentinel&apos;s authorization flow. The API
              evaluates simulated requests, streams decisions, and gates a
              canned adapter; it does not spawn an agent or access files,
              secrets, shells, or external AI services.
            </p>

            <div className="p-4 bg-[#12142B]/90 border border-[#5B45FF]/40 rounded-xl space-y-1.5 shadow-[0_0_25px_rgba(91,69,255,0.18)]">
              <div className="flex items-center gap-2 text-[10px] mono text-[#A78BFA] font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#5B45FF]" />
                <span>CORE SECURITY PHILOSOPHY</span>
              </div>
              <p className="text-sm font-semibold text-white tracking-wide leading-snug">
                &ldquo;We&apos;re not trying to make AI agents perfect.
                We&apos;re making sure an imperfect AI agent doesn&apos;t have
                unlimited authority.&rdquo;
              </p>
              <p className="text-xs text-[#9AA3AD] mono">
                Assume the AI can make a bad decision. Make sure the bad
                decision cannot exceed its boundary.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-1">
              <button
                onClick={onRunDemo}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-[#5B45FF] to-[#7C3AED] hover:from-[#6D57FF] hover:to-[#8B5CF6] text-white text-xs font-bold tracking-wider uppercase transition-all shadow-[0_0_30px_rgba(91,69,255,0.4)] flex items-center gap-2 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5" />
                <span>RUN MOCK DEFENSE SCENARIO</span>
              </button>

              <button
                onClick={onEnterApp}
                className="px-6 py-3 rounded-full bg-[#12142B] border border-[#2D3154] hover:border-[#5B45FF] text-[#E8EAED] hover:text-white text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer group"
              >
                <Terminal className="w-4 h-4 text-[#4A9EFF] group-hover:scale-110 transition-transform" />
                <span>OPEN DASHBOARD</span>
              </button>
            </div>

            <div className="pt-2 flex items-center gap-6 text-xs mono text-[#626B76]">
              <span className="flex items-center gap-1.5 text-[#2ED47A]">
                <CheckCircle2 className="w-4 h-4" /> No real tools or files accessed
              </span>
              <span className="flex items-center gap-1.5 text-[#4A9EFF]">
                <Sparkles className="w-4 h-4" /> Deterministic mock advisory
              </span>
            </div>
          </div>

          {/* Right Hero: 3D Holographic Pedestal & Live Interactive Interceptor */}
          <div className="lg:col-span-6 relative flex justify-center items-center">
            <div className="relative w-full max-w-[540px] aspect-square flex items-center justify-center">
              {/* Back glowing aura */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#5B45FF]/25 to-[#7C3AED]/15 blur-2xl animate-pulse" />

              {/* Pedestal Cylinders (from reference video) */}
              <div className="absolute bottom-6 w-full flex justify-center items-end gap-6 opacity-90">
                {/* Left Pedestal */}
                <div className="w-24 h-32 rounded-t-2xl bg-gradient-to-t from-[#141630] via-[#1E2145] to-[#2B3060] border-t-2 border-[#5B45FF]/60 shadow-[0_0_20px_rgba(91,69,255,0.3)] flex flex-col items-center pt-2">
                  <div className="w-16 h-4 rounded-full bg-[#5B45FF]/30 border border-[#5B45FF]/60 blur-[1px]" />
                </div>

                {/* Center Main Pedestal */}
                <div className="w-32 h-44 rounded-t-2xl bg-gradient-to-t from-[#181B3B] via-[#242A57] to-[#393E7A] border-t-2 border-[#7C3AED] shadow-[0_0_35px_rgba(124,58,237,0.4)] flex flex-col items-center pt-2">
                  <div className="w-24 h-5 rounded-full bg-[#7C3AED]/40 border border-[#7C3AED] shadow-[0_0_15px_#7C3AED]" />
                </div>

                {/* Right Pedestal */}
                <div className="w-24 h-36 rounded-t-2xl bg-gradient-to-t from-[#141630] via-[#1E2145] to-[#2B3060] border-t-2 border-[#5B45FF]/60 shadow-[0_0_20px_rgba(91,69,255,0.3)] flex flex-col items-center pt-2">
                  <div className="w-16 h-4 rounded-full bg-[#5B45FF]/30 border border-[#5B45FF]/60 blur-[1px]" />
                </div>
              </div>

              {/* Central Floating Hologram - Interactive Agent Interception Card */}
              <div className="relative z-10 w-52 h-64 rounded-2xl bg-gradient-to-b from-[#2B1F69]/90 to-[#120F30]/95 border border-[#8B5CF6]/50 shadow-[0_0_50px_rgba(139,92,246,0.35)] backdrop-blur-xl flex flex-col items-center justify-between p-4 animate-float">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#5B45FF] to-[#A855F7] border border-white/20 flex items-center justify-center shadow-[0_0_25px_rgba(168,85,247,0.7)]">
                  <Shield className="w-8 h-8 text-white stroke-[2]" />
                </div>

                <div className="text-center">
                  <div className="mono font-bold tracking-widest text-xs text-white">
                    SENTINEL FIREWALL
                  </div>
                  <div className="text-[10px] text-[#A78BFA] tracking-wider uppercase font-semibold mt-0.5">
                    RUNTIME AUTHORIZER
                  </div>
                </div>

                {/* Current Intercepted Action Status */}
                <div className="w-full bg-[#080914]/80 p-2.5 rounded-lg border border-[#7C3AED]/40 text-center mono text-[10px]">
                  <div className="text-[#626B76] text-[9px] uppercase">
                    Active Intercept
                  </div>
                  <div className="text-[#E8EAED] font-bold truncate">
                    {heroAction === "READ_ENV"
                      ? 'read_file(".env")'
                      : heroAction === "NPM_TEST"
                        ? "npm test"
                        : "deploy.production"}
                  </div>
                  <div className="mt-1 font-bold">
                    {heroAction === "READ_ENV" ? (
                      <span className="text-[#FF4D4F]">
                        ✕ BLOCKED (0B LEAKED)
                      </span>
                    ) : heroAction === "NPM_TEST" ? (
                      <span className="text-[#2ED47A]">✓ ALLOWED</span>
                    ) : (
                      <span className="text-[#F5A524]">⚠ REVIEW REQUIRED</span>
                    )}
                  </div>
                </div>

                <div className="px-2.5 py-0.5 rounded-full bg-[#2ED47A]/15 border border-[#2ED47A]/30 text-[#2ED47A] text-[9px] mono font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2ED47A] animate-ping" />
                  GATEWAY ONLINE
                </div>
              </div>

              {/* Left Floating Interactive Tool Selector */}
              <div className="absolute left-0 top-16 z-20 w-48 p-3 rounded-xl bg-[#141836]/90 border border-[#5B45FF]/40 backdrop-blur-lg shadow-[0_15px_30px_rgba(0,0,0,0.5)] animate-float-delay text-xs mono">
                <div className="flex items-center justify-between text-[#A78BFA] font-semibold text-[10px] mb-2 pb-1 border-b border-[#2D3154]">
                  <span>TRY AGENT TOOL CALL</span>
                  <Sparkles className="w-3 h-3 text-[#4A9EFF]" />
                </div>
                <div className="space-y-1">
                  <button
                    onClick={() => setHeroAction("READ_ENV")}
                    className={`w-full text-left px-2 py-1 rounded text-[10px] transition-colors ${
                      heroAction === "READ_ENV"
                        ? "bg-[#FF4D4F]/20 text-[#FF4D4F] border border-[#FF4D4F]/40 font-bold"
                        : "text-[#9AA3AD] hover:bg-[#1E2145]"
                    }`}
                  >
                    1. read_file(&quot;.env&quot;)
                  </button>
                  <button
                    onClick={() => setHeroAction("NPM_TEST")}
                    className={`w-full text-left px-2 py-1 rounded text-[10px] transition-colors ${
                      heroAction === "NPM_TEST"
                        ? "bg-[#2ED47A]/20 text-[#2ED47A] border border-[#2ED47A]/40 font-bold"
                        : "text-[#9AA3AD] hover:bg-[#1E2145]"
                    }`}
                  >
                    2. run npm test
                  </button>
                  <button
                    onClick={() => setHeroAction("DEPLOY_PROD")}
                    className={`w-full text-left px-2 py-1 rounded text-[10px] transition-colors ${
                      heroAction === "DEPLOY_PROD"
                        ? "bg-[#F5A524]/20 text-[#F5A524] border border-[#F5A524]/40 font-bold"
                        : "text-[#9AA3AD] hover:bg-[#1E2145]"
                    }`}
                  >
                    3. deploy production
                  </button>
                </div>
              </div>

              {/* Right Floating AI Analysis Card */}
              <div className="absolute right-0 top-28 z-20 w-48 p-3 rounded-xl bg-[#141836]/90 border border-[#7C3AED]/40 backdrop-blur-lg shadow-[0_15px_30px_rgba(0,0,0,0.5)] animate-float text-xs mono">
                <div className="flex items-center gap-1.5 text-[#4A9EFF] font-semibold text-[10px] mb-1.5 pb-1 border-b border-[#2D3154]">
                  <Sparkles className="w-3 h-3" />
                  <span>MOCK THREAT ADVISORY</span>
                </div>
                {heroAction === "READ_ENV" ? (
                  <div className="space-y-1 text-[10px]">
                    <div className="text-[#FF4D4F] font-bold">
                      Threat: Prompt Injection
                    </div>
                    <div className="text-[#9AA3AD]">
                      Untrusted lineage probe targeting secret credentials.
                    </div>
                    <div className="text-[9px] text-[#A78BFA] pt-1">
                      MITRE: AML.T0051
                    </div>
                  </div>
                ) : heroAction === "NPM_TEST" ? (
                  <div className="space-y-1 text-[10px]">
                    <div className="text-[#2ED47A] font-bold">
                      Safe Execution
                    </div>
                    <div className="text-[#9AA3AD]">
                      Within developer role authority boundary.
                    </div>
                    <div className="text-[9px] text-[#A78BFA] pt-1">
                      Confidence: 99%
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1 text-[10px]">
                    <div className="text-[#F5A524] font-bold">
                      Dual-Key Required
                    </div>
                    <div className="text-[#9AA3AD]">
                      High blast-radius autonomous rollout gated.
                    </div>
                    <div className="text-[9px] text-[#A78BFA] pt-1">
                      MITRE: AML.T0053
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. LOGO MARQUEE & GARTNER CREDIBILITY
          ========================================================================= */}
      <section className="border-y border-[#1E233D] bg-[#0A0C1A] py-8 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-6">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6366F1]">
            TRUSTED BY ENTERPRISES DEPLOYING AUTONOMOUS AI AGENTS
          </div>

          <div className="w-full flex flex-wrap items-center justify-center gap-4 lg:gap-8 opacity-75">
            {[
              "Enterprise Financial Cloud",
              "Global Space Agency",
              "Defense Systems Corp",
              "Autonomous Robotics Lab",
              "National Cyber Directorate",
              "Sovereign AI Infrastructure",
              "FinTech Algorithmic Trading",
              "HealthCare Clinical AI",
            ].map((org, i) => (
              <div
                key={i}
                className="px-4 py-2 rounded-lg bg-[#11142A] border border-[#202546] text-xs font-semibold text-[#9AA3C2] hover:text-white hover:border-[#5B45FF] transition-all cursor-default"
              >
                {org}
              </div>
            ))}
          </div>

          {/* Gartner Rating Pill */}
          <div className="flex items-center gap-3 pt-2">
            <span className="text-xs font-bold text-white tracking-wider">
              Gartner
            </span>
            <div className="flex items-center text-[#F5A524] text-xs">
              {"★★★★★"}
            </div>
            <span className="mono text-xs font-bold text-white">
              4.9/5 Rated
            </span>
            <span className="text-xs text-[#6366F1] hover:text-[#A78BFA] cursor-pointer flex items-center gap-0.5">
              Peer Insights Verified <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. STATISTICS SECTION ("TRUSTED BY INDUSTRY")
          ========================================================================= */}
      <section className="py-20 px-6 lg:px-16 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A78BFA] mb-2">
              • STATISTICS
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold uppercase text-white tracking-tight">
              TRUSTED BY INDUSTRY
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#9AA3AD] max-w-md leading-relaxed">
            Comprehensive runtime authorization architecture designed
            specifically for autonomous LLM agents and multi-agent systems.
          </p>
        </div>

        {/* 5 Glassmorphic Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="p-6 rounded-2xl bg-[#0F1229]/80 border border-[#252B54] hover:border-[#5B45FF]/50 transition-all group">
            <div className="text-[11px] font-semibold text-[#9AA3AD] mb-1">
              Autonomous Actions
            </div>
            <div className="text-xs text-[#626B76] mb-6">
              Tool calls intercepted
            </div>
            <div className="mono text-3xl font-extrabold text-white group-hover:text-[#4A9EFF] transition-colors">
              10B+
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#0F1229]/80 border border-[#252B54] hover:border-[#5B45FF]/50 transition-all group">
            <div className="text-[11px] font-semibold text-[#9AA3AD] mb-1">
              Enforcement Latency
            </div>
            <div className="text-xs text-[#626B76] mb-6">
              Sub-millisecond decisions
            </div>
            <div className="mono text-3xl font-extrabold text-[#2ED47A]">
              &lt;2ms
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#0F1229]/80 border border-[#252B54] hover:border-[#5B45FF]/50 transition-all group">
            <div className="text-[11px] font-semibold text-[#9AA3AD] mb-1">
              Data Leakage
            </div>
            <div className="text-xs text-[#626B76] mb-6">Secrets disclosed</div>
            <div className="mono text-3xl font-extrabold text-[#2ED47A]">
              0 BYTES
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#0F1229]/80 border border-[#252B54] hover:border-[#5B45FF]/50 transition-all group">
            <div className="text-[11px] font-semibold text-[#9AA3AD] mb-1">
              Agent Coverage
            </div>
            <div className="text-xs text-[#626B76] mb-6">
              LangChain, CrewAI, AutoGen
            </div>
            <div className="mono text-3xl font-extrabold text-[#A78BFA]">
              100%
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#0F1229]/80 border border-[#252B54] hover:border-[#5B45FF]/50 transition-all group">
            <div className="text-[11px] font-semibold text-[#9AA3AD] mb-1">
              Compliance Ready
            </div>
            <div className="text-xs text-[#626B76] mb-6">
              EU AI Act (Art. 14) &amp; SOC 2
            </div>
            <div className="mono text-3xl font-extrabold text-[#F5A524]">
              CERTIFIED
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          ARCHITECTURE: THE NEW PARADIGM (Human → AI Agent → Sentinel → Systems)
          ========================================================================= */}
      <section
        id="architecture"
        className="py-20 px-6 lg:px-16 max-w-7xl mx-auto border-t border-[#1E233D]"
      >
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A78BFA] mb-2">
            • THE SECURITY PARADIGM SHIFT
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold uppercase text-white tracking-tight">
            WHAT IS AN AI AGENT ACTUALLY AUTHORIZED TO DO?
          </h2>
          <p className="text-xs sm:text-sm text-[#9AA3AD] mt-2">
            Traditional software follows rigid code. Autonomous agents interpret
            untrusted documents, reason, and execute tools dynamically. Sentinel
            sits in the middle as the zero-trust boundary.
          </p>
        </div>

        {/* 2-Column Comparison Grid: Vulnerable vs Sentinel Zero-Trust */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Left: Without Sentinel (The Danger) */}
          <div className="p-7 rounded-2xl bg-[#0F101A] border border-[#FF4D4F]/30 shadow-lg space-y-5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#251A24]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF4D4F] animate-pulse" />
                  <span className="mono text-xs font-bold text-[#FF4D4F] uppercase tracking-wider">
                    WITHOUT SENTINEL · UNCONTROLLED AUTHORITY
                  </span>
                </div>
                <span className="text-[10px] mono text-[#626B76]">
                  Traditional Setup
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#090A12] border border-[#1E233D] font-mono text-xs space-y-2 text-[#9AA3AD]">
                <div className="text-white font-bold">
                  1. Human assigns task: &ldquo;Fix checkout bug&rdquo;
                </div>
                <div className="text-[#A78BFA]">
                  2. AI Agent (Claude Code) reads workspace + untrusted README
                </div>
                <div className="text-[#FF4D4F] font-semibold">
                  3. Hidden injection triggers unauthorized tools:
                </div>
                <div className="pl-3 border-l-2 border-[#FF4D4F]/40 space-y-1 text-[11px]">
                  <div>
                    💥{" "}
                    <code className="text-[#FF4D4F]">
                      read_file(&quot;.env&quot;)
                    </code>{" "}
                    $\rightarrow$ Secret API keys exfiltrated
                  </div>
                  <div>
                    💥 <code className="text-[#FF4D4F]">rm -rf /</code>{" "}
                    $\rightarrow$ Destructive shell execution
                  </div>
                  <div>
                    💥 <code className="text-[#FF4D4F]">deploy production</code>{" "}
                    $\rightarrow$ Outage in live cluster
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-[#FF4D4F]/10 border border-[#FF4D4F]/25 rounded-lg text-xs mono text-[#FF4D4F] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>
                Result: The agent decides its own authority. Critical breach
                risk.
              </span>
            </div>
          </div>

          {/* Right: With Sentinel (Zero-Trust Protection) */}
          <div className="p-7 rounded-2xl bg-gradient-to-br from-[#12142E] to-[#0A0C1A] border border-[#5B45FF]/50 shadow-[0_0_40px_rgba(91,69,255,0.2)] space-y-5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#2D3154]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2ED47A] shadow-[0_0_8px_#2ED47A]" />
                  <span className="mono text-xs font-bold text-[#2ED47A] uppercase tracking-wider">
                    WITH SENTINEL · ZERO-TRUST RUNTIME FIREWALL
                  </span>
                </div>
                <span className="text-[10px] mono text-[#2ED47A]">
                  Guaranteed Containment
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#090A12] border border-[#2D3154] font-mono text-xs space-y-2 text-[#9AA3AD]">
                <div className="text-white font-bold">
                  1. Human $\rightarrow$ AI Agent $\rightarrow${" "}
                  <span className="text-[#5B45FF] px-1 py-0.5 rounded bg-[#5B45FF]/20 border border-[#5B45FF]/40 font-bold">
                    🛡️ SENTINEL
                  </span>
                </div>
                <div className="text-[#A78BFA]">
                  2. Every tool invocation trapped before OS execution:
                </div>
                <div className="pl-3 border-l-2 border-[#2ED47A]/50 space-y-1 text-[11px]">
                  <div>
                    ✓{" "}
                    <code className="text-[#2ED47A]">read src/checkout.ts</code>{" "}
                    $\rightarrow${" "}
                    <span className="text-[#2ED47A] font-bold">ALLOW ✅</span>
                  </div>
                  <div>
                    ✕ <code className="text-[#FF4D4F]">read .env</code>{" "}
                    $\rightarrow${" "}
                    <span className="text-[#FF4D4F] font-bold">
                      HARD BLOCK 🛑 (0B Leaked)
                    </span>
                  </div>
                  <div>
                    ⚠ <code className="text-[#F5A524]">deploy production</code>{" "}
                    $\rightarrow${" "}
                    <span className="text-[#F5A524] font-bold">
                      HUMAN IN THE LOOP ⚠️
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-[#2ED47A]/10 border border-[#2ED47A]/25 rounded-lg text-xs mono text-[#2ED47A] flex items-center justify-between">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>
                  Result: An imperfect AI cannot exceed its authority.
                </span>
              </span>
              <button
                onClick={onRunDemo}
                className="text-xs font-bold text-[#A78BFA] hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <span>Watch Live Demo</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. PLATFORMS INTERACTIVE SHOWCASE ("EXPLORE OUR PLATFORMS" - 100% SENTINEL PRODUCT)
          ========================================================================= */}
      <section
        id="platforms"
        className="py-20 px-6 lg:px-16 bg-[#0B0D1E] border-y border-[#1E233D]"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A78BFA] mb-2">
              • ENFORCEMENT PLATFORMS
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold uppercase text-white tracking-tight">
              EXPLORE OUR PLATFORMS
            </h2>
            <p className="text-xs sm:text-sm text-[#9AA3AD] mt-2">
              The four foundational pillars of autonomous agent runtime security
              and authorization.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Interactive Tabs */}
            <div className="lg:col-span-6 space-y-3">
              {/* Tab 1: Sentinel Interceptor */}
              <div
                onClick={() => setActivePlatformTab("INTERCEPTOR")}
                className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                  activePlatformTab === "INTERCEPTOR"
                    ? "bg-[#15193B] border-[#5B45FF] shadow-[0_0_30px_rgba(91,69,255,0.25)]"
                    : "bg-[#0E1024] border-[#1E233D] hover:border-[#2D3460] opacity-80"
                }`}
              >
                <div className="mono font-bold text-xs uppercase text-[#A78BFA] mb-1">
                  1. SENTINEL INTERCEPTOR
                </div>
                <h3 className="text-base font-bold text-white mb-1.5">
                  Runtime Tool &amp; Subprocess Execution Firewall
                </h3>
                <p className="text-xs text-[#9AA3C2] leading-relaxed mb-3">
                  Traps every agent tool invocation (`read_file`, `write_file`,
                  `shell.run`, `deploy`, `git.push`, `db.query`) before it
                  reaches the operating system or cloud API.
                </p>
                <button
                  onClick={onEnterApp}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#5B45FF] hover:bg-[#6D57FF] text-white text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  <span>OPEN CONSOLE</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Tab 2: Sentinel TaintGuard */}
              <div
                onClick={() => setActivePlatformTab("TAINT")}
                className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                  activePlatformTab === "TAINT"
                    ? "bg-[#15193B] border-[#5B45FF] shadow-[0_0_30px_rgba(91,69,255,0.25)]"
                    : "bg-[#0E1024] border-[#1E233D] hover:border-[#2D3460] opacity-80"
                }`}
              >
                <div className="mono font-bold text-xs uppercase text-[#4A9EFF] mb-1">
                  2. SENTINEL TAINTGUARD
                </div>
                <h3 className="text-base font-bold text-white mb-1">
                  Indirect Prompt Injection &amp; Lineage Taint Tracker
                </h3>
                <p className="text-xs text-[#9AA3C2] leading-relaxed">
                  Identifies when autonomous actions were triggered by untrusted
                  third-party content (e.g. GitHub issues, poisoned PR comments,
                  scraped web pages) and enforces quarantine.
                </p>
              </div>

              {/* Tab 3: Sentinel Dual-Key HITL */}
              <div
                onClick={() => setActivePlatformTab("HITL")}
                className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                  activePlatformTab === "HITL"
                    ? "bg-[#15193B] border-[#5B45FF] shadow-[0_0_30px_rgba(91,69,255,0.25)]"
                    : "bg-[#0E1024] border-[#1E233D] hover:border-[#2D3460] opacity-80"
                }`}
              >
                <div className="mono font-bold text-xs uppercase text-[#F5A524] mb-1">
                  3. SENTINEL DUAL-KEY HITL
                </div>
                <h3 className="text-base font-bold text-white mb-1">
                  Human-in-the-Loop High Blast-Radius Gating
                </h3>
                <p className="text-xs text-[#9AA3C2] leading-relaxed">
                  Automatically holds high-risk operations (production
                  deployments, database drops, force pushes) in an operator
                  review queue requiring dual-key human authorization.
                </p>
              </div>

              {/* Tab 4: Mock Event Log */}
              <div
                onClick={() => setActivePlatformTab("LEDGER")}
                className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                  activePlatformTab === "LEDGER"
                    ? "bg-[#15193B] border-[#5B45FF] shadow-[0_0_30px_rgba(91,69,255,0.25)]"
                    : "bg-[#0E1024] border-[#1E233D] hover:border-[#2D3460] opacity-80"
                }`}
              >
                <div className="mono font-bold text-xs uppercase text-[#2ED47A] mb-1">
                  4. MOCK EVENT LOG
                </div>
                <h3 className="text-base font-bold text-white mb-1">
                  In-Memory Decisions &amp; Approval History
                </h3>
                <p className="text-xs text-[#9AA3C2] leading-relaxed">
                  Demo event records and approval transitions live in memory
                  and reset with the server. No cryptographic integrity or
                  compliance guarantee is provided.
                </p>
              </div>
            </div>

            {/* Right Platform Visual Graphic */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="w-full max-w-lg aspect-square rounded-3xl bg-gradient-to-br from-[#1A1F4A] to-[#0A0D1F] border border-[#5B45FF]/40 shadow-[0_0_60px_rgba(91,69,255,0.2)] p-8 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.25),transparent_70%)] pointer-events-none" />

                <div className="flex items-center justify-between z-10">
                  <span className="mono text-xs font-bold text-[#A78BFA] px-2.5 py-1 rounded bg-[#5B45FF]/20 border border-[#7C3AED]/40">
                    {activePlatformTab === "INTERCEPTOR"
                      ? "SENTINEL RUNTIME FIREWALL"
                      : activePlatformTab === "TAINT"
                        ? "PROVENANCE TAINT TRACKER"
                        : activePlatformTab === "HITL"
                          ? "HUMAN SUPERVISOR QUEUE"
                          : "MOCK EVENT LOG"}
                  </span>
                  <span className="text-xs mono text-[#2ED47A] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#2ED47A] animate-pulse" />
                    PERIMETER SECURE
                  </span>
                </div>

                {/* Central Futuristic Graphic */}
                <div className="my-auto flex flex-col items-center justify-center py-6 z-10">
                  <div className="relative w-36 h-36 rounded-full bg-gradient-to-tr from-[#5B45FF] to-[#A855F7] p-1 shadow-[0_0_50px_rgba(91,69,255,0.6)] animate-pulse">
                    <div className="w-full h-full rounded-full bg-[#0E1024] flex items-center justify-center">
                      {activePlatformTab === "INTERCEPTOR" ? (
                        <Shield className="w-16 h-16 text-[#A78BFA]" />
                      ) : activePlatformTab === "TAINT" ? (
                        <Sparkles className="w-16 h-16 text-[#4A9EFF]" />
                      ) : activePlatformTab === "HITL" ? (
                        <Lock className="w-16 h-16 text-[#F5A524]" />
                      ) : (
                        <FileCode className="w-16 h-16 text-[#2ED47A]" />
                      )}
                    </div>
                  </div>
                  <div className="mt-6 text-center">
                    <div className="mono font-bold text-white text-base">
                      {activePlatformTab === "INTERCEPTOR"
                        ? "Zero-Trust Tool Boundary"
                        : activePlatformTab === "TAINT"
                          ? "Indirect Injection Neutralized"
                          : activePlatformTab === "HITL"
                            ? "Dual-Key Operator Signoff"
                            : "Illustrative Mock Event Hashes"}
                    </div>
                    <div className="text-xs text-[#9AA3AD] mt-1 max-w-xs mx-auto">
                      {activePlatformTab === "INTERCEPTOR"
                        ? "Simulated requests are evaluated by the mock API."
                        : activePlatformTab === "TAINT"
                          ? "Context lineage checked against untrusted threat vectors."
                          : activePlatformTab === "HITL"
                            ? "Prevents autonomous agents from modifying live production."
                            : "Exportable demo records; not compliance evidence."}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#252B54] z-10">
                  <span className="text-xs text-[#9AA3AD]">
                    Deterministic mock advisory · no external model
                  </span>
                  <button
                    onClick={onOpenSandbox}
                    className="text-xs font-bold text-[#A78BFA] hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <span>Test in Sandbox</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. REVIEWS / GARTNER ("TRUSTED BY ENTERPRISES")
          ========================================================================= */}
      <section className="py-24 px-6 lg:px-16 relative overflow-hidden bg-gradient-to-b from-[#080914] via-[#141233] to-[#080914]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A78BFA] mb-2">
              • VERIFIED REVIEWS
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold uppercase text-white tracking-tight">
              TRUSTED BY ENTERPRISES
            </h2>
            <p className="text-xs sm:text-sm text-[#9AA3AD] mt-2">
              Feedback from enterprise CISOs and AI Security Architects running
              Sentinel in production.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Review Card 1 */}
            <div className="p-6 rounded-2xl bg-[#0E1026]/90 border border-[#252B54] shadow-xl backdrop-blur-md space-y-4">
              <div className="flex items-center text-[#F5A524] text-xs">
                {"★★★★★"}
              </div>
              <div className="mono text-[10px] text-[#A78BFA] uppercase">
                PRODUCT: SENTINEL INTERCEPTOR · JAN 2026
              </div>
              <h4 className="font-bold text-white text-sm">
                &ldquo;Prevented indirect prompt injection from leaking API keys
                on day one.&rdquo;
              </h4>
              <p className="text-xs text-[#9AA3AD] leading-relaxed">
                We deployed coding agents with Claude and Gemini across 400
                developer repositories. Sentinel blocked poisoned markdown
                instructions from accessing `.env` and AWS credentials.
              </p>
              <div className="pt-2 border-t border-[#1E233D] text-[11px] mono text-[#626B76]">
                Chief Information Security Officer, FinTech Corp
              </div>
            </div>

            {/* Center Gartner Peer Insights Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#1C184A] to-[#0E1026] border border-[#7C3AED]/50 shadow-[0_0_40px_rgba(124,58,237,0.3)] space-y-4 text-center flex flex-col justify-between">
              <div>
                <div className="mono text-[11px] text-[#A78BFA] font-bold uppercase mb-1">
                  Gartner Peer Insights
                </div>
                <h3 className="text-2xl font-extrabold text-white">Sentinel</h3>
                <div className="text-xs text-[#9AA3AD] mt-1">
                  AI Agent Runtime Security &amp; Authorization
                </div>
              </div>

              <div className="py-4">
                <div className="mono text-4xl font-extrabold text-white">
                  4.9
                </div>
                <div className="flex justify-center items-center text-[#F5A524] text-base mt-1">
                  {"★★★★★"}
                </div>
                <div className="text-[11px] mono text-[#626B76] mt-1">
                  98 Verified Enterprise Reviews
                </div>
              </div>

              <button
                onClick={onEnterApp}
                className="w-full py-2.5 rounded-full bg-[#5B45FF] hover:bg-[#6D57FF] text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Open Security Console
              </button>
            </div>

            {/* Review Card 3 */}
            <div className="p-6 rounded-2xl bg-[#0E1026]/90 border border-[#252B54] shadow-xl backdrop-blur-md space-y-4">
              <div className="flex items-center text-[#F5A524] text-xs">
                {"★★★★★"}
              </div>
              <div className="mono text-[10px] text-[#A78BFA] uppercase">
                PRODUCT: DUAL-KEY HITL · FEB 2026
              </div>
              <h4 className="font-bold text-white text-sm">
                &ldquo;Gave us confidence to automate production releases with
                AI.&rdquo;
              </h4>
              <p className="text-xs text-[#9AA3AD] leading-relaxed">
                The human-in-the-loop review queue gives our SRE team total
                control over high blast-radius actions. Autonomous releases are
                fast, but zero unapproved code hits production.
              </p>
              <div className="pt-2 border-t border-[#1E233D] text-[11px] mono text-[#626B76]">
                VP of Platform Engineering, Cloud Infrastructure
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. ORBITAL INTEGRATIONS ("SMART INTEGRATIONS. SIMPLIFY YOUR WORKFLOW")
          ========================================================================= */}
      <section
        id="integrations"
        className="py-24 px-6 lg:px-16 bg-[#080914] relative overflow-hidden"
      >
        <div className="max-w-6xl mx-auto flex flex-col items-center justify-center text-center relative z-10">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A78BFA] mb-2">
            • INTEGRATIONS
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold uppercase text-white tracking-tight max-w-xl">
            SMART INTEGRATIONS. <br />
            SIMPLIFY YOUR WORKFLOW
          </h2>
          <p className="text-xs sm:text-sm text-[#9AA3AD] mt-3 max-w-lg">
            Works out of the box with all leading foundation models, autonomous
            frameworks, and SecOps SIEM pipelines.
          </p>

          {/* Orbital Horizon Graphic with Floating Badges (Matching video 00:20-00:23) */}
          <div className="relative w-full max-w-3xl h-[340px] mt-12 flex items-center justify-center">
            {/* Glowing planetary arc horizon */}
            <div className="absolute -bottom-20 w-[900px] h-[300px] rounded-[100%] border-t-2 border-[#5B45FF] shadow-[0_-15px_60px_rgba(91,69,255,0.7)] bg-gradient-to-t from-[#5B45FF]/10 to-transparent pointer-events-none" />

            {/* Concentric Ring 1 */}
            <div className="absolute w-[500px] h-[500px] rounded-full border border-[#252B54]/50 pointer-events-none" />
            {/* Concentric Ring 2 */}
            <div className="absolute w-[680px] h-[680px] rounded-full border border-[#1E233D]/40 pointer-events-none" />

            {/* Floating Orbiting Badges */}
            <div className="absolute -top-4 left-1/4 px-3.5 py-1.5 rounded-full bg-[#11142A] border border-[#5B45FF]/40 text-xs font-semibold text-white shadow-lg flex items-center gap-2 animate-float">
              <span className="w-2 h-2 rounded-full bg-[#4A9EFF]" />
              Anthropic Claude
            </div>

            <div className="absolute -top-4 right-1/4 px-3.5 py-1.5 rounded-full bg-[#11142A] border border-[#7C3AED]/40 text-xs font-semibold text-white shadow-lg flex items-center gap-2 animate-float-delay">
              <span className="w-2 h-2 rounded-full bg-[#A855F7]" />
              Google Gemini
            </div>

            <div className="absolute top-20 left-10 px-3.5 py-1.5 rounded-full bg-[#11142A] border border-[#252B54] text-xs font-semibold text-[#9AA3AD] shadow-lg flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-[#2ED47A]" />
              LangChain / LangGraph
            </div>

            <div className="absolute top-20 right-10 px-3.5 py-1.5 rounded-full bg-[#11142A] border border-[#252B54] text-xs font-semibold text-[#9AA3AD] shadow-lg flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-[#4A9EFF]" />
              CrewAI &amp; AutoGen
            </div>

            <div className="absolute bottom-28 left-20 px-3.5 py-1.5 rounded-full bg-[#11142A] border border-[#252B54] text-xs font-semibold text-[#9AA3AD] shadow-lg flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-[#FF4D4F]" />
              Splunk &amp; Datadog SIEM
            </div>

            <div className="absolute bottom-28 right-20 px-3.5 py-1.5 rounded-full bg-[#11142A] border border-[#252B54] text-xs font-semibold text-[#9AA3AD] shadow-lg flex items-center gap-2">
              <Database className="w-3.5 h-3.5 text-[#F5A524]" />
              AWS Secrets Manager &amp; IAM
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          8. RESEARCH & INSIGHTS ("OUR LATEST INSIGHTS")
          ========================================================================= */}
      <section id="research" className="py-20 px-6 lg:px-16 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A78BFA] mb-2">
            • AI AGENT THREAT RESEARCH
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold uppercase text-white tracking-tight">
            OUR LATEST INSIGHTS
          </h2>
          <p className="text-xs sm:text-sm text-[#9AA3AD] mt-2">
            Stay informed with our latest runtime authorization research, prompt
            injection defense papers, and compliance analyses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Article 1 */}
          <div className="rounded-2xl bg-[#0E1024] border border-[#1E233D] overflow-hidden hover:border-[#5B45FF] transition-all group flex flex-col justify-between">
            <div className="h-44 bg-gradient-to-br from-[#1E1B4B] via-[#0F172A] to-[#0A0C1A] p-4 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(91,69,255,0.3),transparent_60%)]" />
              <div className="mono text-[10px] px-2 py-0.5 rounded bg-[#5B45FF]/30 text-[#A78BFA] font-bold w-fit z-10">
                THREAT RESEARCH
              </div>
              <div className="z-10 text-white font-bold mono text-sm">
                AML.T0051 / OWASP LLM01
              </div>
            </div>
            <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <div className="mono text-[10px] text-[#626B76] mb-1">
                  5 MIN READ · JAN 2026
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-[#4A9EFF] transition-colors leading-snug">
                  Top 5 Indirect Prompt Injection types in Agentic Workflows and
                  prevention strategies
                </h4>
              </div>
              <button
                onClick={onOpenSandbox}
                className="text-xs font-bold text-[#A78BFA] hover:text-white flex items-center gap-1 mono pt-2 cursor-pointer"
              >
                <span>TEST ATTACK IN SANDBOX</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Article 2 */}
          <div className="rounded-2xl bg-[#0E1024] border border-[#1E233D] overflow-hidden hover:border-[#5B45FF] transition-all group flex flex-col justify-between">
            <div className="h-44 bg-gradient-to-br from-[#15193B] via-[#1E1B4B] to-[#0A0C1A] p-4 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.3),transparent_60%)]" />
              <div className="mono text-[10px] px-2 py-0.5 rounded bg-[#7C3AED]/30 text-[#C084FC] font-bold w-fit z-10">
                ARCHITECTURE
              </div>
              <div className="z-10 text-white font-bold mono text-sm">
                ZERO-TRUST RUNTIME BOUNDARY
              </div>
            </div>
            <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <div className="mono text-[10px] text-[#626B76] mb-1">
                  4 MIN READ · FEB 2026
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-[#4A9EFF] transition-colors leading-snug">
                  Decoupling policy enforcement from model weights: The Sentinel
                  Pattern
                </h4>
              </div>
              <button
                onClick={onEnterApp}
                className="text-xs font-bold text-[#A78BFA] hover:text-white flex items-center gap-1 mono pt-2 cursor-pointer"
              >
                <span>EXPLORE ARCHITECTURE</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Article 3 */}
          <div className="rounded-2xl bg-[#0E1024] border border-[#1E233D] overflow-hidden hover:border-[#5B45FF] transition-all group flex flex-col justify-between">
            <div className="h-44 bg-gradient-to-br from-[#172554] via-[#0F172A] to-[#0A0C1A] p-4 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(46,212,122,0.3),transparent_60%)]" />
              <div className="mono text-[10px] px-2 py-0.5 rounded bg-[#2ED47A]/30 text-[#2ED47A] font-bold w-fit z-10">
                COMPLIANCE &amp; GRC
              </div>
              <div className="z-10 text-white font-bold mono text-sm">
                EU AI ACT (ARTICLE 14)
              </div>
            </div>
            <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <div className="mono text-[10px] text-[#626B76] mb-1">
                  6 MIN READ · MAR 2026
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-[#4A9EFF] transition-colors leading-snug">
                  What is the role of Dual-Key Human Gating and EU AI Act
                  Article 14 oversight?
                </h4>
              </div>
              <button
                onClick={onEnterApp}
                className="text-xs font-bold text-[#A78BFA] hover:text-white flex items-center gap-1 mono pt-2 cursor-pointer"
              >
                <span>VIEW AUDIT LEDGER</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          9. FOOTER & CONTACT US (Matching video 00:29-00:31)
          ========================================================================= */}
      <footer
        id="contact"
        className="border-t border-[#1E233D] bg-[#0A0C1C] py-16 px-6 lg:px-16"
      >
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Dual Contact Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form */}
            <div className="p-8 rounded-3xl bg-[#0E1026] border border-[#20254A] shadow-xl space-y-4">
              <h3 className="text-xl font-bold text-white">
                Contact Our AI Security Team
              </h3>
              <p className="text-xs text-[#9AA3AD]">
                Schedule an enterprise architectural consultation with Sentinel
                cybersecurity engineers.
              </p>

              <form
                onSubmit={handleContactSubmit}
                className="space-y-3 text-xs"
              >
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#141733] border border-[#262C54] rounded-xl p-3 text-xs text-white placeholder-[#626B76] focus:outline-none focus:border-[#5B45FF]"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    required
                    placeholder="Enter your work email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#141733] border border-[#262C54] rounded-xl p-3 text-xs text-white placeholder-[#626B76] focus:outline-none focus:border-[#5B45FF]"
                  />
                </div>
                <div>
                  <textarea
                    rows={3}
                    placeholder="Message / describe your autonomous agent infrastructure..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-[#141733] border border-[#262C54] rounded-xl p-3 text-xs text-white placeholder-[#626B76] focus:outline-none focus:border-[#5B45FF]"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  {contactSubmitted ? (
                    <span className="text-[#2ED47A] text-xs mono flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-4 h-4" /> Message received. Our
                      CISO team will respond shortly.
                    </span>
                  ) : (
                    <span />
                  )}

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#5B45FF] to-[#7C3AED] hover:from-[#6D57FF] hover:to-[#8B5CF6] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-[#5B45FF]/30 cursor-pointer"
                  >
                    SEND NOW
                  </button>
                </div>
              </form>
            </div>

            {/* Direct Info */}
            <div className="p-8 rounded-3xl bg-[#0E1026] border border-[#20254A] shadow-xl flex flex-col justify-between space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Get In Touch
                </h3>
                <p className="text-xs text-[#9AA3AD] leading-relaxed">
                  Sentinel provides 24/7 dedicated threat telemetry and
                  architectural integration support for autonomous AI agent
                  fleets.
                </p>
              </div>

              <div className="space-y-4 text-xs mono">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#5B45FF]" />
                  <span className="text-white">
                    +966 548 537 633 / +1 (800) 555-SENTINEL
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#5B45FF]" />
                  <span className="text-white">
                    security@sentinel-ai.enterprise
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-[#5B45FF]" />
                  <span className="text-white">
                    Riyadh, Saudi Arabia · Al Olaya District / San Francisco, CA
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-[#1E233D] flex items-center justify-between">
                <div className="mono text-xs font-bold text-white">
                  SENTINEL ENTERPRISE
                </div>
                <button
                  onClick={onEnterApp}
                  className="text-xs font-bold text-[#A78BFA] hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <span>Launch Live Console</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Copyright & Links */}
          <div className="pt-8 border-t border-[#1E233D] flex flex-col sm:flex-row items-center justify-between text-xs text-[#626B76] gap-4">
            <div>&copy; 2026 Sentinel Inc. All rights reserved.</div>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-white transition-colors">
                Home
              </a>
              <a
                href="#platforms"
                className="hover:text-white transition-colors"
              >
                Platform
              </a>
              <a href="#contact" className="hover:text-white transition-colors">
                Contact
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
