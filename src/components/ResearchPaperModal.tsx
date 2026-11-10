import React from 'react';
import { 
  BookOpen, 
  FileText, 
  Check, 
  ExternalLink, 
  Layers, 
  Scale, 
  Cpu, 
  ShieldCheck, 
  Download 
} from 'lucide-react';

interface ResearchPaperModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResearchPaperModal: React.FC<ResearchPaperModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-2xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight">
                ProactiCode Research Paper Foundation
              </h3>
              <p className="text-[11px] text-slate-400">
                Saanvi Anup K, Saritha S • Quality-Aware &amp; Technical Debt AI Architecture
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
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700 leading-relaxed">
          {/* Abstract Highlight */}
          <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl space-y-2">
            <h4 className="font-bold text-blue-900 uppercase tracking-wider text-[11px]">
              Paper Abstract &amp; Core Motivation
            </h4>
            <p className="text-slate-800 italic">
              &quot;Coding AI assistants can help developers generate code more quickly. However, this vastly generated code may introduce quality problems in the software, including code duplication, increased complexity, and possible technical debt. The research paper on Cursor AI has reported a connection between AI-assisted development and deterioration in code quality. These findings motivate us in the development of a quality aware coding AI assistant that evaluates code quality alongside productivity of development.&quot;
            </p>
            <div className="pt-2 flex items-center justify-between text-[11px]">
              <span className="text-blue-800 font-medium">Authors: Saanvi Anup K, Saritha S</span>
              <a
                href="/assets/aistudio/24BTRCL171_RL_ASSIGNMENT_1-1_f9a7033e.pdf"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-blue-700 hover:text-blue-900 underline"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>View Full PDF (Assignment 1-1)</span>
              </a>
            </div>
          </div>

          {/* Core Architectural Phases */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-blue-600" />
              The 5 Proposed Work Phases
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="font-bold text-slate-900 block text-xs">Phase 3.1: Quality Pipeline</span>
                <p className="text-slate-600 text-[11px] mt-1">
                  Combines Ruff/Pylint static analysis, Radon cyclomatic and cognitive complexity metrics, Bandit security scanning, and Pytest execution suites.
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="font-bold text-slate-900 block text-xs">Phase 3.2: Technical Debt Scoring</span>
                <p className="text-slate-600 text-[11px] mt-1">
                  Transparent multi-indicator mathematical risk formula: <span className="font-mono font-bold text-slate-800">R = ∑(w_i × X_i)</span> normalized into Low, Moderate, and High Risk.
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="font-bold text-slate-900 block text-xs">Phase 3.3: LLM Triage &amp; Patch Writer</span>
                <p className="text-slate-600 text-[11px] mt-1">
                  Scanner hits feed into LLM triage model to confirm true positives, explain root causes in plain English, and generate isolated refactoring patches.
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="font-bold text-slate-900 block text-xs">Phase 3.4: Automated Quality Gates</span>
                <p className="text-slate-600 text-[11px] mt-1">
                  Three outcomes: Accept for review, Flag for review, or Requests for changes. Hard rule: low risk scores cannot override failing tests or critical CVEs.
                </p>
              </div>
            </div>
          </div>

          {/* Mathematical Model */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-blue-600" />
              Mathematical Risk Formulation (Section 3.2)
            </h4>
            <div className="font-mono text-center text-xs py-2 bg-white rounded border border-slate-200 text-slate-900 font-bold">
              R = ∑ (w_i × X_i) for i = 1 to N
            </div>
            <p className="text-[11px] text-slate-600">
              Where <span className="font-mono">R</span> is overall risk score, <span className="font-mono">w_i</span> represents the weight of the i-th indicator, and <span className="font-mono">X_i</span> is the normalized indicator (Static warnings: 0.25, Complexity: 0.25, Test failures: 0.25, Security CWEs: 0.15, Duplication: 0.10).
            </p>
          </div>

          {/* Primary Reference Citation */}
          <div className="border-t border-slate-200 pt-3 text-[11px] text-slate-500 space-y-1">
            <span className="font-bold text-slate-700 block">Primary Motivating Literature:</span>
            <p>
              [1] Hao He, Courtney Miller, Shyam Agarwal, Christian Kästner, and Bogdan Vasilescu. 
              <em> &quot;Speed at the Cost of Quality: How Cursor AI Increases Short-Term Velocity and Long-Term Complexity in Open-Source Projects&quot;</em>.
            </p>
            <p>
              [2] Lehui Li, Ruixuan Jia, Guo-Ye Yang, Jia Li. <em>&quot;An Empirical Study of Proactive Coding Assistants in Real-World Software Development&quot;</em>.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <a
            href="/assets/aistudio/24BTRCL171_RL_ASSIGNMENT_1-1_f9a7033e.pdf"
            download
            className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-semibold"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Paper PDF</span>
          </a>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs shadow-xs"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
