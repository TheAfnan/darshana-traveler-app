import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Import global styles
import 'leaflet/dist/leaflet.css'; // Import Leaflet map styles
import './i18n'; // Initialize i18n before rendering
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

;(async () => {
  // Expose React on window for modules compiled expecting a global `React` identifier
  try {
    (window as any).React = React;
  } catch (e) {
    // ignore in non-browser environments
  }
  try {
    const mod = await import('./App');
    const App = mod.default;
    root.render(
      <React.StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </React.StrictMode>
    );
  } catch (err) {
    console.error('Failed to load App:', err);
    root.render(
      <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
        <h1 style={{ color: 'red' }}>Failed to load App</h1>
        <pre>{String(err)}</pre>
      </div>
    );
  }
})();