import  { useEffect, useState } from 'react';
import './App.css';

type Character = {
  id: string;
  name: string;
  rarity: string;
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
    `javascript:(async function(){\n  const res = await fetch('https://new.chunithm-net.com/chuni-mobile/html/mobile/collection/characterList/', {credentials:'include'});\n  const html = await res.text();\n  const doc = new DOMParser().parseFromString(html, 'text/html');\n  const chars = Array.from(doc.querySelectorAll('.character_list_block')).map(box => ({\n    id: box.querySelector('.list_chara_img img.lazy')?.getAttribute('data-original') || '',\n    name: box.querySelector('.character_name_block a')?.textContent?.trim() || '',\n    rarity: ''\n  }));\n  const json = JSON.stringify(chars, null, 2);\n  let textarea = document.createElement('textarea');\n  textarea.value = json;\n  textarea.style.position = 'fixed';\n  textarea.style.top = '10px';\n  textarea.style.left = '10px';\n  textarea.style.width = '90vw';\n  textarea.style.height = '50vh';\n  textarea.style.zIndex = 9999;\n  document.body.appendChild(textarea);\n  textarea.select();\n  alert('キャラクター情報をテキストエリアに出力しました。全選択→コピーしてReactアプリに貼り付けてください。');\n})();`;
  return (
    <div style={{ padding: 24 }}>
      <h1>CHUNITHM キャラクター一覧</h1>
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: '1.1em' }}>キャラクター情報保存用ブックマークレット</h2>
        <p>下記コードをブックマークバーにドラッグ、または右クリックで「リンクをブックマーク」に追加してください。</p>
        <a
          href={bookmarklet}
          style={{
            display: 'inline-block',
            background: '#f5f5f5',
            border: '1px solid #ccc',
            padding: '6px 12px',
            borderRadius: 4,
            color: '#333',
            textDecoration: 'none',
            marginBottom: 8,
            fontWeight: 'bold',
          }}
        >
          CHUNITHMキャラ保存
        </a>
        <div style={{ marginTop: 8 }}>
          <textarea
            value={bookmarklet}
            readOnly
            style={{ width: '100%', minHeight: 80, fontSize: 12 }}
            onFocus={e => e.target.select()}
          />
        </div>
        <p style={{ fontSize: 12, color: '#888' }}>
          ※キャラクター一覧ページにログインした状態で実行してください。
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
                <th style={{ border: '1px solid #ccc', padding: 4 }}>レアリティ</th>
              </tr>
            </thead>
            <tbody>
              {characters.map((chara, idx) => (
                <tr key={idx}>
                  <td style={{ border: '1px solid #ccc', padding: 4 }}>
                    {chara.id ? (
                      <img src={chara.id} alt={chara.name} style={{ height: 48 }} />
                    ) : null}
                  </td>
                  <td style={{ border: '1px solid #ccc', padding: 4 }}>{chara.name}</td>
                  <td style={{ border: '1px solid #ccc', padding: 4 }}>{chara.rarity}</td>
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
