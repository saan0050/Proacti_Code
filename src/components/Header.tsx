import React from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  Play, 
  Wrench, 
  Download,
  RotateCcw
} from 'lucide-react';
import { AnalysisReport } from '../types';

interface HeaderProps {
  report: AnalysisReport | null;
  onAnalyze: () => void;
  onFixCode: () => void;
  onReset: () => void;
  onExport: () => void;
  isAnalyzing: boolean;
  isFixing: boolean;
  hasFixedCode: boolean;
  isSideBySide: boolean;
  setIsSideBySide: (val: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  report,
  onAnalyze,
  onFixCode,
  onReset,
  onExport,
  isAnalyzing,
  isFixing,
  hasFixedCode,
  isSideBySide,
  setIsSideBySide,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-xs">
              P
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 tracking-tight leading-tight">ProactiCode</h1>
              <p className="text-xs text-slate-500 font-medium">
                AI code Quality &amp; Security enchancer
              </p>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center gap-2.5">
            {/* View Mode Toggle when fixed code exists */}
            {hasFixedCode && (
              <button
                onClick={() => setIsSideBySide(!isSideBySide)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                  isSideBySide
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {isSideBySide ? 'Side-by-Side Active' : 'Show Side-by-Side'}
              </button>
            )}

            {/* Run Analysis Button */}
            <button
              onClick={onAnalyze}
              disabled={isAnalyzing}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-2xs transition-colors cursor-pointer disabled:opacity-60"
            >
              <Play className={`w-3.5 h-3.5 text-blue-600 ${isAnalyzing ? 'animate-spin' : ''}`} />
              <span>{isAnalyzing ? 'Analyzing Code...' : 'Run Code Analysis'}</span>
            </button>

            {/* Fix Code Button */}
            <button
              onClick={onFixCode}
              disabled={isFixing}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-60"
            >
              <Wrench className={`w-3.5 h-3.5 ${isFixing ? 'animate-spin' : ''}`} />
              <span>{isFixing ? 'Fixing Code...' : 'Fix Code'}</span>
            </button>

            {/* Reset Button */}
            <button
              onClick={onReset}
              title="Reset Code"
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Export Report */}
            {report && (
              <button
                onClick={onExport}
                title="Download Analysis Report"
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
