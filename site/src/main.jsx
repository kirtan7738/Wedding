import { createRoot, hydrateRoot } from 'react-dom/client';
import './styles/base.css';
import App from './App.jsx';

const root = document.getElementById('root');
if (root.firstElementChild) hydrateRoot(root, <App />);
else createRoot(root).render(<App />);

// Tells the inline fail-safe in index.html that the app booted (spec §6.1: content visible by default).
window.__booted = true;

if (new URLSearchParams(location.search).has('tune')) import('./dev/tune.js').then((m) => m.startTune());
