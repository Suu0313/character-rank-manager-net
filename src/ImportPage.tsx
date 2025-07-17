
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

  // ブックマークレット - Fixed container selector and rank extraction based on actual HTML structure
  const bookmarklet =
    `javascript:(async()=>{const i='ipId14',r=await fetch('https://new.chunithm-net.com/chuni-mobile/html/mobile/collection/characterList/',{credentials:'include'}),d=new DOMParser().parseFromString(await r.text(),'text/html'),c=[...d.querySelectorAll('div.box01[name^="'+i+'"]')].map(e=>{const n=e.querySelector('.character_name_block a')?.textContent.trim()||'',id=e.getAttribute('name')||'';if(id!=i&&!id.startsWith(i+'-'))return;const img=e.querySelector('.list_chara_img img')?.getAttribute('data-original')||'no_image.png',rk=[...e.querySelectorAll('.character_list_rank_num_block img')].map(x=>(x.getAttribute('src')||'').match(/num_s_lv_(\\d)\\.png/)?.[1]||"").join(""),mx=!!e.querySelector('.character_list_rank_max');return{name:n,charaId:id,imgSrc:img,rank:rk,isMax:mx}}).filter(Boolean),t=document.createElement('textarea');baseUrl='https://new.chunithm-net.com/chuni-mobile/html/mobile/img/';compressed=c.map(c=>[c.name,c.charaId,c.imgSrc.startsWith(baseUrl)?c.imgSrc.substring(baseUrl.length):c.imgSrc,c.rank,c.isMax?1:0]),compressedData=btoa(JSON.stringify(compressed)),url='https://Suu0313.github.io/character-rank-manager-net/import?data='+compressedData;if(compressedData.length>20000){const t=document.createElement('textarea');t.value=JSON.stringify(c,null,2);t.style='position:fixed;top:10px;left:10px;width:90vw;height:50vh;z-index:9999;';document.body.appendChild(t);setTimeout(()=>{t.select();t.setSelectionRange(0,t.value.length);},0);alert('データが大きすぎるため、手動でコピーしてください。 ' + compressedData.length);}else{window.open(url,'_blank');}})()`;

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
        ※CHUNITHM-NET にログインした状態で実行してください。データが圧縮され、自動的にこのページに遷移します。
      </p>
      <p style={{ fontSize: 12, color: '#666' }}>
        圧縮したデータが20000文字を超える場合のみ手動コピーになります。（エンコード方式を最適化し、データサイズを大幅削減しました）
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
            ✓ ブックマークレットからデータが自動的に読み込まれました！
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
