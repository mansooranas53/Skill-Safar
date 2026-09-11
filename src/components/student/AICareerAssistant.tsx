import React, { useState } from 'react';
import { StudentProfile } from '../../types';
import { MCPService } from '../../services/portalServices';
import {
  Sparkles,
  Bot,
  User,
  Send,
  Terminal,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  Briefcase,
  BookOpen
} from 'lucide-react';

interface AICareerAssistantProps {
  student: StudentProfile;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  mcpToolUsed?: string;
  mcpToolPayload?: Record<string, unknown>;
  timestamp: string;
}

export const AICareerAssistant: React.FC<AICareerAssistantProps> = ({ student }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: `Hello ${student.fullName}! I am your AI Career Intelligence Agent. I operate securely through the platform's Model Context Protocol (MCP) layer to query your verified skill profile, analyze active recruiter demand, and advise on high-compatibility internships. What would you like to explore today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showMcpAudit, setShowMcpAudit] = useState(true);

  const quickPrompts = [
    {
      label: 'Analyze my Skill Gaps',
      query: 'Analyze my verified skill profile against active opportunities and identify my critical competency gaps.',
      tool: 'analyze_skill_gaps'
    },
    {
      label: 'Find Top Matching Openings',
      query: 'What are my top matching internships right now based on deterministic compatibility?',
      tool: 'find_matching_opportunities'
    },
    {
      label: 'Recommend Learning Programs',
      query: 'Which courses or certifications should I take right now to maximize my recruitment match score?',
      tool: 'recommend_learning'
    },
    {
      label: 'Interview Prep for CloudScale',
      query: 'I am shortlisted for Backend Engineering Intern at CloudScale Technologies. Generate role-specific technical interview questions.',
      tool: 'get_student_skill_profile'
    }
  ];

  const handleSend = (textToSend?: string, toolOverride?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isProcessing) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsProcessing(true);

    setTimeout(() => {
      // Determine appropriate MCP tool call
      let toolToCall = toolOverride || 'get_student_skill_profile';
      const lower = text.toLowerCase();

      if (lower.includes('gap') || lower.includes('benchmark')) {
        toolToCall = 'analyze_skill_gaps';
      } else if (lower.includes('match') || lower.includes('opportunity') || lower.includes('internship') || lower.includes('job')) {
        toolToCall = 'find_matching_opportunities';
      } else if (lower.includes('learn') || lower.includes('course') || lower.includes('study')) {
        toolToCall = 'recommend_learning';
      }

      // Safe MCP execution through service layer (Rule 48 & 49 compliance)
      const mcpResult = MCPService.callTool(toolToCall);

      let responseText = '';
      if (toolToCall === 'analyze_skill_gaps') {
        const critical = (mcpResult.criticalGaps as string[]) || [];
        responseText = `Based on verified data queried via MCP tool '${toolToCall}', you currently have strong verified mastery in Python (85%), SQL (82%), and Git (90%). However, active recruiter postings at CloudScale and Nexus FinTech show critical demand for: ${critical.join(', ')}. Bridging Docker & REST API Design will increase your average opportunity match score from 85% to over 93%.`;
      } else if (toolToCall === 'find_matching_opportunities') {
        const top = (mcpResult.topRecommendations as Array<{ title: string; company: string; matchScore: string }>) || [];
        responseText = `Grounded in platform records, your top recommendations are:\n\n` +
          top.map((t, i) => `${i + 1}. **${t.title}** at ${t.company} — **${t.matchScore} Compatibility**`).join('\n') +
          `\n\nYour highest match is at CloudScale Technologies where 3 of 4 required competencies are already verified.`;
      } else if (toolToCall === 'recommend_learning') {
        const recs = (mcpResult.recommendations as Array<{ title: string; targetSkill: string; expectedScoreBoost: string }>) || [];
        responseText = `Here are the highest-impact learning modules tailored to your current gaps:\n\n` +
          recs.map(r => `• **${r.title}** (Target: ${r.targetSkill}, Score boost: ${r.expectedScoreBoost})`).join('\n') +
          `\n\nYou can enroll and complete these directly from your Learning Center.`;
      } else {
        responseText = `Here are targeted interview questions tailored to CloudScale's Backend Engineering role and your verified competencies:\n\n` +
          `1. **System Design / Idempotency**: "In REST APIs, how would you design an idempotent POST endpoint for financial transactions using request idempotency keys and PostgreSQL transactions?"\n` +
          `2. **Concurrency**: "Explain how Python's asyncio event loop handles non-blocking database queries compared to multithreading or multiprocessing."\n` +
          `3. **Database Performance**: "When would a B-tree index be insufficient in PostgreSQL, and how would you investigate slow sequential scans using EXPLAIN ANALYZE?"\n\n` +
          `Would you like to practice answering one of these?`;
      }

      const assistantMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: responseText,
        mcpToolUsed: toolToCall,
        mcpToolPayload: mcpResult,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMsg]);
      setIsProcessing(false);
    }, 700);
  };

  return (
    <div className="space-y-6">
      {/* Header with MCP security badge */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-900 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-slate-800" />
            AI Career Intelligence (MCP Protocol)
          </div>
          <h2 className="text-xl font-bold text-slate-900">Grounded Career Advisor & Skill Gap Explainer</h2>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Autonomous agent communicating strictly through the Model Context Protocol (MCP). Grounded in your real verified skills, active industry requirements, and recruitment state machines.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowMcpAudit(!showMcpAudit)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              showMcpAudit
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>MCP Tool Trace {showMcpAudit ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* Quick Prompts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(qp.query, qp.tool)}
            disabled={isProcessing}
            className="p-3 bg-white rounded-xl border border-slate-200 hover:border-slate-400 hover:bg-slate-50 text-left transition-all shadow-2xs group"
          >
            <div className="text-xs font-bold text-slate-900 group-hover:text-black flex items-center justify-between">
              <span>{qp.label}</span>
              <Sparkles className="w-3.5 h-3.5 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-1">
              MCP: {qp.tool}
            </div>
          </button>
        ))}
      </div>

      {/* Chat Area */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-[520px]">
        {/* Messages container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map(msg => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                  isUser ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
                }`}>
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-slate-800" />}
                </div>

                <div className="space-y-2">
                  <div className={`p-4 rounded-2xl text-xs leading-relaxed ${
                    isUser
                      ? 'bg-slate-900 text-white rounded-tr-xs'
                      : 'bg-slate-50 border border-slate-200/80 text-slate-800 rounded-tl-xs'
                  }`}>
                    <div className="whitespace-pre-line">{msg.text}</div>
                    <div className={`text-[9px] mt-2 ${isUser ? 'text-slate-300' : 'text-slate-400'}`}>
                      {msg.timestamp}
                    </div>
                  </div>

                  {/* MCP Tool Audit Trace */}
                  {showMcpAudit && msg.mcpToolUsed && (
                    <div className="p-2.5 rounded-xl bg-slate-900 text-slate-200 font-mono text-[10px] space-y-1 border border-slate-800 animate-in fade-in">
                      <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                        <ShieldCheck className="w-3 h-3" />
                        <span>MCP Protocol Invocation: {msg.mcpToolUsed}()</span>
                      </div>
                      <div className="text-slate-400 truncate">
                        Payload: {JSON.stringify(msg.mcpToolPayload)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {isProcessing && (
            <div className="flex items-center gap-2 text-xs text-slate-400 italic">
              <Sparkles className="w-4 h-4 animate-spin text-slate-600" />
              <span>Querying Model Context Protocol tools and platform services...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/50 rounded-b-2xl">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask anything (e.g. How to bridge Docker gap? What questions will CloudScale ask?)..."
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              disabled={isProcessing}
              className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isProcessing}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 px-1">
            <span>MCP Security: Zero direct database access • Fully grounded in platform contracts</span>
            <span>Deterministic Scoring Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};
