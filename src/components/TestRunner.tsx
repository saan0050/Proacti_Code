import React from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Play, 
  Clock, 
  AlertOctagon, 
  Terminal,
  RotateCcw,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';
import { TestResult } from '../types';

interface TestRunnerProps {
  tests: TestResult[];
  onRerunTests: () => void;
  isRunning: boolean;
  testPassRate: number;
  testCoverage: number;
}

export const TestRunner: React.FC<TestRunnerProps> = ({
  tests,
  onRerunTests,
  isRunning,
  testPassRate,
  testCoverage,
}) => {
  const passingCount = tests.filter(t => t.passed).length;
  const failingCount = tests.length - passingCount;

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs space-y-4 p-5">
      {/* Header and Test Suite Overview */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
              <Terminal className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-bold text-slate-900">
              Pytest Automated Test &amp; Regression Validation Suite
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Phase 3.4: Automated testing gates ensure modifications preserve functional correctness and prevent regressions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              {passingCount} Passing
            </span>
            {failingCount > 0 && (
              <span className="inline-flex items-center gap-1 font-semibold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
                <XCircle className="w-3.5 h-3.5 text-rose-600" />
                {failingCount} Failing
              </span>
            )}
          </div>

          <button
            onClick={onRerunTests}
            disabled={isRunning}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors"
          >
            <Play className={`w-3.5 h-3.5 text-blue-600 ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'Running Pytest...' : 'Rerun Suite'}</span>
          </button>
        </div>
      </div>

      {/* Coverage & Pass Rate Progress Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div>
          <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
            <span>Suite Pass Rate</span>
            <span className="font-bold">{testPassRate}%</span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div 
              className={`h-full ${testPassRate === 100 ? 'bg-emerald-500' : 'bg-rose-500'}`}
              style={{ width: `${testPassRate}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
            <span>Branch / Line Coverage</span>
            <span className="font-bold">{testCoverage}%</span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500"
              style={{ width: `${testCoverage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Tests Execution List */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
          Unit Test Cases ({tests.length})
        </h4>

        <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
          {tests.map((test) => (
            <div 
              key={test.id} 
              className={`p-3.5 text-xs transition-colors ${
                test.passed ? 'bg-white hover:bg-slate-50' : 'bg-rose-50/50 hover:bg-rose-50'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  {test.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
                  )}
                  <div>
                    <span className="font-mono font-semibold text-slate-900">
                      {test.name}
                    </span>
                    <p className="font-mono text-[11px] text-slate-500 mt-0.5">
                      {test.assertion}
                    </p>

                    {test.error && (
                      <div className="mt-2 p-2.5 bg-rose-100/70 border border-rose-200 rounded-md text-rose-900 font-mono text-[11px] leading-relaxed">
                        {test.error}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px] shrink-0">
                  <Clock className="w-3 h-3" />
                  <span>{test.durationMs}ms</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quality Gate Rule Note from Paper */}
      <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2">
        <AlertOctagon className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p>
          <strong>Research Principle (Paper Section 3.4):</strong> &quot;A low-risk score will not cancel out a failed required test or a critical security issue.&quot; Any test failure triggers a blocking &quot;Requests for changes&quot; gate decision until remediated.
        </p>
      </div>
    </div>
  );
};
