
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { decompressData, decompressCharacterData } from './utils';

const ImportPage: React.FC = () => {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [autoImported, setAutoImported] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check for query parameters on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const compressedData = urlParams.get('data');
    
    if (compressedData && !autoImported) {
      try {
        // Try new compressed format first
        const characterData = decompressCharacterData(compressedData);
        if (characterData && characterData.length > 0) {
          setInput(JSON.stringify(characterData, null, 2));
          setAutoImported(true);
          // Clear the URL parameters for cleaner UI
          const newUrl = location.pathname;
          window.history.replaceState({}, '', newUrl);
        } else {
          // Fallback to old format
          const decompressedData = decompressData(compressedData);
          if (decompressedData) {
            setInput(decompressedData);
            setAutoImported(true);
            // Clear the URL parameters for cleaner UI
            const newUrl = location.pathname;
            window.history.replaceState({}, '', newUrl);
          }
        }
      } catch (err) {
        console.error('Failed to decompress query parameter data:', err);
        setError('URLパラメータからのデータ読み込みに失敗しました');
      }
    }
  }, [location.search, location.pathname, autoImported]);

  const handleImport = () => {
    try {
      const chars = JSON.parse(input);
      if (!Array.isArray(chars)) throw new Error('配列ではありません');
      localStorage.setItem('chuni_characters', JSON.stringify(chars));
      setError('');
      navigate('/character-rank-manager-net/');
    } catch {
      setError('JSONの形式が正しくありません');
    }
  };


  // ブックマークレット - 外部スクリプトを読み込む短縮版
  const bookmarklet = 
    `javascript:(()=>{const s=document.createElement("script");s.src="https://Suu0313.github.io/character-rank-manager-net/chunithm-import.js";document.body.appendChild(s);})()`;

  // 手動用ブックマークレット - 外部スクリプトを読み込む短縮版（手動コピー専用）
  const bookmarkletManual = 
    `javascript:(()=>{const s=document.createElement("script");s.src="https://Suu0313.github.io/character-rank-manager-net/chunithm-import-manual.js";document.body.appendChild(s);})()`;
  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontSize: '1.1em' }}>キャラクター情報保存用ブックマークレット</h2>
      <div style={{ marginTop: 8 }}>
        <textarea
          value={bookmarklet}
          readOnly
          style={{ width: '100%', minHeight: 80, fontSize: 12 }}
          onFocus={e => setTimeout(() => { e.target.select(); e.target.setSelectionRange(0, e.target.value.length) }, 0)}
        />
      </div>
      <p style={{ fontSize: 12, color: '#888' }}>
        ※CHUNITHM-NET にログインした状態で実行してください。自動的にこのページに遷移します。
      </p>
      <p style={{ fontSize: 12, color: '#666' }}>
        圧縮したデータが20000文字を超える場合のみ手動コピーになります。
      </p>
      <p>
        <a
          href="https://new.chunithm-net.com/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#007acc', textDecoration: 'underline' }}
        >
          CHUNITHM-NET を開く
        </a>
      </p>
      
      {/* 手動用ブックマークレット */}
      <details style={{ marginTop: 16, marginBottom: 16 }}>
        <summary style={{ cursor: 'pointer', fontSize: '14px', color: '#666', userSelect: 'none' }}>
          上のブックマークレットが上手く動かない人はこちら
        </summary>
        <div style={{ marginTop: 12, padding: '12px', background: '#f9f9f9', border: '1px solid #ddd', borderRadius: '4px' }}>
          <h3 style={{ fontSize: '1em', marginTop: 0, marginBottom: 8 }}>手動コピー専用ブックマークレット</h3>
          <textarea
            value={bookmarkletManual}
            readOnly
            style={{ width: '100%', minHeight: 80, fontSize: 12 }}
            onFocus={e => setTimeout(() => { e.target.select(); e.target.setSelectionRange(0, e.target.value.length) }, 0)}
          />
          <p style={{ fontSize: 12, color: '#666', marginTop: 8, marginBottom: 0 }}>
            ※このブックマークレットは自動遷移せず、手動でのコピー＆ペーストが必要です。
          </p>
        </div>
      </details>
      
      <div style={{ margin: '32px 0' }}>
        <h2>キャラクター情報インポート</h2>
        {autoImported && (
          <div style={{ 
            background: '#e8f5e8', 
            border: '1px solid #4CAF50', 
            padding: '8px 12px', 
            borderRadius: '4px',
            marginBottom: '16px',
            color: '#2e7d32'
          }}>
            ✓ データが読み込まれました。インポートボタンをクリックしてください。
          </div>
        )}
        <p>ブックマークレットで出力されたJSONをここに貼り付けてください。</p>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          style={{ width: '100%', minHeight: 120, fontSize: 12 }}
          placeholder="ここにJSONを貼り付け"
        />
        <div>
          <button onClick={handleImport} style={{ marginTop: 8, padding: '6px 16px' }}>インポート</button>
        </div>
        {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      </div>
      <div style={{ marginBottom: 24, display: 'flex', gap: 12 }}>
        <button
          onClick={() => {
            if (window.confirm('本当に削除（リセット）しますか？この操作は元に戻せません。')) {
              localStorage.removeItem('chuni_characters');
            }
          }}
          style={{ padding: '6px 16px', background: '#fdd', border: '1px solid #f99', color: '#900' }}
        >
          削除（リセット）
        </button>
      </div>
    </div>
  );
};

export default ImportPage;
