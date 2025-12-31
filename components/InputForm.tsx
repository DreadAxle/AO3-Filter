import React, { useState } from 'react';

interface InputFormProps {
  onAdd: (url: string, label: string) => { success: boolean; error?: string };
}

export const InputForm: React.FC<InputFormProps> = ({ onAdd }) => {
  const [inputValue, setInputValue] = useState('');
  const [labelValue, setLabelValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    const result = onAdd(inputValue, labelValue);
    
    if (result.success) {
      setInputValue('');
      setLabelValue('');
    } else if (result.error) {
      setError(result.error);
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-slate-700">
      <div className="p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-4 relative">
          
          <div>
            <label htmlFor="label-input" className="block text-sm font-medium text-slate-300 mb-1">
              Label <span className="text-slate-500 font-normal">(Optional)</span>
            </label>
            <input
              id="label-input"
              type="text"
              value={labelValue}
              onChange={(e) => setLabelValue(e.target.value)}
              placeholder="e.g. Angst, Fluff, Harry Potter"
              className="block w-full rounded-md border-slate-600 bg-slate-900 text-white placeholder-slate-500 shadow-sm focus:border-indigo-500 focus:ring-indigo-500/50 sm:text-sm px-4 py-3 border transition-colors"
            />
          </div>

          <div>
            <label htmlFor="url-input" className="block text-sm font-medium text-slate-300 mb-1">
              Tag URL
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                id="url-input"
                type="text"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="https://archiveofourown.org/tags/60918523/feed.atom"
                className={`flex-1 block w-full rounded-md border-slate-600 bg-slate-900 text-white placeholder-slate-500 shadow-sm focus:border-indigo-500 focus:ring-indigo-500/50 sm:text-sm px-4 py-3 border ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-500/50' : ''}`}
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-400 absolute -bottom-6 left-0">
              {error}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};
