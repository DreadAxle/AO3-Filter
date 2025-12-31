import React from 'react';

export const Header: React.FC = () => {
  return (
    <div className="text-center">
      <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
        AO3 Filter Generator
      </h1>
      <p className="mt-4 text-lg text-slate-400">
        Paste your Atom feed URLs to automatically generate a filter query.
      </p>
    </div>
  );
};