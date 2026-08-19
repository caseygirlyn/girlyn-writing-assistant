import React, { useState } from 'react';
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
  Info, 
  Check, 
  Type as TypeIcon, 
  Trash2, 
  FileText, 
  GraduationCap, 
  Newspaper, 
  Share2, 
  Feather, 
  PenTool,
  Clock,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { processWriting, ContentFormat, WritingAssistantResult } from './services/geminiService';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const FORMATS: { id: ContentFormat; label: string; icon: React.ElementType; description: string }[] = [
  { id: 'email', label: 'Email', icon: Send, description: 'Client emails, cold outreach, updates' },
  { id: 'general', label: 'General Text', icon: FileText, description: 'Memos, notes, standard prose' },
  { id: 'essay', label: 'Essay / Academic', icon: GraduationCap, description: 'Academic papers, essays, reports' },
  { id: 'article', label: 'Article / Blog', icon: Newspaper, description: 'Blog posts, news pieces, articles' },
  { id: 'cover_letter', label: 'Cover Letter', icon: PenTool, description: 'Job applications & introductory letters' },
  { id: 'social', label: 'Social Post', icon: Share2, description: 'LinkedIn, X/Twitter, announcements' },
];

const TONES = [
  { id: 'professional', label: 'Professional', icon: Briefcase, color: 'text-blue-500' },
  { id: 'friendly', label: 'Friendly', icon: User, color: 'text-green-500' },
  { id: 'persuasive', label: 'Persuasive', icon: Sparkles, color: 'text-purple-500' },
  { id: 'formal', label: 'Formal', icon: TypeIcon, color: 'text-slate-700' },
  { id: 'academic', label: 'Academic', icon: GraduationCap, color: 'text-amber-600' },
  { id: 'creative', label: 'Creative', icon: Feather, color: 'text-pink-500' },
  { id: 'urgent', label: 'Urgent', icon: AlertCircle, color: 'text-red-500' },
];

const STARTER_TEMPLATES: { label: string; format: ContentFormat; text: string; tone: string }[] = [
  {
    label: '📧 Cold Outreach Email',
    format: 'email',
    tone: 'persuasive',
    text: 'Hi John, I saw your recent post about scaling software teams. I wanted to reach out because our platform helps engineering leaders automate workflow bottlenecks by 40%. Would you be open to a quick 10-minute chat this Thursday?'
  },
  {
    label: '📄 Cover Letter Intro',
    format: 'cover_letter',
    tone: 'professional',
    text: 'I am writing to express my strong interest in the Senior Full Stack Engineer position at your company. With over 6 years of experience building modern web applications, I am eager to contribute to your core architecture team.'
  },
  {
    label: '📰 Blog Intro on AI',
    format: 'article',
    tone: 'creative',
    text: 'Artificial intelligence is reshaping how creators brainstorm and write. In this article, we delve into the tapestry of digital tools that empower everyday writers to craft authentic human stories without robotic filler.'
  },
  {
    label: '🎓 Essay Hook on Climate',
    format: 'essay',
    tone: 'academic',
    text: 'Global climate resilience requires a fundamental shift in regional infrastructure policy. Furthermore, economic models must incorporate long-term environmental sustainability into urban design.'
  }
];

export default function App() {
  const [input, setInput] = useState('');
  const [contentType, setContentType] = useState<ContentFormat>('email');
  const [tone, setTone] = useState('professional');
  const [instructions, setInstructions] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<WritingAssistantResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'text' | 'analysis'>('text');

  const handleProcess = async (mode: 'write' | 'rewrite' | 'refine') => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const data = await processWriting(input, mode, contentType, tone, instructions);
      setResult(data);
      setActiveTab('text');
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

  const applyTemplate = (tpl: typeof STARTER_TEMPLATES[0]) => {
    setContentType(tpl.format);
    setTone(tpl.tone);
    setInput(tpl.text);
  };

  const getReadTime = (words: number) => {
    const mins = Math.max(1, Math.ceil(words / 200));
    return `${mins} min read`;
  };

  const isEmailOrLetter = contentType === 'email' || contentType === 'cover_letter';

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-blue-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
              <Feather className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-2">
                GirlynWritingAssistant
              </h1>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Email & General Writing Assistant powered by Gemini
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={clearAll}
              className="p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-lg hover:bg-slate-100"
              title="Clear all"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Input & Settings */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Format Selector */}
          <section className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Format & Type</h2>
              <span className="text-[11px] text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                {FORMATS.find(f => f.id === contentType)?.label}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {FORMATS.map((f) => {
                const Icon = f.icon;
                const isSelected = contentType === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => setContentType(f.id)}
                    className={cn(
                      "flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all duration-200",
                      isSelected 
                        ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-100" 
                        : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                    )}
                  >
                    <Icon className={cn("w-5 h-5 mb-1.5", isSelected ? "text-white" : "text-slate-500")} />
                    <span className="text-xs font-semibold leading-tight">{f.label}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Quick Starters */}
          <section className="space-y-2">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Quick Starters</h2>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {STARTER_TEMPLATES.map((tpl, idx) => (
                <button
                  key={idx}
                  onClick={() => applyTemplate(tpl)}
                  className="whitespace-nowrap px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50 text-xs text-slate-600 font-medium transition-all"
                >
                  {tpl.label}
                </button>
              ))}
            </div>
          </section>

          {/* Text Input Area */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-3.5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Input Content</span>
              <span className="text-xs text-slate-400">{input.length} chars</span>
            </div>
            <div className="p-4">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  contentType === 'email'
                    ? "Paste your email draft or describe key points..."
                    : contentType === 'essay'
                    ? "Paste your essay draft, thesis statement, or outline..."
                    : contentType === 'article'
                    ? "Paste your article draft or topic notes..."
                    : contentType === 'cover_letter'
                    ? "Paste job requirements or key experience details..."
                    : "Paste or write any text you want to refine, humanize, or rewrite..."
                }
                className="w-full h-56 resize-none border-none focus:ring-0 text-slate-800 placeholder:text-slate-300 text-base leading-relaxed"
              />
            </div>
          </section>

          {/* Tone Selector */}
          <section className="space-y-3">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Desired Tone</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {TONES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTone(t.id)}
                  className={cn(
                    "flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl border transition-all text-xs font-medium",
                    tone === t.id 
                      ? "bg-white border-blue-500 shadow-sm text-blue-700 ring-2 ring-blue-100 font-semibold" 
                      : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                  )}
                >
                  <t.icon className={cn("w-3.5 h-3.5", tone === t.id ? "text-blue-600" : t.color)} />
                  {t.label}
                </button>
              ))}
            </div>
          </section>

          {/* Additional Context Input */}
          <section className="space-y-2">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Additional Instructions</h2>
            <input
              type="text"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Keep under 200 words, emphasize technical skills..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-xs"
            />
          </section>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2.5 pt-2">
            <button
              onClick={() => handleProcess('rewrite')}
              disabled={loading || !input.trim()}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-300 disabled:to-slate-300 text-white rounded-xl font-semibold shadow-md shadow-blue-200 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              {loading ? <RefreshCw className="animate-spin w-5 h-5" /> : <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />}
              {loading ? 'Processing...' : 'Refine & Humanize'}
            </button>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => handleProcess('write')}
                disabled={loading || !input.trim()}
                className="py-2.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <TypeIcon className="w-4 h-4 text-slate-400" />
                Write New
              </button>
              <button
                onClick={() => handleProcess('refine')}
                disabled={loading || !input.trim()}
                className="py-2.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-slate-400" />
                Fix Grammar
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Output & Humanize Analysis */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {!result && !loading ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-full min-h-[450px] flex flex-col items-center justify-center text-center p-8 bg-white rounded-3xl border border-dashed border-slate-200"
              >
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
                  <Feather className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold text-slate-800 mb-2">Ready to Transform Your Writing</h2>
                <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6">
                  Select a format on the left, paste your text or prompt, and I'll craft polished, authentic, humanized content.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
                  <span className="px-2.5 py-1 bg-slate-100 rounded-md">Emails</span>
                  <span className="px-2.5 py-1 bg-slate-100 rounded-md">Essays</span>
                  <span className="px-2.5 py-1 bg-slate-100 rounded-md">Articles</span>
                  <span className="px-2.5 py-1 bg-slate-100 rounded-md">Cover Letters</span>
                  <span className="px-2.5 py-1 bg-slate-100 rounded-md">Social Posts</span>
                </div>
              </motion.div>
            ) : loading ? (
              <div className="h-full min-h-[450px] flex flex-col items-center justify-center p-8 space-y-6 bg-white rounded-3xl border border-slate-200">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
                  <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-600 w-6 h-6" />
                </div>
                <div className="text-center space-y-1">
                  <h3 className="text-base font-bold text-slate-800">Refining & Humanizing...</h3>
                  <p className="text-slate-500 text-xs">
                    Crafting {tone} {FORMATS.find(f => f.id === contentType)?.label.toLowerCase()}
                  </p>
                </div>
              </div>
            ) : result && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                {/* Tabs */}
                <div className="flex items-center justify-between bg-slate-100 p-1 rounded-2xl">
                  <div className="flex">
                    <button
                      onClick={() => setActiveTab('text')}
                      className={cn(
                        "px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer",
                        activeTab === 'text' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                      )}
                    >
                      Improved Content
                    </button>
                    <button
                      onClick={() => setActiveTab('analysis')}
                      className={cn(
                        "px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer",
                        activeTab === 'analysis' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                      )}
                    >
                      AI Check & Humanizer
                      {(() => {
                        const aiScore = Math.max(0, Math.min(100, Math.round(result.aiLikelihoodScore || 0)));
                        const humanScore = 100 - aiScore;
                        return (
                          <span className={cn(
                            "px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase",
                            humanScore >= 65 ? "bg-emerald-100 text-emerald-700" : humanScore >= 40 ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"
                          )}>
                            {humanScore}% Authentic
                          </span>
                        );
                      })()}
                    </button>
                  </div>

                  {/* Metadata Stats */}
                  <div className="hidden sm:flex items-center gap-3 px-3 text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <BookOpen size={13} className="text-slate-400" />
                      {result.wordCount || 0} words
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={13} className="text-slate-400" />
                      {getReadTime(result.wordCount || 0)}
                    </span>
                  </div>
                </div>

                {activeTab === 'text' ? (
                  <div className="space-y-5">
                    {/* Headlines or Subject Lines */}
                    {result.headlinesOrSubjects && result.headlinesOrSubjects.length > 0 && (
                      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                          <Info size={14} className="text-blue-500" />
                          {isEmailOrLetter ? "Subject Line Suggestions" : "Headline & Title Suggestions"}
                        </h4>
                        <div className="space-y-2">
                          {result.headlinesOrSubjects.map((s, i) => (
                            <div 
                              key={i} 
                              onClick={() => copyToClipboard(s)}
                              className="group flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all cursor-pointer"
                            >
                              <span className="text-slate-800 text-xs font-medium">{s}</span>
                              <Copy className="w-3.5 h-3.5 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Main Polished Body */}
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                          Polished {FORMATS.find(f => f.id === contentType)?.label} Draft
                        </span>
                        <button 
                          onClick={() => copyToClipboard(result.improvedText)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-slate-300 text-xs font-semibold text-slate-700 transition-all cursor-pointer"
                        >
                          {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                          {copied ? 'Copied' : 'Copy Text'}
                        </button>
                      </div>
                      <div className="p-8">
                        <div className="prose prose-slate max-w-none prose-p:leading-relaxed prose-p:text-slate-800 text-base">
                          <ReactMarkdown>{result.improvedText}</ReactMarkdown>
                        </div>
                      </div>
                    </div>

                    {/* Summary of Changes & Pro Tips */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-blue-50/50 rounded-2xl p-4 border border-blue-100">
                        <h4 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1.5">Changes Made</h4>
                        <p className="text-xs text-blue-900 leading-relaxed">{result.summaryOfChanges}</p>
                      </div>
                      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Writing Tip</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">{result.suggestions}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* AI & Human Authenticity Score Card */}
                    {(() => {
                      const aiScore = Math.max(0, Math.min(100, Math.round(result.aiLikelihoodScore || 0)));
                      const humanScore = 100 - aiScore;
                      const radius = 44;
                      const circumference = 2 * Math.PI * radius;
                      const strokeDashoffset = circumference - (circumference * humanScore) / 100;
                      const isHighAuthenticity = humanScore >= 65;
                      const isModerate = humanScore >= 40 && humanScore < 65;

                      return (
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 text-center">
                          {/* Radial Score Gauge */}
                          <div className="inline-flex items-center justify-center w-28 h-28 mb-3 relative">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 110 110">
                              {/* Background Track */}
                              <circle
                                cx="55"
                                cy="55"
                                r={radius}
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="9"
                                className="text-slate-100"
                              />
                              {/* Animated Progress Arc */}
                              <circle
                                cx="55"
                                cy="55"
                                r={radius}
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="9"
                                strokeLinecap="round"
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                                className={cn(
                                  "transition-all duration-1000",
                                  isHighAuthenticity 
                                    ? "text-emerald-500" 
                                    : isModerate 
                                    ? "text-amber-500" 
                                    : "text-rose-500"
                                )}
                              />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <span className="text-2xl font-black text-slate-900 leading-none">
                                {humanScore}%
                              </span>
                              <span className={cn(
                                "text-[9px] font-extrabold uppercase tracking-wider mt-0.5",
                                isHighAuthenticity 
                                  ? "text-emerald-600" 
                                  : isModerate 
                                  ? "text-amber-600" 
                                  : "text-rose-600"
                              )}>
                                Authentic
                              </span>
                            </div>
                          </div>

                          {/* Tone Status Badge & Title */}
                          <div className="space-y-1.5 max-w-md mx-auto">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-1">
                              {isHighAuthenticity ? (
                                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-3 py-0.5 rounded-full flex items-center gap-1">
                                  <CheckCircle2 size={12} className="text-emerald-600" />
                                  Authentic & Humanized Tone
                                </span>
                              ) : isModerate ? (
                                <span className="bg-amber-50 text-amber-700 border border-amber-200/80 px-3 py-0.5 rounded-full flex items-center gap-1">
                                  <AlertCircle size={12} className="text-amber-600" />
                                  Moderate Tone Balance
                                </span>
                              ) : (
                                <span className="bg-rose-50 text-rose-700 border border-rose-200/80 px-3 py-0.5 rounded-full flex items-center gap-1">
                                  <AlertCircle size={12} className="text-rose-600" />
                                  High AI Clichés Detected
                                </span>
                              )}
                            </div>

                            <h3 className="text-base font-bold text-slate-900">
                              {isHighAuthenticity
                                ? `Natural Human Flow (${humanScore}% Authenticity)`
                                : isModerate
                                ? `Mixed Draft (${humanScore}% Human / ${aiScore}% AI Clichés)`
                                : `Formulaic Draft (${aiScore}% AI Cliché Probability)`}
                            </h3>

                            <p className="text-slate-500 text-xs leading-relaxed">
                              {isHighAuthenticity
                                ? "Your original draft demonstrated authentic sentence rhythm, vocabulary variety, and minimal corporate clichés."
                                : isModerate
                                ? "Several predictable transitions or formulaic phrases were identified in your draft and humanized."
                                : "Your original draft contained recurring AI templates, buzzwords, or predictable sentence structures."}
                            </p>
                          </div>

                          {/* Dual Comparative Breakdown Meters */}
                          <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                            <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-100">
                              <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                                <span className="text-slate-700 flex items-center gap-1.5 font-semibold">
                                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                                  Human Authenticity
                                </span>
                                <span className="text-emerald-700 font-bold">{humanScore}%</span>
                              </div>
                              <div className="w-full bg-slate-200/80 h-2 rounded-full overflow-hidden">
                                <div 
                                  className="bg-emerald-500 h-full rounded-full transition-all duration-700" 
                                  style={{ width: `${humanScore}%` }}
                                />
                              </div>
                            </div>

                            <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-100">
                              <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                                <span className="text-slate-700 flex items-center gap-1.5 font-semibold">
                                  <span className="w-2 h-2 rounded-full bg-rose-500 inline-block"></span>
                                  AI Cliché Likelihood
                                </span>
                                <span className="text-rose-700 font-bold">{aiScore}%</span>
                              </div>
                              <div className="w-full bg-slate-200/80 h-2 rounded-full overflow-hidden">
                                <div 
                                  className="bg-rose-500 h-full rounded-full transition-all duration-700" 
                                  style={{ width: `${aiScore}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Flagged Phrases */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">
                        Flagged Sections & Human Alternatives
                      </h4>
                      {result.flaggedSections.length === 0 ? (
                        <div className="bg-green-50 border border-green-100 rounded-2xl p-6 text-center">
                          <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                          <p className="text-green-800 font-semibold text-sm">No generic clichés detected!</p>
                          <p className="text-green-600 text-xs mt-1">Your text already sounds natural and authentic.</p>
                        </div>
                      ) : (
                        result.flaggedSections.map((f, i) => (
                          <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-3">
                            <div className="flex items-start gap-2.5">
                              <div className="mt-0.5 p-1 bg-red-50 rounded-md">
                                <AlertCircle className="w-4 h-4 text-red-500" />
                              </div>
                              <div>
                                <p className="text-[11px] font-bold text-red-500 uppercase tracking-wider">Overused / Robotic Phrase</p>
                                <p className="text-slate-800 text-xs font-medium italic mt-0.5">"{f.original}"</p>
                              </div>
                            </div>
                            <div className="pl-8 space-y-2">
                              <p className="text-xs text-slate-500">{f.reason}</p>
                              <div className="p-3 bg-green-50/80 rounded-xl border border-green-100 flex items-center justify-between">
                                <p className="text-xs text-green-900 font-semibold">Try: "{f.suggestion}"</p>
                                <button 
                                  onClick={() => copyToClipboard(f.suggestion)}
                                  className="p-1 hover:bg-green-100 rounded-md transition-colors"
                                  title="Copy suggestion"
                                >
                                  <Copy size={13} className="text-green-700" />
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
      <footer className="max-w-6xl mx-auto px-4 py-8 border-t border-slate-200 mt-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <Sparkles size={14} className="text-blue-500" />
            <span className="font-medium text-slate-600">Girlyn Writing Assistant</span>
            <span>•</span>
            <span>Powered by Gemini 3.1 Pro</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span>Emails</span>
            <span>•</span>
            <span>Essays</span>
            <span>•</span>
            <span>Articles</span>
            <span>•</span>
            <span>Cover Letters</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
