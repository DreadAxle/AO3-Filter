import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const DEFAULT_BASE = '/';
const GITHUB_PAGES_BASE = '/AO3-Filter/';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const baseFromEnv = process.env.VITE_BASE?.trim();

  return {
    base: baseFromEnv || (mode === 'github' ? GITHUB_PAGES_BASE : DEFAULT_BASE),
    plugins: [react()],
  };
});
