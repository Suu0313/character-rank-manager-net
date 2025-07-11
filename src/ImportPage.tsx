
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

const ImportPage: React.FC = () => {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

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

  // ブックマークレット
  const bookmarklet =
    `javascript:(async()=>{const i='ipId14',r=await fetch('https://new.chunithm-net.com/chuni-mobile/html/mobile/collection/characterList/',{credentials:'include'}),d=new DOMParser().parseFromString(await r.text(),'text/html'),c=[...d.querySelectorAll('div.box01[name^="'+i+'"]')].map(e=>{const n=e.querySelector('.character_name_block a')?.textContent.trim()||'',id=e.getAttribute('name')||'';if(id!=i&&!id.startsWith(i+'-'))return;const img=e.querySelector('.list_chara_img img')?.getAttribute('data-original')||'no_image.png',rk=[...e.querySelectorAll('.character_list_rank_num_block img')].map(x=>(x.getAttribute('src')||'').match(/num_s_lv_(\\d)\\.png/)?.[1]||"").join(""),mx=!!e.querySelector('.character_list_rank_max');return{name:n,charaId:id,imgSrc:img,rank:rk,isMax:mx}}).filter(Boolean),t=document.createElement('textarea');t.value=JSON.stringify(c,null,2);t.style='position:fixed;top:10px;left:10px;width:90vw;height:50vh;z-index:9999;';document.body.appendChild(t);setTimeout(()=>{t.select();t.setSelectionRange(0,t.value.length);},0);alert('キャラクター情報をテキストエリアに出力しました。全選択→コピーしてツールに貼り付けてください。');})();`;

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
        ※CHUNITHM-NET にログインした状態で実行してください。
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
