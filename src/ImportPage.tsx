
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
    `javascript:(async()=>{const i='ipId14',r=await fetch('https://new.chunithm-net.com/chuni-mobile/html/mobile/collection/characterList/',{credentials:'include'}),d=new DOMParser().parseFromString(await r.text(),'text/html'),c=[...d.querySelectorAll('div.box01[name^="'+i+'"]')].map(e=>{const n=e.querySelector('.character_name_block a')?.textContent.trim()||'',id=e.getAttribute('name')||'';if(id!=i&&!id.startsWith(i+'-'))return;const img=e.querySelector('.list_chara_img img')?.getAttribute('data-original')||'no_image.png',rk=[...e.querySelectorAll('.character_list_rank_num_block img')].map(x=>(x.getAttribute('src')||'').match(/num_s_lv_(\\d)\\.png/)?.[1]||"").join(""),mx=!!e.querySelector('.character_list_rank_max');return{name:n,charaId:id,imgSrc:img,rank:rk,isMax:mx}}).filter(Boolean);const baseUrl='https://new.chunithm-net.com/chuni-mobile/html/mobile/img/',compressed=c.map(c=>[c.name,c.charaId,c.imgSrc.startsWith(baseUrl)?c.imgSrc.substring(baseUrl.length):c.imgSrc,c.rank,c.isMax?1:0]);function lzCompress(t){const o="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$";let n=String.fromCharCode,e={},r={},s="",a="",u="",c=2,f=3,h=2,d=[],l=0,p=0;if(null==t)return"";for(let g=0;g<t.length;g++){if(s=t.charAt(g),Object.prototype.hasOwnProperty.call(e,s)||(e[s]=f++,r[s]=!0),a=u+s,Object.prototype.hasOwnProperty.call(e,a))u=a;else{if(Object.prototype.hasOwnProperty.call(r,u)){if(u.charCodeAt(0)<256){for(let m=0;m<h;m++)l<<=1,p==5?(p=0,d.push(o.charAt(l)),l=0):p++;for(let v=u.charCodeAt(0),m=0;m<8;m++)l=l<<1|1&v,p==5?(p=0,d.push(o.charAt(l)),l=0):p++,v>>=1}else{for(let y=1,m=0;m<h;m++)l=l<<1|y,p==5?(p=0,d.push(o.charAt(l)),l=0):p++,y=0;for(let b=u.charCodeAt(0),m=0;m<16;m++)l=l<<1|1&b,p==5?(p=0,d.push(o.charAt(l)),l=0):p++,b>>=1}0==--c&&(c=Math.pow(2,h),h++),delete r[u]}else for(let w=e[u],m=0;m<h;m++)l=l<<1|1&w,p==5?(p=0,d.push(o.charAt(l)),l=0):p++,w>>=1;0==--c&&(c=Math.pow(2,h),h++),e[a]=f++,u=String(s)}}if(""!==u){if(Object.prototype.hasOwnProperty.call(r,u)){if(u.charCodeAt(0)<256){for(let x=0;x<h;x++)l<<=1,p==5?(p=0,d.push(o.charAt(l)),l=0):p++;for(let k=u.charCodeAt(0),x=0;x<8;x++)l=l<<1|1&k,p==5?(p=0,d.push(o.charAt(l)),l=0):p++,k>>=1}else{for(let j=1,x=0;x<h;x++)l=l<<1|j,p==5?(p=0,d.push(o.charAt(l)),l=0):p++,j=0;for(let O=u.charCodeAt(0),x=0;x<16;x++)l=l<<1|1&O,p==5?(p=0,d.push(o.charAt(l)),l=0):p++,O>>=1}0==--c&&(c=Math.pow(2,h),h++),delete r[u]}else for(let P=e[u],x=0;x<h;x++)l=l<<1|1&P,p==5?(p=0,d.push(o.charAt(l)),l=0):p++,P>>=1;0==--c&&(c=Math.pow(2,h),h++)}for(let S=2,x=0;x<h;x++)l=l<<1|1&S,p==5?(p=0,d.push(o.charAt(l)),l=0):p++,S>>=1;for(;;){if(l<<=1,p==5){d.push(o.charAt(l));break}p++}return d.join("")}const compressedData=lzCompress(JSON.stringify(compressed)),url='https://Suu0313.github.io/character-rank-manager-net/import?data='+compressedData;compressedData.length>20000?(()=>{const t=document.createElement('textarea');t.value=JSON.stringify(c,null,2),t.style='position:fixed;top:10px;left:10px;width:90vw;height:50vh;z-index:9999;',document.body.appendChild(t),setTimeout(()=>{t.select(),t.setSelectionRange(0,t.value.length)},0),alert('データが大きすぎるため、手動でコピーしてください。 '+compressedData.length+' 文字')})():window.open(url,'_blank')})()`;

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
        ※CHUNITHM-NET にログインした状態で実行してください。データがLZ-string圧縮され、自動的にこのページに遷移します。
      </p>
      <p style={{ fontSize: 12, color: '#666' }}>
        圧縮したデータが20000文字を超える場合のみ手動コピーになります。（LZ-stringアルゴリズムによる高効率圧縮を採用）
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
