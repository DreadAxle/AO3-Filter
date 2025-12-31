import React from 'react';

const REPO_URL = 'https://github.com/DreadAxle/AO3-Filter';

export const Footer: React.FC = () => {
  const baseUrl = import.meta.env.BASE_URL || '/';
  const interLicenseUrl = `${baseUrl}fonts/OFL.txt`;

  return (
    <footer className="mt-6 border-t border-slate-800 pt-6 text-center text-xs text-slate-500 space-y-2">
      <p>Runs entirely in your browser. Your data is stored in localStorage.</p>
      <p>Not affiliated with or endorsed by Archive of Our Own.</p>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
        <a
          href={REPO_URL}
          target="_blank"
          rel="noreferrer"
          className="hover:text-slate-200 hover:underline"
        >
          Source
        </a>
        <a
          href={`${REPO_URL}/issues`}
          target="_blank"
          rel="noreferrer"
          className="hover:text-slate-200 hover:underline"
        >
          Issues
        </a>
        <a href={interLicenseUrl} className="hover:text-slate-200 hover:underline">
          Inter font license (OFL)
        </a>
      </div>
    </footer>
  );
};

