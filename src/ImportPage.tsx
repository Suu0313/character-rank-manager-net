
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { decompressData, decompressCharacterData, compareCharacterArrays } from './utils';
import type { ComparisonResult } from './utils';

const ImportPage: React.FC = () => {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [autoImported, setAutoImported] = useState(false);
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleInputChange = React.useCallback((value: string) => {
    setInput(value);
    
    // Clear previous comparison when input changes
    setComparisonResult(null);
    
    // Try to parse the new input and compare with existing data
    if (value.trim()) {
      try {
        const newChars = JSON.parse(value);
        if (Array.isArray(newChars)) {
          // Get current stored characters
          const currentData = localStorage.getItem('chuni_characters');
          if (currentData) {
            const currentChars = JSON.parse(currentData);
            if (Array.isArray(currentChars)) {
              const comparison = compareCharacterArrays(currentChars, newChars);
              setComparisonResult(comparison);
            }
          }
        }
      } catch {
        // Ignore parsing errors for incomplete input
      }
    }
  }, []);

  // Check for query parameters on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const compressedData = urlParams.get('data');
    
    if (compressedData && !autoImported) {
      try {
        // Try new compressed format first
        const characterData = decompressCharacterData(compressedData);
        if (characterData && characterData.length > 0) {
          const jsonString = JSON.stringify(characterData, null, 2);
          setInput(jsonString);
          handleInputChange(jsonString); // Trigger comparison
          setAutoImported(true);
          // Clear the URL parameters for cleaner UI
          const newUrl = location.pathname;
          window.history.replaceState({}, '', newUrl);
        } else {
          // Fallback to old format
          const decompressedData = decompressData(compressedData);
          if (decompressedData) {
            setInput(decompressedData);
            handleInputChange(decompressedData); // Trigger comparison
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
  }, [location.search, location.pathname, autoImported, handleInputChange]);

  const handleImport = () => {
    try {
      const chars = JSON.parse(input);
      if (!Array.isArray(chars)) throw new Error('配列ではありません');
      localStorage.setItem('chuni_characters', JSON.stringify(chars));
      setError('');
      setComparisonResult(null); // Clear comparison result after successful import
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
          onChange={e => handleInputChange(e.target.value)}
          style={{ width: '100%', minHeight: 120, fontSize: 12 }}
          placeholder="ここにJSONを貼り付け"
        />
        
        {/* Comparison Result Display */}
        {comparisonResult && (
          <div style={{ 
            marginTop: '16px', 
            padding: '12px', 
            border: '1px solid #ddd', 
            borderRadius: '4px',
            background: '#f9f9f9' 
          }}>
            <h3 style={{ marginTop: 0, marginBottom: '8px', fontSize: '14px' }}>インポート差分</h3>
            
            {!comparisonResult.canCompare ? (
              <div style={{ 
                padding: '8px 12px', 
                background: '#fff3cd', 
                border: '1px solid #ffeaa7', 
                borderRadius: '4px',
                color: '#856404'
              }}>
                <strong>新規獲得キャラクターがいます</strong>
                <br />
                現在: {comparisonResult.oldLength}体 → インポート後: {comparisonResult.newLength}体
                <br />
                詳細な差分は表示されません。
              </div>
            ) : (
              <div>
                <div style={{ 
                  padding: '8px 12px', 
                  background: '#d1ecf1', 
                  border: '1px solid #bee5eb', 
                  borderRadius: '4px',
                  color: '#0c5460',
                  marginBottom: '8px'
                }}>
                  キャラクター数が同じです（{comparisonResult.newLength}体）。ランク変更を確認できます。
                </div>
                
                {comparisonResult.differences.filter(diff => diff.hasChanged).length === 0 ? (
                  <div style={{ 
                    padding: '8px', 
                    color: '#666', 
                    fontStyle: 'italic' 
                  }}>
                    ランクに変更はありません。
                  </div>
                ) : (
                  <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ background: '#e9ecef' }}>
                          <th style={{ border: '1px solid #ccc', padding: '4px', textAlign: 'left' }}>キャラクター名</th>
                          <th style={{ border: '1px solid #ccc', padding: '4px', textAlign: 'center' }}>変更前</th>
                          <th style={{ border: '1px solid #ccc', padding: '4px', textAlign: 'center' }}>変更後</th>
                          <th style={{ border: '1px solid #ccc', padding: '4px', textAlign: 'center' }}>限界</th>
                        </tr>
                      </thead>
                      <tbody>
                        {comparisonResult.differences
                          .filter(diff => diff.hasChanged)
                          .map((diff, index) => (
                            <tr key={index} style={{ background: '#fff' }}>
                              <td style={{ border: '1px solid #ccc', padding: '4px' }}>{diff.name}</td>
                              <td style={{ border: '1px solid #ccc', padding: '4px', textAlign: 'center' }}>{diff.oldRank}</td>
                              <td style={{ border: '1px solid #ccc', padding: '4px', textAlign: 'center', background: '#d4edda' }}>{diff.newRank}</td>
                              <td style={{ border: '1px solid #ccc', padding: '4px', textAlign: 'center' }}>{diff.isMax ? '★' : ''}</td>
                            </tr>
                          ))
                        }
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        
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
