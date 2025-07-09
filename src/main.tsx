
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import ReferencePage from './ReferencePage';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import ImportPage from './ImportPage';

// Single Page Apps for GitHub Pages
// Handle redirected routes from 404.html
(function(l) {
  if (l.search[1] === '/' ) {
    const decoded = l.search.slice(1).split('&').map(function(s) { 
      return s.replace(/~and~/g, '&')
    }).join('?');
    window.history.replaceState(null, '',
        l.pathname.slice(0, -1) + decoded + l.hash
    );
  }
}(window.location));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <nav style={{ textAlign: 'center', margin: '1em 0' }}>
        <Link to="/character-rank-manager-net/" style={{ marginRight: 16 }}>ホーム</Link>
        <Link to="/character-rank-manager-net/import" style={{ marginRight: 16 }}>インポート</Link>
        <Link to="/character-rank-manager-net/reference">参考情報</Link>
      </nav>
      <Routes>
        <Route path="/character-rank-manager-net/" element={<App />} />
        <Route path="/character-rank-manager-net/import" element={<ImportPage />} />
        <Route path="/character-rank-manager-net/reference" element={<ReferencePage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
