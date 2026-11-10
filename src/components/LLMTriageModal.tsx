import React from 'react';
import { 
  Sparkles, 
  ShieldAlert, 
  ShieldCheck, 
  CheckCircle, 
  Code2, 
  Wrench, 
  ExternalLink,
  Cpu
} from 'lucide-react';
import { StaticWarning, LLMTriageResult } from '../types';

interface LLMTriageModalProps {
  warning: StaticWarning | null;
  triageResult: LLMTriageResult | null;
  isLoading: boolean;
  onClose: () => void;
  onApplyPatch: (suggestion: string) => void;
}

export const LLMTriageModal: React.FC<LLMTriageModalProps> = ({
  warning,
  triageResult,
  isLoading,
  onClose,
  onApplyPatch,
}) => {
  if (!warning) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-2xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header: matches research paper Figure on Page 8 */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight">
                LLM Triage Model (Research Paper Architecture)
              </h3>
              <p className="text-[11px] text-slate-400">
                Rule Hit Evaluation • CWE Classification • Remediation Verification
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-lg font-bold p-1"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Static Scanner Input (Semgrep/Bandit hit) */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold uppercase tracking-wider text-slate-500 text-[10px]">
                Static Scanner Hit
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-100 text-rose-800 border border-rose-200">
                HIT: {warning.rule}
              </span>
            </div>
            <div className="font-mono text-slate-800 space-y-0.5">
              <p>Line {warning.line}: <span className="text-slate-600">{warning.message}</span></p>
              {warning.cwe && (
                <p className="text-rose-600 font-semibold">CWE: {warning.cwe}</p>
              )}
            </div>
          </div>

          {/* LLM Triage Results */}
          {isLoading ? (
            <div className="p-8 text-center space-y-3 bg-blue-50/40 rounded-xl border border-blue-100">
              <Cpu className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
              <p className="font-semibold text-slate-800">
                LLM Triage Model Evaluating Finding...
              </p>
              <p className="text-slate-500 text-[11px]">
                Checking false positives, extracting AST context, and formulating patch suggestion.
              </p>
            </div>
          ) : triageResult ? (
            <div className="space-y-4">
              {/* Verdict Card */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-[10px] font-semibold text-slate-500 block uppercase">
                    Verdict
                  </span>
                  <span className={`text-sm font-bold uppercase mt-1 inline-block ${
                    triageResult.verdict === 'true positive' ? 'text-rose-600' : 'text-emerald-600'
                  }`}>
                    {triageResult.verdict}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-[10px] font-semibold text-slate-500 block uppercase">
                    Severity / CWE
                  </span>
                  <span className="text-sm font-mono font-bold text-slate-900 mt-1 inline-block">
                    {triageResult.cwe || warning.cwe || 'CWE-89'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-[10px] font-semibold text-slate-500 block uppercase">
                    Confidence
                  </span>
                  <span className="text-sm font-mono font-bold text-blue-600 mt-1 inline-block">
                    {(triageResult.confidence * 100).toFixed(0)}%
                  </span>
                </div>
              </div>

              {/* Plain-English Explanation */}
              <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-amber-900">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  <span>Risk Explanation (Plain English)</span>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  {triageResult.explanation}
                </p>
              </div>

              {/* Patch Suggestion */}
              <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                  <Wrench className="w-4 h-4 text-emerald-600" />
                  <span>Patch Recommendation</span>
                </div>
                <p className="text-slate-700 font-mono text-[11px] bg-white p-2.5 rounded border border-emerald-200">
                  {triageResult.patchSuggestion}
                </p>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Validated against Pytest sandbox &amp; Guardrails
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-200 transition-colors font-medium text-xs"
            >
              Close
            </button>
            {triageResult && (
              <button
                onClick={() => onApplyPatch(triageResult.patchSuggestion)}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors"
              >
                Apply Proactive Patch
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
