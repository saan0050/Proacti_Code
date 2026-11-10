import React from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Wrench, 
  Bug, 
  Info, 
  CheckCircle2, 
  Flame, 
  Cpu, 
  FileCode2,
  Lock,
  ArrowRight,
  Clock,
  DollarSign,
  TrendingDown,
  Layers,
  Sparkles
} from 'lucide-react';
import { AnalysisReport, DangerousBug } from '../types';

interface RightAnalysisPanelProps {
  report: AnalysisReport | null;
  onFixCode: () => void;
  isFixing: boolean;
  onSelectBugLine?: (line: number) => void;
}

export const RightAnalysisPanel: React.FC<RightAnalysisPanelProps> = ({
  report,
  onFixCode,
  isFixing,
  onSelectBugLine,
}) => {
  if (!report) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-8 text-center flex flex-col items-center justify-center h-full shadow-xs">
        <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
          <Cpu className="w-6 h-6 animate-pulse" />
        </div>
        <h3 className="text-sm font-bold text-slate-800">Ready to Analyze</h3>
        <p className="text-xs text-slate-500 max-w-xs mt-1.5 leading-relaxed">
          Paste your code on the left or enter a GitHub link, then click <strong>&quot;Run Code Analysis&quot;</strong> to evaluate Risk Score, Technical Debt, and Dangerous Bugs.
        </p>
      </div>
    );
  }

  const {
    riskScore,
    riskCategory,
    riskSummary,
    dangerousBugs,
    technicalDebt,
    cyclomaticComplexity,
    linesOfCode,
    duplicationPercentage,
    testPassRate,
  } = report;

  const criticalBugs = dangerousBugs.filter(b => b.severity === 'Critical');
  const highBugs = dangerousBugs.filter(b => b.severity === 'High');

  const getRiskColor = (score: number) => {
    if (score <= 30) return { bg: 'bg-emerald-500', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
    if (score <= 65) return { bg: 'bg-amber-500', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-800 border-amber-200' };
    return { bg: 'bg-rose-500', text: 'text-rose-700', badge: 'bg-rose-100 text-rose-800 border-rose-200' };
  };

  const riskTheme = getRiskColor(riskScore);

  return (
    <div className="space-y-4">
      {/* 1. SEPARATE PANEL: RISK SCORE */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-blue-50 text-blue-600">
              <Flame className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-bold text-slate-900">
              Code Risk Score
            </h3>
          </div>
          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${riskTheme.badge}`}>
            {riskCategory}
          </span>
        </div>

        {/* Score Visual Gauge */}
        <div className="py-4 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-4xl font-extrabold tracking-tight text-slate-900">
                {riskScore}
              </span>
              <span className="text-sm font-medium text-slate-400">/ 100</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {riskScore <= 30 
                ? 'Safe: Clean code with low defect likelihood.' 
                : riskScore <= 65 
                ? 'Caution: Moderate complexity and code smells.' 
                : 'Urgent: High risk of defects and security vulnerabilities.'}
            </p>
          </div>

          {/* Simple Mini Meter */}
          <div className="w-24 text-center">
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200 p-0.5">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${riskTheme.bg}`}
                style={{ width: `${Math.max(5, riskScore)}%` }}
              />
            </div>
            <span className="text-[10px] font-mono text-slate-400 mt-1 block">
              {riskScore}% Risk Index
            </span>
          </div>
        </div>

        {/* Plain-English Summary */}
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 leading-relaxed">
          <strong className="text-slate-900">Risk Assessment: </strong>
          {riskSummary}
        </div>

        {/* Action Button: Fix Code */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            {dangerousBugs.length > 0 
              ? `${dangerousBugs.length} issue(s) detected` 
              : 'Code is clean'}
          </span>

          <button
            onClick={onFixCode}
            disabled={isFixing}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-60"
          >
            <Wrench className={`w-3.5 h-3.5 ${isFixing ? 'animate-spin' : ''}`} />
            <span>{isFixing ? 'Fixing Code...' : dangerousBugs.length === 0 ? 'Code is Clean' : 'Fix Code'}</span>
          </button>
        </div>
      </div>

      {/* 2. TECHNICAL DEBT ESTIMATOR (Item 3) */}
      {technicalDebt && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-amber-50 text-amber-600">
                <Clock className="w-4 h-4" />
              </span>
              <h3 className="text-sm font-bold text-slate-900">
                Technical Debt Estimator
              </h3>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-500 font-medium">SQALE Rating:</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded font-mono ${
                technicalDebt.sqaleRating === 'A'
                  ? 'bg-emerald-100 text-emerald-800'
                  : technicalDebt.sqaleRating === 'B'
                  ? 'bg-blue-100 text-blue-800'
                  : technicalDebt.sqaleRating === 'C'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-rose-100 text-rose-800'
              }`}>
                Grade {technicalDebt.sqaleRating}
              </span>
            </div>
          </div>

          {/* Core Debt Figures */}
          <div className="grid grid-cols-3 gap-2.5 pt-1">
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-center">
              <span className="text-[10px] font-semibold text-slate-500 uppercase block">
                Remediation Time
              </span>
              <span className="text-base font-bold text-slate-900 mt-0.5 block font-mono">
                {technicalDebt.remediationHours} hrs
              </span>
              <span className="text-[10px] text-slate-400">
                ~{technicalDebt.remediationDays} dev days
              </span>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-center">
              <span className="text-[10px] font-semibold text-slate-500 uppercase block">
                Estimated Cost
              </span>
              <span className="text-base font-bold text-slate-900 mt-0.5 block font-mono">
                ${technicalDebt.estimatedCostUsd}
              </span>
              <span className="text-[10px] text-slate-400">
                @$85/hr baseline
              </span>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-center">
              <span className="text-[10px] font-semibold text-slate-500 uppercase block">
                Debt Ratio (TDR)
              </span>
              <span className={`text-base font-bold mt-0.5 block font-mono ${
                technicalDebt.debtRatioPercentage > 30 ? 'text-rose-600' : 'text-emerald-600'
              }`}>
                {technicalDebt.debtRatioPercentage}%
              </span>
              <span className="text-[10px] text-slate-400">
                {technicalDebt.remediationPriority}
              </span>
            </div>
          </div>

          {/* Debt Breakdown by Category */}
          <div className="pt-1 space-y-1.5 text-xs">
            <div className="flex justify-between items-center text-slate-600 text-[11px]">
              <span>Security Hardening Debt:</span>
              <span className="font-mono font-semibold text-slate-800">{technicalDebt.breakdown.securityHours} hrs</span>
            </div>
            <div className="flex justify-between items-center text-slate-600 text-[11px]">
              <span>Complexity &amp; Refactoring:</span>
              <span className="font-mono font-semibold text-slate-800">{technicalDebt.breakdown.complexityHours} hrs</span>
            </div>
            <div className="flex justify-between items-center text-slate-600 text-[11px]">
              <span>Tests &amp; Reliability Deficit:</span>
              <span className="font-mono font-semibold text-slate-800">{technicalDebt.breakdown.reliabilityHours} hrs</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. DANGEROUS BUGS & SECURITY HOLES DETECTION */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Dangerous Bugs &amp; Security Holes ({dangerousBugs.length})
            </h3>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] font-semibold">
            {criticalBugs.length > 0 && (
              <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200">
                {criticalBugs.length} Critical
              </span>
            )}
            {highBugs.length > 0 && (
              <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                {highBugs.length} High
              </span>
            )}
          </div>
        </div>

        {/* Findings List */}
        <div className="divide-y divide-slate-100 max-h-[360px] overflow-y-auto">
          {dangerousBugs.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-800">No Security Flaws or Dangerous Bugs Found</p>
              <p className="text-xs text-slate-400 mt-1">This code adheres to secure programming practices.</p>
            </div>
          ) : (
            dangerousBugs.map((bug) => (
              <div 
                key={bug.id} 
                className="p-4 hover:bg-slate-50/80 transition-colors space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                      bug.severity === 'Critical'
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : bug.severity === 'High'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-blue-100 text-blue-800 border border-blue-200'
                    }`}>
                      {bug.severity}
                    </span>

                    {bug.cwe && (
                      <span className="text-[10px] font-mono font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                        {bug.cwe}
                      </span>
                    )}

                    <span className="font-bold text-slate-800">
                      {bug.title}
                    </span>
                  </div>

                  <button
                    onClick={() => onSelectBugLine && onSelectBugLine(bug.line)}
                    className="text-[11px] font-mono text-blue-600 hover:text-blue-800 underline font-medium cursor-pointer"
                  >
                    Line {bug.line}
                  </button>
                </div>

                <p className="text-slate-700 font-medium">
                  {bug.description}
                </p>

                {/* Real-world Danger / Impact */}
                <div className="bg-rose-50/70 border border-rose-200 p-2.5 rounded-lg text-rose-900 space-y-0.5">
                  <div className="font-bold text-[11px] flex items-center gap-1">
                    <Lock className="w-3 h-3 text-rose-600" />
                    <span>Danger / Security Impact:</span>
                  </div>
                  <p className="text-[11px] text-rose-800 leading-relaxed">
                    {bug.impact}
                  </p>
                </div>

                {/* Plain-English Fix Guidance */}
                <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-slate-700">
                  <span className="font-bold text-slate-900 block text-[11px]">Recommended Fix:</span>
                  <span className="text-[11px]">{bug.howToFix}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 4. CODE METRICS */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 bg-white rounded-xl border border-slate-200 text-center shadow-2xs">
          <span className="text-[11px] font-medium text-slate-500 block">Total Lines</span>
          <span className="text-lg font-bold text-slate-800 mt-0.5 block font-mono">
            {linesOfCode}
          </span>
        </div>

        <div className="p-3 bg-white rounded-xl border border-slate-200 text-center shadow-2xs">
          <span className="text-[11px] font-medium text-slate-500 block">Complexity</span>
          <span className="text-lg font-bold text-slate-800 mt-0.5 block font-mono">
            {cyclomaticComplexity} <span className="text-xs font-normal text-slate-400">branches</span>
          </span>
        </div>

        <div className="p-3 bg-white rounded-xl border border-slate-200 text-center shadow-2xs">
          <span className="text-[11px] font-medium text-slate-500 block">Test Pass Rate</span>
          <span className={`text-lg font-bold mt-0.5 block font-mono ${testPassRate === 100 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {testPassRate}%
          </span>
        </div>
      </div>
    </div>
  );
};
