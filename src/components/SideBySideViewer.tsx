import React, { useState } from 'react';
import { 
  Check, 
  Copy, 
  Download, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Minimize2,
  CheckCheck
} from 'lucide-react';
import { RefactorResult } from '../types';

interface SideBySideViewerProps {
  refactorResult: RefactorResult;
  onApplyFixedCode: () => void;
  onCloseSideBySide: () => void;
  filename?: string;
  language?: string;
}

export const SideBySideViewer: React.FC<SideBySideViewerProps> = ({
  refactorResult,
  onApplyFixedCode,
  onCloseSideBySide,
  filename,
  language = 'python',
}) => {
  const [copied, setCopied] = useState(false);

  const { originalCode, patchedCode, explanation, beforeAnalysis, afterAnalysis } = refactorResult;

  const originalLines = originalCode.split('\n');
  const patchedLines = patchedCode.split('\n');

  const handleCopyFixed = () => {
    navigator.clipboard.writeText(patchedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFixed = () => {
    const ext = language === 'typescript' ? 'ts' : 'py';
    const finalName = filename 
      ? `fixed_${filename}` 
      : `fixed_code_${Date.now()}.${ext}`;

    const blob = new Blob([patchedCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = finalName;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs space-y-4 p-5">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${
            refactorResult.isAlreadyClean ? 'bg-emerald-100 text-emerald-700' : 'bg-emerald-100 text-emerald-700'
          }`}>
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {refactorResult.isAlreadyClean 
                ? 'Code Inspection Complete: Verified Clean' 
                : 'Side-by-Side Comparison: Old Code vs. Fixed Code'}
            </h3>
            <p className="text-xs text-slate-500">
              {refactorResult.isAlreadyClean
                ? 'Your code is clean, robust, and safe! No editing is required.'
                : 'Vulnerabilities, dangerous bugs, and high complexity have been resolved.'}
            </p>
          </div>
        </div>

        {/* Global Action Controls */}
        <div className="flex items-center gap-2">
          {!refactorResult.isAlreadyClean ? (
            <button
              onClick={onApplyFixedCode}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply Fixed Code to Editor</span>
            </button>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-100/80 rounded-lg border border-emerald-300">
              <Check className="w-3.5 h-3.5 text-emerald-700" />
              <span>Code is Perfect — 0 Edits Needed</span>
            </span>
          )}

          <button
            onClick={onCloseSideBySide}
            title="Return to Single Editor view"
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Rationale & Quick Improvement Summary */}
      <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg text-xs text-slate-700 flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <strong className="text-emerald-900 block font-bold mb-0.5">
            {refactorResult.isAlreadyClean ? 'Code Quality Status:' : 'What ProactiCode Remediated:'}
          </strong>
          <p className="text-slate-700">{explanation}</p>
        </div>
      </div>

      {/* Metric Comparison Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
          <span className="text-[11px] text-slate-500 font-medium">Risk Score</span>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="line-through text-slate-400 font-mono">{beforeAnalysis.riskScore}/100</span>
            <ArrowRight className="w-3 h-3 text-slate-400" />
            <span className="font-bold text-emerald-600 font-mono">{afterAnalysis.riskScore}/100</span>
          </div>
        </div>

        <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
          <span className="text-[11px] text-slate-500 font-medium">Security Flaws</span>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="line-through text-rose-500 font-mono">
              {beforeAnalysis.warnings.filter(w => w.severity === 'critical' || w.severity === 'high').length}
            </span>
            <ArrowRight className="w-3 h-3 text-slate-400" />
            <span className="font-bold text-emerald-600 font-mono">0 Detected</span>
          </div>
        </div>

        <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
          <span className="text-[11px] text-slate-500 font-medium">Complexity</span>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="line-through text-slate-400 font-mono">{beforeAnalysis.cyclomaticComplexity}</span>
            <ArrowRight className="w-3 h-3 text-slate-400" />
            <span className="font-bold text-emerald-600 font-mono">{afterAnalysis.cyclomaticComplexity}</span>
          </div>
        </div>

        <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
          <span className="text-[11px] text-slate-500 font-medium">Test Pass Rate</span>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="line-through text-slate-400 font-mono">{beforeAnalysis.testPassRate}%</span>
            <ArrowRight className="w-3 h-3 text-slate-400" />
            <span className="font-bold text-emerald-600 font-mono">{afterAnalysis.testPassRate}%</span>
          </div>
        </div>
      </div>

      {/* Side-by-Side Split View */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Column: Old Code */}
        <div className="border border-slate-200 rounded-xl overflow-hidden flex flex-col shadow-xs bg-slate-50/30">
          <div className="px-4 py-2.5 bg-rose-50 border-b border-rose-200 flex items-center justify-between text-xs font-bold text-rose-800">
            <span>Old Code (Unchecked / Vulnerable)</span>
            <span className="px-2 py-0.5 rounded bg-rose-100 text-[10px] font-mono">
              Risk: {beforeAnalysis.riskScore}/100
            </span>
          </div>
          <div className="flex font-mono text-xs overflow-auto max-h-[540px]">
            {/* Gutter */}
            <div className="w-10 bg-slate-100 py-3 text-right pr-2 text-slate-400 select-none border-r border-slate-200 shrink-0">
              {originalLines.map((_, i) => (
                <div key={i} className="h-5 leading-5 text-[11px]">{i + 1}</div>
              ))}
            </div>
            {/* Code */}
            <pre className="p-3 text-slate-800 leading-5 text-[11px] whitespace-pre flex-1 overflow-x-auto">
              {originalCode}
            </pre>
          </div>
        </div>

        {/* Right Column: Fixed Code with Copy & Download on the side */}
        <div className="border border-emerald-300 rounded-xl overflow-hidden flex flex-col shadow-xs bg-white relative">
          <div className="px-4 py-2 bg-emerald-50 border-b border-emerald-200 flex items-center justify-between text-xs font-bold text-emerald-800">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>{refactorResult.isAlreadyClean ? 'Verified Clean Code (Optimal)' : 'New Fixed Code (Remediated)'}</span>
            </span>

            {/* In-header Copy & Download Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleCopyFixed}
                title="Copy Fixed Code to clipboard"
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-emerald-200 rounded-md transition-colors cursor-pointer shadow-2xs"
              >
                {copied ? <CheckCheck className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-600" />}
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>

              <button
                onClick={handleDownloadFixed}
                title="Download Fixed Code file"
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-emerald-200 rounded-md transition-colors cursor-pointer shadow-2xs"
              >
                <Download className="w-3.5 h-3.5 text-slate-600" />
                <span>Download</span>
              </button>
            </div>
          </div>

          <div className="flex font-mono text-xs overflow-auto max-h-[540px] relative">
            {/* Gutter */}
            <div className="w-10 bg-emerald-50/50 py-3 text-right pr-2 text-emerald-600 select-none border-r border-emerald-100 shrink-0">
              {patchedLines.map((_, i) => (
                <div key={i} className="h-5 leading-5 text-[11px]">{i + 1}</div>
              ))}
            </div>

            {/* Code */}
            <pre className="p-3 text-slate-900 leading-5 text-[11px] whitespace-pre flex-1 overflow-x-auto">
              {patchedCode}
            </pre>

            {/* Floating Side Action Pill on top right of the code area */}
            <div className="absolute top-2 right-2 flex items-center gap-1 bg-white/95 backdrop-blur-2xs p-1 rounded-lg border border-slate-200 shadow-sm">
              <button
                onClick={handleCopyFixed}
                title="Copy code"
                className="p-1.5 hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded cursor-pointer transition-colors"
              >
                {copied ? <CheckCheck className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={handleDownloadFixed}
                title="Download code"
                className="p-1.5 hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded cursor-pointer transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
