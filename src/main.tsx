
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import ReferencePage from './ReferencePage';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <nav style={{ textAlign: 'center', margin: '1em 0' }}>
        <Link to="/" style={{ marginRight: 16 }}>ホーム</Link>
        <Link to="/reference">参考情報</Link>
      </nav>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/reference" element={<ReferencePage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
