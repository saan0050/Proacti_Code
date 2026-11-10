import React from 'react';
import { 
  FileCode, 
  RotateCcw,
  Sparkles,
  Send,
  Wrench,
  Play
} from 'lucide-react';
import { StaticWarning } from '../types';

interface EditorProps {
  code: string;
  setCode: (code: string) => void;
  language: 'python' | 'typescript';
  warnings: StaticWarning[];
  highlightedLine?: number | null;
  onSelectWarning: (warning: StaticWarning) => void;
  onRunAnalysis: () => void;
  onFixCode: () => void;
  isAnalyzing: boolean;
  isFixing: boolean;
}

export const Editor: React.FC<EditorProps> = ({
  code,
  setCode,
  language,
  warnings,
  highlightedLine,
  onSelectWarning,
  onRunAnalysis,
  onFixCode,
  isAnalyzing,
  isFixing,
}) => {
  const lines = code.split('\n');

  // Map line numbers to warnings
  const warningLineMap = React.useMemo(() => {
    const map = new Map<number, StaticWarning[]>();
    warnings.forEach(w => {
      const list = map.get(w.line) || [];
      list.push(w);
      map.set(w.line, list);
    });
    return map;
  }, [warnings]);

  return (
    <div className="flex flex-col h-full bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
      {/* Editor Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-200 text-xs">
        <div className="flex items-center gap-2">
          <FileCode className="w-4 h-4 text-blue-600" />
          <span className="font-bold text-slate-800">
            Source Code Editor ({language === 'python' ? 'Python' : 'JavaScript / TypeScript'})
          </span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-500">
            {lines.length} lines • {code.length} characters
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRunAnalysis}
            disabled={isAnalyzing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-semibold rounded-md shadow-2xs transition-colors cursor-pointer text-xs disabled:opacity-60"
          >
            <Play className={`w-3.5 h-3.5 text-blue-600 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAnalyzing ? 'Analyzing...' : 'Run Code Analysis'}</span>
          </button>

          <button
            onClick={onFixCode}
            disabled={isFixing}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md shadow-xs transition-colors cursor-pointer text-xs disabled:opacity-60"
          >
            <Wrench className={`w-3.5 h-3.5 ${isFixing ? 'animate-spin' : ''}`} />
            <span>{isFixing ? 'Fixing...' : 'Fix Code'}</span>
          </button>
        </div>
      </div>

      {/* Code Editor Body with Line Numbers & Gutter */}
      <div className="flex-1 flex overflow-hidden relative font-mono text-xs">
        {/* Gutter with line numbers and alert badges */}
        <div className="w-12 bg-slate-50 border-r border-slate-200 py-3 select-none flex flex-col text-right pr-2 text-slate-400 shrink-0">
          {lines.map((_, index) => {
            const lineNum = index + 1;
            const lineWarnings = warningLineMap.get(lineNum);
            const hasCritical = lineWarnings?.some(w => w.severity === 'critical');
            const hasHigh = lineWarnings?.some(w => w.severity === 'high');
            const isHighlighted = highlightedLine === lineNum;

            return (
              <div 
                key={lineNum} 
                className={`h-5 flex items-center justify-end gap-1 leading-5 ${isHighlighted ? 'bg-amber-100 font-bold text-amber-900' : ''}`}
              >
                {hasCritical ? (
                  <button
                    onClick={() => lineWarnings && onSelectWarning(lineWarnings[0])}
                    title={`Line ${lineNum}: Critical security flaw (${lineWarnings?.[0].cwe || 'CWE-89'})`}
                    className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse cursor-pointer"
                  />
                ) : hasHigh ? (
                  <button
                    onClick={() => lineWarnings && onSelectWarning(lineWarnings[0])}
                    title={`Line ${lineNum}: High severity issue`}
                    className="w-2.5 h-2.5 rounded-full bg-amber-500 cursor-pointer"
                  />
                ) : lineWarnings && lineWarnings.length > 0 ? (
                  <button
                    onClick={() => lineWarnings && onSelectWarning(lineWarnings[0])}
                    title={`Line ${lineNum}: Code warning`}
                    className="w-2 h-2 rounded-full bg-blue-400 cursor-pointer"
                  />
                ) : null}
                <span>{lineNum}</span>
              </div>
            );
          })}
        </div>

        {/* Textarea code container */}
        <div className="flex-1 relative overflow-auto p-3 bg-white">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            placeholder="Type or paste your Python or TypeScript code here..."
            className="w-full h-full resize-none font-mono text-xs leading-5 text-slate-800 bg-transparent focus:outline-hidden whitespace-pre"
            style={{ tabSize: 4 }}
          />
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-600 inline-block"></span>
            <span>Critical Security Hole</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span>
            <span>High Risk / Complexity</span>
          </div>
        </div>
        <span>Editable: modify code directly or click &quot;Fix Code&quot;</span>
      </div>
    </div>
  );
};
