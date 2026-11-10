import React, { useState } from 'react';
import { 
  Clipboard, 
  Github, 
  Loader2, 
  Check, 
  AlertCircle,
  ArrowRight
} from 'lucide-react';

interface CodeInputSelectorProps {
  inputMode: 'paste' | 'github';
  setInputMode: (mode: 'paste' | 'github') => void;
  language: 'python' | 'typescript';
  setLanguage: (lang: 'python' | 'typescript') => void;
  onLoadGitHubUrl: (url: string) => Promise<void>;
  isLoadingGitHub: boolean;
  gitHubError: string | null;
  loadedGitHubFilename?: string;
}

export const CodeInputSelector: React.FC<CodeInputSelectorProps> = ({
  inputMode,
  setInputMode,
  language,
  setLanguage,
  onLoadGitHubUrl,
  isLoadingGitHub,
  gitHubError,
  loadedGitHubFilename,
}) => {
  const [githubUrlInput, setGithubUrlInput] = useState('');

  const handleGitHubSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!githubUrlInput.trim() || isLoadingGitHub) return;
    onLoadGitHubUrl(githubUrlInput.trim());
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
      {/* Top Selector: Paste Code vs GitHub Project Link */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setInputMode('paste')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              inputMode === 'paste'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clipboard className="w-3.5 h-3.5 text-blue-600" />
            <span>Option 1: Paste Code</span>
          </button>

          <button
            onClick={() => setInputMode('github')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              inputMode === 'github'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Github className="w-3.5 h-3.5 text-slate-800" />
            <span>Option 2: GitHub Project Repo Link</span>
          </button>
        </div>

        {/* Language Selector */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Language:</span>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as 'python' | 'typescript')}
            className="bg-white border border-slate-200 rounded-md px-2.5 py-1 text-slate-700 font-semibold focus:outline-hidden focus:ring-1 focus:ring-blue-500 cursor-pointer"
          >
            <option value="python">Python 3</option>
            <option value="typescript">JavaScript / TypeScript</option>
          </select>
        </div>
      </div>

      {/* Mode 2: GitHub Repo Link Form */}
      {inputMode === 'github' && (
        <div className="space-y-3 pt-1">
          <form onSubmit={handleGitHubSubmit} className="flex items-center gap-2">
            <div className="relative flex-1">
              <Github className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={githubUrlInput}
                onChange={(e) => setGithubUrlInput(e.target.value)}
                placeholder="Enter GitHub repo or file URL (e.g. https://github.com/owner/repo/blob/main/app.py)"
                className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={!githubUrlInput.trim() || isLoadingGitHub}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg disabled:opacity-50 transition-colors shadow-xs cursor-pointer shrink-0"
            >
              {isLoadingGitHub ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Fetching...</span>
                </>
              ) : (
                <>
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>Assess GitHub Code</span>
                </>
              )}
            </button>
          </form>

          {/* Error notice if github fetch fails */}
          {gitHubError && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{gitHubError}</span>
            </div>
          )}

          {/* Success notice */}
          {loadedGitHubFilename && !gitHubError && (
            <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Loaded file from GitHub: <strong>{loadedGitHubFilename}</strong>. Ready for analysis!</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
