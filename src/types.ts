export interface StaticWarning {
  id: string;
  rule: string;
  line: number;
  column?: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: 'security' | 'complexity' | 'maintainability' | 'code-style' | 'reliability';
  cwe?: string;
  message: string;
  suggestion: string;
}

export interface TestResult {
  id: string;
  name: string;
  passed: boolean;
  durationMs: number;
  assertion: string;
  error?: string;
}

export interface MetricBreakdown {
  staticSeverityScore: number;
  complexityScore: number;
  testFailureScore: number;
  securityScore: number;
  duplicationScore: number;
}

export interface DangerousBug {
  id: string;
  title: string;
  line: number;
  severity: 'Critical' | 'High' | 'Medium';
  category: string;
  cwe?: string;
  description: string;
  impact: string;
  howToFix: string;
}

export interface TechnicalDebt {
  remediationHours: number;
  remediationDays: number;
  estimatedCostUsd: number;
  debtRatioPercentage: number;
  sqaleRating: 'A' | 'B' | 'C' | 'D' | 'E';
  breakdown: {
    securityHours: number;
    complexityHours: number;
    reliabilityHours: number;
    duplicationHours: number;
  };
  remediationPriority: 'Immediate Action Required' | 'High' | 'Moderate' | 'Low / Healthy';
}

export interface AnalysisReport {
  timestamp: string;
  linesOfCode: number;
  cyclomaticComplexity: number;
  cognitiveComplexity: number;
  maxNestingDepth: number;
  duplicationPercentage: number;
  warnings: StaticWarning[];
  dangerousBugs: DangerousBug[];
  tests: TestResult[];
  testPassRate: number;
  testCoverage: number;
  riskScore: number; // 0 - 100
  riskCategory: 'Low Risk' | 'Moderate Risk' | 'High Risk';
  riskSummary: string;
  technicalDebt: TechnicalDebt;
  mlDefectProbability: number; // 0 - 100%
  mlConfidence: number; // 0 - 1
  qualityGate: 'Accept for review' | 'Flag for review' | 'Requests for changes';
  qualityGateReasons: string[];
  breakdown: MetricBreakdown;
}

export interface LLMTriageResult {
  verdict: 'true positive' | 'false positive';
  severity: 'critical' | 'high' | 'medium' | 'low';
  cwe: string;
  confidence: number;
  explanation: string;
  patchSuggestion: string;
}

export interface RefactorResult {
  originalCode: string;
  patchedCode: string;
  explanation: string;
  beforeAnalysis: AnalysisReport;
  afterAnalysis: AnalysisReport;
  metricsDelta: {
    cyclomaticDelta: number;
    cognitiveDelta: number;
    warningsDelta: number;
    riskScoreDelta: number;
    testPassRateDelta: number;
  };
  isAlreadyClean?: boolean;
}

export interface RevisionEntry {
  id: string;
  label: string;
  timestamp: string;
  riskScore: number;
  riskCategory: 'Low Risk' | 'Moderate Risk' | 'High Risk';
  cyclomatic: number;
  warningsCount: number;
  testPassRate: number;
}
