
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import ReferencePage from './ReferencePage';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import ImportPage from './ImportPage';

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
