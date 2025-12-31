import React, { useCallback, useState } from 'react';
import { ParsedLink } from '../types';

interface ResultDisplayProps {
  links: ParsedLink[];
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ links }) => {
  const [hasCopied, setHasCopied] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);

  const generatedQuery = links.map(link => `filter_ids:${link.numericId}`).join(' OR ');

  const handleCopy = useCallback(() => {
    if (!generatedQuery) return;
    setCopyError(null);

    const doCopy = async () => {
      if (navigator.clipboard?.writeText && window.isSecureContext) {
        await navigator.clipboard.writeText(generatedQuery);
        return;
      }

      const textArea = document.createElement('textarea');
      textArea.value = generatedQuery;
      textArea.setAttribute('readonly', '');
      textArea.style.position = 'fixed';
      textArea.style.top = '0';
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      const ok = document.execCommand('copy');
      document.body.removeChild(textArea);

      if (!ok) {
        throw new Error('Copy command failed');
      }
    };

    doCopy()
      .then(() => {
        setHasCopied(true);
        setTimeout(() => setHasCopied(false), 2000);
      })
      .catch(() => {
        setCopyError('Copy failed - select the text and copy manually.');
      });
  }, [generatedQuery]);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium text-slate-200">Generated Filter Query</h2>
      <div className="bg-slate-950 rounded-lg p-4 shadow-inner border border-slate-800 relative group min-h-[160px] flex flex-col">
        <pre className="text-indigo-300 font-mono text-sm whitespace-pre-wrap break-all flex-1">
          {generatedQuery || <span className="text-slate-600 italic">Result will appear here...</span>}
        </pre>

        <div className="mt-4 flex">
          <button
            onClick={handleCopy}
            disabled={!generatedQuery}
            className={`w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 ${
              hasCopied
                ? 'bg-green-600 text-white hover:bg-green-500 focus:ring-green-500'
                : 'bg-indigo-600 text-white hover:bg-indigo-500 focus:ring-indigo-500'
            } disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200`}
          >
            {hasCopied ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                Copy to Clipboard
              </>
            )}
          </button>
        </div>
      </div>
      <p className="text-xs text-slate-500">
        Paste this into your filter settings or search bar to apply all ID filters at once.
      </p>
      {copyError && (
        <p className="text-xs text-red-400" role="alert">
          {copyError}
        </p>
      )}
    </div>
  );
};

