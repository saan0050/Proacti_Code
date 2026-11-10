import React from 'react';
import { 
  Check, 
  ArrowRight, 
  TrendingDown, 
  TrendingUp, 
  ShieldCheck, 
  Sparkles,
  GitCommit,
  RotateCcw
} from 'lucide-react';
import { RefactorResult } from '../types';

interface BeforeAfterDiffProps {
  refactorResult: RefactorResult;
  onAcceptPatch: () => void;
  onRejectPatch: () => void;
}

export const BeforeAfterDiff: React.FC<BeforeAfterDiffProps> = ({
  refactorResult,
  onAcceptPatch,
  onRejectPatch,
}) => {
  const { beforeAnalysis, afterAnalysis, explanation, metricsDelta } = refactorResult;

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs space-y-4 p-5">
      {/* Top Banner: Explanation & Metric Delta Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-blue-100 text-blue-700">
              <Sparkles className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-bold text-slate-900">
              ProactiCode Verified Refactoring &amp; Quality Gate Validation
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onRejectPatch}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
            >
              Discard Patch
            </button>
            <button
              onClick={onAcceptPatch}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Accept &amp; Apply Verified Patch</span>
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200">
          <span className="font-semibold text-slate-800">Rationale: </span>
          {explanation}
        </p>

        {/* Delta Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Delta 1: Risk Score */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-[11px] text-slate-500 font-medium">Debt Risk Score</span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-sm line-through text-slate-400 font-mono">
                {beforeAnalysis.riskScore}
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-base font-bold text-emerald-600 font-mono">
                {afterAnalysis.riskScore}
              </span>
            </div>
            <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
              <TrendingDown className="w-3 h-3" />
              <span>{Math.abs(metricsDelta.riskScoreDelta)} pt reduction</span>
            </div>
          </div>

          {/* Delta 2: Cyclomatic Complexity */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-[11px] text-slate-500 font-medium">Cyclomatic Complexity</span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-sm line-through text-slate-400 font-mono">
                {beforeAnalysis.cyclomaticComplexity}
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-base font-bold text-emerald-600 font-mono">
                {afterAnalysis.cyclomaticComplexity}
              </span>
            </div>
            <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
              <TrendingDown className="w-3 h-3" />
              <span>{Math.abs(metricsDelta.cyclomaticDelta)} branches reduced</span>
            </div>
          </div>

          {/* Delta 3: Security & Static Warnings */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-[11px] text-slate-500 font-medium">Static Warnings</span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-sm line-through text-slate-400 font-mono">
                {beforeAnalysis.warnings.length}
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-base font-bold text-emerald-600 font-mono">
                {afterAnalysis.warnings.length}
              </span>
            </div>
            <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
              <ShieldCheck className="w-3 h-3" />
              <span>{Math.abs(metricsDelta.warningsDelta)} warnings fixed</span>
            </div>
          </div>

          {/* Delta 4: Automated Test Pass Rate */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-[11px] text-slate-500 font-medium">Test Pass Rate</span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-sm line-through text-slate-400 font-mono">
                {beforeAnalysis.testPassRate}%
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-base font-bold text-emerald-600 font-mono">
                {afterAnalysis.testPassRate}%
              </span>
            </div>
            <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
              <TrendingUp className="w-3 h-3" />
              <span>100% tests verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Side-by-Side Diff Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-200">
        {/* Left: Original (High Technical Debt) */}
        <div className="border border-slate-200 rounded-lg overflow-hidden flex flex-col">
          <div className="px-3.5 py-2 bg-rose-50 border-b border-rose-200 flex items-center justify-between text-xs font-semibold text-rose-800">
            <span>Original Code (Cursor AI Baseline)</span>
            <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-700 text-[10px] font-mono">
              Risk: {beforeAnalysis.riskScore}/100 • Blocked
            </span>
          </div>
          <pre className="p-3 font-mono text-[11px] leading-5 text-slate-800 bg-slate-50/50 overflow-auto max-h-[420px] whitespace-pre">
            {refactorResult.originalCode}
          </pre>
        </div>

        {/* Right: ProactiCode Refactored (Clean, Low Debt) */}
        <div className="border border-emerald-200 rounded-lg overflow-hidden flex flex-col shadow-xs">
          <div className="px-3.5 py-2 bg-emerald-50 border-b border-emerald-200 flex items-center justify-between text-xs font-semibold text-emerald-800">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>ProactiCode Refactored Patch</span>
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[10px] font-mono">
              Risk: {afterAnalysis.riskScore}/100 • Approved
            </span>
          </div>
          <pre className="p-3 font-mono text-[11px] leading-5 text-slate-800 bg-white overflow-auto max-h-[420px] whitespace-pre">
            {refactorResult.patchedCode}
          </pre>
        </div>
      </div>
    </div>
  );
};
