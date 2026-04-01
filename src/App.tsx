import React, { useState, useRef } from 'react';
import { 
  Send, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Sparkles, 
  User, 
  Briefcase, 
  MessageSquare,
  ChevronRight,
  Info,
  Check,
  Type as TypeIcon,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { processEmail, EmailAssistantResult } from './services/geminiService';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const TONES = [
  { id: 'professional', label: 'Professional', icon: Briefcase, color: 'text-blue-500' },
  { id: 'friendly', label: 'Friendly', icon: User, color: 'text-green-500' },
  { id: 'persuasive', label: 'Persuasive', icon: Sparkles, color: 'text-purple-500' },
  { id: 'formal', label: 'Formal', icon: TypeIcon, color: 'text-slate-700' },
  { id: 'urgent', label: 'Urgent', icon: AlertCircle, color: 'text-red-500' },
];

export default function App() {
  const [input, setInput] = useState('');
  const [tone, setTone] = useState('professional');
  const [instructions, setInstructions] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EmailAssistantResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'email' | 'analysis'>('email');

  const handleProcess = async (mode: 'write' | 'rewrite' | 'refine') => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const data = await processEmail(input, mode, tone, instructions);
      setResult(data);
      setActiveTab('email');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearAll = () => {
    setInput('');
    setResult(null);
    setInstructions('');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-blue-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-bottom border-slate-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Send className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-semibold tracking-tight">EmailAssistant</h1>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={clearAll}
              className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
              title="Clear all"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Input & Controls */}
        <div className="lg:col-span-5 space-y-6">
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-bottom border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">Input</span>
              <span className="text-xs text-slate-400">{input.length} characters</span>
            </div>
            <div className="p-4">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste your draft or describe the email you want to write..."
                className="w-full h-64 resize-none border-none focus:ring-0 text-slate-700 placeholder:text-slate-300 text-lg leading-relaxed"
              />
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider px-1">Tone & Style</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {TONES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTone(t.id)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2.5 rounded-xl border transition-all duration-200 text-sm font-medium",
                    tone === t.id 
                      ? "bg-white border-blue-200 shadow-sm ring-1 ring-blue-100" 
                      : "bg-transparent border-slate-200 text-slate-500 hover:border-slate-300"
                  )}
                >
                  <t.icon className={cn("w-4 h-4", tone === t.id ? t.color : "text-slate-400")} />
                  {t.label}
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider px-1">Additional Context</h3>
            <input
              type="text"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Mention the deadline, keep it under 100 words..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm"
            />
          </section>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => handleProcess('rewrite')}
              disabled={loading || !input.trim()}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-2xl font-semibold shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 group"
            >
              {loading ? <RefreshCw className="animate-spin w-5 h-5" /> : <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />}
              {loading ? 'Processing...' : 'Refine & Humanize'}
            </button>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleProcess('write')}
                disabled={loading || !input.trim()}
                className="py-3 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
              >
                <TypeIcon className="w-4 h-4 text-slate-400" />
                Write New
              </button>
              <button
                onClick={() => handleProcess('refine')}
                disabled={loading || !input.trim()}
                className="py-3 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-slate-400" />
                Fix Grammar
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Result & Analysis */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {!result && !loading ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-full flex flex-col items-center justify-center text-center p-8 bg-white rounded-3xl border border-dashed border-slate-200"
              >
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                  <MessageSquare className="text-slate-300 w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Ready to assist</h2>
                <p className="text-slate-500 max-w-xs mx-auto">
                  Paste your draft on the left and I'll help you craft the perfect message.
                </p>
              </motion.div>
            ) : loading ? (
              <div className="h-full flex flex-col items-center justify-center p-8 space-y-6">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
                  <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-600 w-6 h-6" />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-slate-800">Refining your email...</h3>
                  <p className="text-slate-500 text-sm">Applying {tone} tone and humanizing content</p>
                </div>
              </div>
            ) : result && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                {/* Tabs */}
                <div className="flex p-1 bg-slate-100 rounded-2xl w-fit">
                  <button
                    onClick={() => setActiveTab('email')}
                    className={cn(
                      "px-6 py-2 rounded-xl text-sm font-semibold transition-all",
                      activeTab === 'email' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                    )}
                  >
                    Improved Email
                  </button>
                  <button
                    onClick={() => setActiveTab('analysis')}
                    className={cn(
                      "px-6 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2",
                      activeTab === 'analysis' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                    )}
                  >
                    AI Check
                    <span className={cn(
                      "px-1.5 py-0.5 rounded-md text-[10px] font-bold uppercase",
                      result.aiLikelihoodScore > 50 ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
                    )}>
                      {result.aiLikelihoodScore}%
                    </span>
                  </button>
                </div>

                {activeTab === 'email' ? (
                  <div className="space-y-6">
                    {/* Subject Lines */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Info size={14} /> Subject Line Suggestions
                      </h4>
                      <div className="space-y-2">
                        {result.subjectLines.map((s, i) => (
                          <div 
                            key={i} 
                            onClick={() => copyToClipboard(s)}
                            className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all cursor-pointer"
                          >
                            <span className="text-slate-700 font-medium">{s}</span>
                            <Copy className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Main Email Body */}
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                      <div className="p-4 border-bottom border-slate-100 flex items-center justify-between bg-slate-50/50">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Final Draft</span>
                        <button 
                          onClick={() => copyToClipboard(result.improvedEmail)}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-slate-300 text-xs font-semibold text-slate-600 transition-all"
                        >
                          {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                          {copied ? 'Copied' : 'Copy Email'}
                        </button>
                      </div>
                      <div className="p-8">
                        <div className="prose prose-slate max-w-none prose-p:leading-relaxed prose-p:text-slate-700 text-lg">
                          <ReactMarkdown>{result.improvedEmail}</ReactMarkdown>
                        </div>
                      </div>
                    </div>

                    {/* Summary & Suggestions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-blue-50/50 rounded-2xl p-5 border border-blue-100">
                        <h4 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">Changes Made</h4>
                        <p className="text-sm text-blue-800 leading-relaxed">{result.summaryOfChanges}</p>
                      </div>
                      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Pro Tip</h4>
                        <p className="text-sm text-slate-600 leading-relaxed">{result.suggestions}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* AI Likelihood Score */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 text-center">
                      <div className="inline-flex items-center justify-center w-24 h-24 rounded-full border-8 border-slate-50 mb-4 relative">
                        <svg className="w-full h-full -rotate-90">
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="8"
                            className="text-slate-100"
                          />
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="8"
                            strokeDasharray={251.2}
                            strokeDashoffset={251.2 - (251.2 * result.aiLikelihoodScore) / 100}
                            className={cn(
                              "transition-all duration-1000",
                              result.aiLikelihoodScore > 50 ? "text-red-500" : "text-green-500"
                            )}
                          />
                        </svg>
                        <span className="absolute text-xl font-bold">{result.aiLikelihoodScore}%</span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 mb-2">
                        {result.aiLikelihoodScore > 50 ? 'Likely AI-Generated' : 'Sounds Human'}
                      </h3>
                      <p className="text-slate-500 text-sm max-w-sm mx-auto">
                        This score represents how generic or template-like your original draft appeared.
                      </p>
                    </div>

                    {/* Flagged Sections */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest px-1">Flagged for Humanization</h4>
                      {result.flaggedSections.length === 0 ? (
                        <div className="bg-green-50 border border-green-100 rounded-2xl p-6 text-center">
                          <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                          <p className="text-green-800 font-medium">No generic clichés detected!</p>
                        </div>
                      ) : (
                        result.flaggedSections.map((f, i) => (
                          <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
                            <div className="flex items-start gap-3">
                              <div className="mt-1 p-1 bg-red-50 rounded-md">
                                <AlertCircle className="w-4 h-4 text-red-500" />
                              </div>
                              <div>
                                <p className="text-xs font-bold text-red-500 uppercase tracking-wider mb-1">Generic Phrase</p>
                                <p className="text-slate-800 font-medium italic">"{f.original}"</p>
                              </div>
                            </div>
                            <div className="pl-10 space-y-3">
                              <p className="text-sm text-slate-500">{f.reason}</p>
                              <div className="p-3 bg-green-50 rounded-xl border border-green-100 flex items-center justify-between">
                                <p className="text-sm text-green-800 font-medium">Try: "{f.suggestion}"</p>
                                <button 
                                  onClick={() => copyToClipboard(f.suggestion)}
                                  className="p-1.5 hover:bg-green-100 rounded-lg transition-colors"
                                >
                                  <Copy size={14} className="text-green-600" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-4 py-12 border-t border-slate-200 mt-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-slate-400">
            <Sparkles size={16} />
            <span className="text-sm font-medium">Powered by Gemini 3.1 Pro</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-slate-500 hover:text-slate-800 transition-colors">Privacy Policy</a>
            <a href="#" className="text-sm text-slate-500 hover:text-slate-800 transition-colors">Terms of Service</a>
            <a href="#" className="text-sm text-slate-500 hover:text-slate-800 transition-colors">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
