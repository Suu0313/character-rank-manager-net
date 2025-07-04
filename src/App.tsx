import  { useEffect, useState } from 'react';
import './App.css';

type Character = {
  name: string;
  charaId: string;
  imgSrc: string;
  rank: string;
  isMax: boolean;
};

function App() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [showImport, setShowImport] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem('chuni_characters');
    console.log('Loaded characters from localStorage:', data);
    if (data) {
      try {
        setCharacters(JSON.parse(data));
      } catch (e) {
        setCharacters([]);
      }
    }
  }, []);

  const bookmarklet =
    `javascript:(async()=>{const i='ipId14',r=await fetch('https://new.chunithm-net.com/chuni-mobile/html/mobile/collection/characterList/',{credentials:'include'}),d=new DOMParser().parseFromString(await r.text(),'text/html'),c=[...d.querySelectorAll('div.box01[name^="'+i+'"]')].map(e=>{const n=e.querySelector('.character_name_block a')?.textContent.trim()||'',id=e.getAttribute('name')||'';if(id!=i&&!id.startsWith(i+'-'))return;const img=e.querySelector('.list_chara_img img')?.getAttribute('data-original')||'no_image.png',rk=[...e.querySelectorAll('.character_list_rank_num_block img')].map(x=>(x.getAttribute('src')||'').match(/num_s_lv_(\\d)\\.png/)?.[1]||"").join(""),mx=!!e.querySelector('.character_list_rank_max');return{name:n,charaId:id,imgSrc:img,rank:rk,isMax:mx}}).filter(Boolean),t=document.createElement('textarea');t.value=JSON.stringify(c,null,2);t.style='position:fixed;top:10px;left:10px;width:90vw;height:50vh;z-index:9999;';document.body.appendChild(t);t.select();alert('キャラクター情報をテキストエリアに出力しました。全選択→コピーしてツールに貼り付けてください。');})();`;
  return (
    <div style={{ padding: 24 }}>
      <h1>CHUNITHM キャラクター一覧</h1>
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: '1.1em' }}>キャラクター情報保存用ブックマークレット</h2>
        <div style={{ marginTop: 8 }}>
          <textarea
            value={bookmarklet}
            readOnly
            style={{ width: '100%', minHeight: 80, fontSize: 12 }}
            onFocus={e => e.target.select()}
          />
        </div>
        <p style={{ fontSize: 12, color: '#888' }}>
          ※CHUNITHM-NET にログインした状態で実行してください。
        </p>
      </section>
      {characters.length === 0 ? (
        <ImportCharacters onImport={setCharacters} />
      ) : (
        <>
          <div style={{ marginBottom: 24, display: 'flex', gap: 12 }}>
            <button onClick={() => setShowImport(true)} style={{ padding: '6px 16px' }}>
              再インポート・上書き
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('chuni_characters');
                setCharacters([]);
                setShowImport(false);
              }}
              style={{ padding: '6px 16px', background: '#fdd', border: '1px solid #f99', color: '#900' }}
            >
              削除（リセット）
            </button>
          </div>
          {showImport ? (
            <ImportCharacters
              onImport={chars => {
                setCharacters(chars);
                setShowImport(false);
              }}
            />
          ) : null}
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ccc', padding: 4 }}>画像</th>
                <th style={{ border: '1px solid #ccc', padding: 4 }}>名前</th>
                <th style={{ border: '1px solid #ccc', padding: 4 }}>ランク</th>
                <th style={{ border: '1px solid #ccc', padding: 4 }}>限界</th>
              </tr>
            </thead>
            <tbody>
              {characters.map((chara, idx) => (
                <tr key={idx}>
                  <td style={{ border: '1px solid #ccc', padding: 4 }}>
                    {chara.imgSrc ? (
                      <img src={chara.imgSrc} alt={chara.name} style={{ height: 48 }} />
                    ) : null}
                  </td>
                  <td style={{ border: '1px solid #ccc', padding: 4 }}>{chara.name}</td>
                  <td style={{ border: '1px solid #ccc', padding: 4 }}>{chara.rank}</td>
                  <td style={{ border: '1px solid #ccc', padding: 4 }}>{chara.isMax ? '★' : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

// インポート用コンポーネントはAppの外に定義
function ImportCharacters({ onImport }: { onImport: (chars: Character[]) => void }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const handleImport = () => {
    try {
      const chars = JSON.parse(input);
      if (!Array.isArray(chars)) throw new Error('配列ではありません');
      onImport(chars);
      localStorage.setItem('chuni_characters', JSON.stringify(chars));
      setError('');
    } catch (e) {
      setError('JSONの形式が正しくありません');
    }
  };

  return (
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
  );
}

export default App
