import React from 'react';
import { 
  History, 
  TrendingDown, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert,
  GitCommit,
  RotateCcw
} from 'lucide-react';
import { RevisionEntry } from '../types';

interface RevisionHistoryProps {
  revisions: RevisionEntry[];
  onRevertToRevision?: (rev: RevisionEntry) => void;
}

export const RevisionHistory: React.FC<RevisionHistoryProps> = ({
  revisions,
  onRevertToRevision,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs space-y-4 p-5">
      <div className="border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
            <History className="w-4 h-4" />
          </span>
          <h3 className="text-sm font-bold text-slate-900">
            Historical Quality Trends &amp; Revision Log (Paper Section 3.5)
          </h3>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">
          Tracks whether code modifications improve, preserve, or worsen software quality metrics over development time.
        </p>
      </div>

      {revisions.length === 0 ? (
        <div className="p-8 text-center text-slate-400 text-xs">
          No revisions recorded yet. Run code analysis or apply patches to build history.
        </div>
      ) : (
        <div className="space-y-4">
          {/* Trend Bar */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-xs font-bold text-slate-700 block mb-2">
              Quality Debt Score Progression Across Revisions
            </span>
            <div className="flex items-end gap-3 h-28 pt-4">
              {revisions.map((rev, idx) => {
                const heightPercent = Math.max(15, rev.riskScore);
                const isLatest = idx === revisions.length - 1;
                return (
                  <div key={rev.id} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    <span className="text-[10px] font-mono font-bold text-slate-700">
                      {rev.riskScore}
                    </span>
                    <div 
                      className={`w-full rounded-t-md transition-all ${
                        rev.riskScore > 65
                          ? 'bg-rose-500'
                          : rev.riskScore > 30
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      } ${isLatest ? 'ring-2 ring-blue-500 ring-offset-1' : ''}`}
                      style={{ height: `${heightPercent}%` }}
                    />
                    <span className="text-[10px] font-medium text-slate-500 truncate max-w-[80px]">
                      {rev.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Revisions Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">Revision</th>
                  <th className="py-2.5 px-4">Timestamp</th>
                  <th className="py-2.5 px-4">Risk Category</th>
                  <th className="py-2.5 px-4">Debt Score</th>
                  <th className="py-2.5 px-4">Cyclomatic</th>
                  <th className="py-2.5 px-4">Warnings</th>
                  <th className="py-2.5 px-4">Pass Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {revisions.map((rev) => (
                  <tr key={rev.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-4 font-semibold text-slate-800 flex items-center gap-1.5">
                      <GitCommit className="w-3.5 h-3.5 text-slate-400" />
                      <span>{rev.label}</span>
                    </td>
                    <td className="py-2.5 px-4 text-slate-500 font-mono text-[11px]">
                      {new Date(rev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                    <td className="py-2.5 px-4">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        rev.riskCategory === 'Low Risk'
                          ? 'bg-emerald-100 text-emerald-800'
                          : rev.riskCategory === 'Moderate Risk'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {rev.riskCategory}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 font-mono font-bold text-slate-900">
                      {rev.riskScore} / 100
                    </td>
                    <td className="py-2.5 px-4 font-mono text-slate-700">
                      {rev.cyclomatic}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-slate-700">
                      {rev.warningsCount}
                    </td>
                    <td className="py-2.5 px-4 font-mono font-semibold text-emerald-600">
                      {rev.testPassRate}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
