import React, { useState } from 'react';

type Character = {
  name: string;
  charaId: string;
  imgSrc: string;
  rank: string;
  isMax: boolean;
};

type Props = {
  onImport: (chars: Character[]) => void;
};

const ImportCharacters: React.FC<Props> = ({ onImport }) => {
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
};

export default ImportCharacters;
