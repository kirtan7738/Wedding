import { createRoot, hydrateRoot } from 'react-dom/client';
import './styles/base.css';
import App from './App.jsx';
import wedding, { setLang, storedLang } from './content/wedding.js';

// The page is prerendered in Gujarati. A guest who chose English before gets a fresh client render in English;
// everyone else hydrates the prerendered page.
const lang = storedLang();
if (lang) {
  setLang(lang);
  document.title = wedding.og.title;
}
const root = document.getElementById('root');
if (root.firstElementChild && lang !== 'en') hydrateRoot(root, <App initialLang={lang} />);
else createRoot(root).render(<App initialLang={lang} />);
document.documentElement.classList.add('booted');

// Tells the inline fail-safe in index.html that the app booted (spec §6.1: content visible by default).
window.__booted = true;

if (new URLSearchParams(location.search).has('tune')) import('./dev/tune.js').then((m) => m.startTune());
