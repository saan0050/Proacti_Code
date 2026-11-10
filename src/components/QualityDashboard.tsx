import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Info, 
  Cpu, 
  CheckCircle2, 
  XCircle, 
  Flame, 
  Layers, 
  Wrench, 
  HelpCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { AnalysisReport, StaticWarning } from '../types';

interface QualityDashboardProps {
  report: AnalysisReport | null;
  onTriageWarning: (warning: StaticWarning) => void;
  onRefactor: () => void;
  isRefactoring: boolean;
}

export const QualityDashboard: React.FC<QualityDashboardProps> = ({
  report,
  onTriageWarning,
  onRefactor,
  isRefactoring,
}) => {
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [showFormulaModal, setShowFormulaModal] = useState(false);

  if (!report) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-white border border-slate-200 rounded-xl">
        <Cpu className="w-10 h-10 text-slate-300 mb-3 animate-pulse" />
        <h3 className="text-sm font-semibold text-slate-700">Awaiting Code Analysis</h3>
        <p className="text-xs text-slate-500 max-w-sm mt-1">
          Click &quot;Run Analysis&quot; or select a benchmark sample to evaluate static warnings, cyclomatic complexity, tests, and technical debt risk.
        </p>
      </div>
    );
  }

  const {
    riskScore,
    riskCategory,
    mlDefectProbability,
    mlConfidence,
    cyclomaticComplexity,
    cognitiveComplexity,
    duplicationPercentage,
    warnings,
    tests,
    testPassRate,
    testCoverage,
    qualityGate,
    qualityGateReasons,
    breakdown,
  } = report;

  const criticalWarnings = warnings.filter(w => w.severity === 'critical');
  const highWarnings = warnings.filter(w => w.severity === 'high');
  const mediumWarnings = warnings.filter(w => w.severity === 'medium');
  const lowWarnings = warnings.filter(w => w.severity === 'low');

  const filteredWarnings = warnings.filter(w => {
    if (selectedSeverity === 'all') return true;
    return w.severity === selectedSeverity;
  });

  const getRiskScoreColor = (score: number) => {
    if (score <= 30) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score <= 65) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  return (
    <div className="space-y-4">
      {/* Quality Gate Status Banner (Phase 3.4) */}
      <div className={`p-4 rounded-xl border ${
        qualityGate === 'Accept for review'
          ? 'bg-emerald-50/70 border-emerald-200'
          : qualityGate === 'Flag for review'
          ? 'bg-amber-50/70 border-amber-200'
          : 'bg-rose-50/70 border-rose-200'
      }`}>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            {qualityGate === 'Accept for review' ? (
              <ShieldCheck className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
            ) : qualityGate === 'Flag for review' ? (
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
            ) : (
              <ShieldAlert className="w-5 h-5 text-rose-600 mt-0.5 shrink-0" />
            )}
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-slate-900">
                  Quality Gate: {qualityGate}
                </h4>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                  qualityGate === 'Accept for review'
                    ? 'bg-emerald-100 text-emerald-800'
                    : qualityGate === 'Flag for review'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-rose-100 text-rose-800'
                }`}>
                  {qualityGate === 'Accept for review' ? 'APPROVED' : qualityGate === 'Flag for review' ? 'WARNINGS' : 'BLOCKING DEFECT'}
                </span>
              </div>
              <ul className="mt-1 space-y-0.5">
                {qualityGateReasons.map((reason, idx) => (
                  <li key={idx} className="text-xs text-slate-700">
                    • {reason}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {qualityGate !== 'Accept for review' && (
            <button
              onClick={onRefactor}
              disabled={isRefactoring}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isRefactoring ? 'Refactoring...' : 'Fix All Blockers'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Core Quality Indicators Grid (Phase 3.1 & 3.2) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Metric 1: Technical Debt Risk Score */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs relative">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Technical Debt Risk</span>
            <button 
              onClick={() => setShowFormulaModal(true)}
              className="text-slate-400 hover:text-slate-600"
              title="View formula R = sum(w_i * X_i)"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              {riskScore}
            </span>
            <span className="text-xs text-slate-400">/ 100</span>
          </div>
          <div className="mt-1.5">
            <span className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded border ${getRiskScoreColor(riskScore)}`}>
              {riskCategory}
            </span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
            <div 
              className={`h-full ${riskScore > 65 ? 'bg-rose-500' : riskScore > 30 ? 'bg-amber-500' : 'bg-emerald-500'}`}
              style={{ width: `${riskScore}%` }}
            />
          </div>
        </div>

        {/* Metric 2: ML Defect Predictor */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">ML Defect Probability</span>
            <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded font-mono">
              conf {(mlConfidence * 100).toFixed(0)}%
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              {mlDefectProbability}%
            </span>
            <span className="text-xs text-slate-400">defect odds</span>
          </div>
          <p className="mt-1.5 text-[11px] text-slate-500 truncate">
            {mlDefectProbability > 50 ? 'High bug occurrence probability' : 'Stable execution profile'}
          </p>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
            <div 
              className={`h-full ${mlDefectProbability > 50 ? 'bg-rose-500' : 'bg-emerald-500'}`}
              style={{ width: `${mlDefectProbability}%` }}
            />
          </div>
        </div>

        {/* Metric 3: Complexity & Duplication */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Cyclomatic / Cognitive</span>
            <span className="text-[10px] text-slate-500 font-mono">Radon</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              {cyclomaticComplexity}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              / cog: {cognitiveComplexity}
            </span>
          </div>
          <div className="mt-1.5 flex items-center gap-2 text-[11px] text-slate-500">
            <span>Duplication: <strong>{duplicationPercentage}%</strong></span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
            <div 
              className={`h-full ${cyclomaticComplexity > 10 ? 'bg-amber-500' : 'bg-emerald-500'}`}
              style={{ width: `${Math.min(100, (cyclomaticComplexity / 20) * 100)}%` }}
            />
          </div>
        </div>

        {/* Metric 4: Automated Test Validation */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Automated Tests</span>
            <span className="text-[10px] text-slate-500 font-mono">Pytest</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl font-bold tracking-tight ${testPassRate === 100 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {testPassRate}%
            </span>
            <span className="text-xs text-slate-400">
              ({tests.filter(t => t.passed).length}/{tests.length} passed)
            </span>
          </div>
          <div className="mt-1.5 text-[11px] text-slate-500">
            Estimated coverage: <strong>{testCoverage}%</strong>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
            <div 
              className={`h-full ${testPassRate === 100 ? 'bg-emerald-500' : 'bg-rose-500'}`}
              style={{ width: `${testPassRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Static Analysis & Security Findings Section (Phase 3.1 & Figure 8) */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Static Code Analysis & Security Findings ({warnings.length})
            </h4>
            <span className="text-xs text-slate-500">• Ruff / Bandit / Semgrep / Radon</span>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 text-xs">
            <button
              onClick={() => setSelectedSeverity('all')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                selectedSeverity === 'all'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'bg-slate-200/70 text-slate-700 hover:bg-slate-300'
              }`}
            >
              All ({warnings.length})
            </button>
            <button
              onClick={() => setSelectedSeverity('critical')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                selectedSeverity === 'critical'
                  ? 'bg-rose-600 text-white font-semibold'
                  : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
              }`}
            >
              Critical ({criticalWarnings.length})
            </button>
            <button
              onClick={() => setSelectedSeverity('high')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                selectedSeverity === 'high'
                  ? 'bg-amber-600 text-white font-semibold'
                  : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
              }`}
            >
              High ({highWarnings.length})
            </button>
            <button
              onClick={() => setSelectedSeverity('medium')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                selectedSeverity === 'medium'
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
              }`}
            >
              Medium/Low ({mediumWarnings.length + lowWarnings.length})
            </button>
          </div>
        </div>

        {/* Findings List */}
        <div className="divide-y divide-slate-100 max-h-[380px] overflow-y-auto">
          {filteredWarnings.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-800">No issues found in this category</p>
              <p className="text-xs text-slate-400 mt-0.5">Code adheres to quality requirements.</p>
            </div>
          ) : (
            filteredWarnings.map((warning) => (
              <div 
                key={warning.id} 
                className="p-3.5 hover:bg-slate-50/80 transition-colors flex items-start justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                      warning.severity === 'critical'
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : warning.severity === 'high'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-blue-100 text-blue-800 border border-blue-200'
                    }`}>
                      {warning.severity}
                    </span>

                    {warning.cwe && (
                      <span className="text-[11px] font-mono font-semibold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                        {warning.cwe}
                      </span>
                    )}

                    <span className="text-xs font-mono font-medium text-slate-500">
                      Line {warning.line} • {warning.rule}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-slate-800">
                    {warning.message}
                  </p>

                  <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-200">
                    <span className="font-semibold text-slate-700">Recommendation:</span> {warning.suggestion}
                  </p>
                </div>

                <div className="shrink-0 flex flex-col items-end gap-1.5">
                  <button
                    onClick={() => onTriageWarning(warning)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-colors"
                  >
                    <Sparkles className="w-3 h-3 text-blue-600" />
                    <span>LLM Triage</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Formula & Weight Modal (from Paper Section 3.2) */}
      {showFormulaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-2xs p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                Technical Debt Risk Scoring Formula (Paper Section 3.2)
              </h3>
              <button 
                onClick={() => setShowFormulaModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs font-mono text-slate-800 text-center">
              R = ∑ (w_i × X_i) for i = 1 to N
            </div>

            <p className="text-xs text-slate-600">
              Each measurable code-quality indicator is normalized (0 to 100) and weighted according to empirical risk contribution:
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center p-2 rounded bg-slate-50 border border-slate-200">
                <span>w1: Static Analysis Severity (25%)</span>
                <span className="font-mono font-bold text-slate-800">{breakdown.staticSeverityScore} / 100</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-slate-50 border border-slate-200">
                <span>w2: Cyclomatic & Cognitive Complexity (25%)</span>
                <span className="font-mono font-bold text-slate-800">{breakdown.complexityScore} / 100</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-slate-50 border border-slate-200">
                <span>w3: Test Failures & Regressions (25%)</span>
                <span className="font-mono font-bold text-slate-800">{breakdown.testFailureScore} / 100</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-slate-50 border border-slate-200">
                <span>w4: Security Vulnerabilities (15%)</span>
                <span className="font-mono font-bold text-slate-800">{breakdown.securityScore} / 100</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-slate-50 border border-slate-200">
                <span>w5: Code Duplication & Bloat (10%)</span>
                <span className="font-mono font-bold text-slate-800">{breakdown.duplicationScore} / 100</span>
              </div>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900">
              <strong>Calculated Risk Score R:</strong> {riskScore}/100 ({riskCategory}).
              <br />
              <span className="text-[11px] text-blue-700">
                Rule: A low risk score never overrides a failing test or critical vulnerability.
              </span>
            </div>

            <div className="text-right">
              <button
                onClick={() => setShowFormulaModal(false)}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
