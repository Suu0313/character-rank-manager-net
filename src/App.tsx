import  { useEffect, useState } from 'react';
import './App.css';
import CharacterTable from './CharacterTable';
import { calculateRequiredExp, irodorimidoriCharacters } from './utils';

type Character = {
  name: string;
  charaId: string;
  imgSrc: string;
  rank: string;
  isMax: boolean;
};

function App() {
  const [characters, setCharacters] = useState<Character[]>([]);
  // const [showImport, setShowImport] = useState(false); // ImportPage移行で不要
  // 追加: 選択状態・フィルタ・選択のみ表示
  const [selected, setSelected] = useState<{ [id: number]: boolean }>({});
  // 目標ランク入力値
  const [customRanks, setCustomRanks] = useState<{ [id: number]: string }>({});
  const [filter, setFilter] = useState('');
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);
  const [selectedLocked, setSelectedLocked] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem('chuni_characters');
    if (data) {
      try {
        setCharacters(JSON.parse(data));
      } catch (e) {
        setCharacters([]);
      }
    }
  }, []);

  // indexをキーに使う
  // フィルタ適用
  const filtered = characters
    .map((c, idx) => ({ ...c, _idx: idx }))
    .filter(
      c =>
        (!showSelectedOnly || selected[c._idx] === true) &&
        c.name.toLowerCase().includes(filter.toLowerCase())
    );

  // 合計ランク計算（rankはstringなので数値化）
  const selectedChars = characters
    .map((c, idx) => ({ ...c, _idx: idx }))
    .filter(c => selected[c._idx]);
  const totalRank = selectedChars.reduce((sum, c) => sum + (parseInt(c.rank) || 0), 0);
  const totalCustomRank = selectedChars.reduce((sum, c) => {
    const originalRank = parseInt(c.rank) || 0;
    const customRank = customRanks[c._idx] ? parseInt(customRanks[c._idx]) : originalRank;
    return sum + customRank;
  }, 0);

  // 合計必要経験値・スタチュウ・虹スタチュウ
  let totalExp = 0, totalStatue = 0, totalRainbow = 0;
  selectedChars.forEach(c => {
    const originalRank = parseInt(c.rank) || 0;
    const customRank = customRanks[c._idx] ? parseInt(customRanks[c._idx]) : originalRank;
    const { exp, statue, rainbow } = calculateRequiredExp(originalRank, customRank, c.isMax);
    totalExp += exp;
    totalStatue += statue;
    totalRainbow += rainbow;
  });

  return (
    <div style={{ padding: 24 }}>
      <h1>Character Rank Manager</h1>
      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
        <input
          type="text"
          value={filter}
          onChange={e => setFilter(e.target.value)}
          placeholder="名前でフィルタ"
          style={{ padding: 4, flex: 1 }}
          list="irodori-list"
        />
        <datalist id="irodori-list">
          {irodorimidoriCharacters.map(name => (
            <option value={name} key={name} />
          ))}
        </datalist>
        <button
          onClick={() => setShowSelectedOnly(v => !v)}
          style={{
            padding: '4px 12px',
            background: showSelectedOnly ? '#b3c6e8' : undefined, // CharacterTableと同じ色
            color: showSelectedOnly ? '#222' : undefined,
            border: '1px solid #99c'
          }}
        >
          {showSelectedOnly ? '全キャラ表示' : '選択中のみ表示'}
        </button>
        <button
          onClick={() => setSelectedLocked(v => !v)}
          style={{
            padding: '4px 12px',
            background: selectedLocked ? '#b3c6e8' : undefined,
            color: selectedLocked ? '#222' : undefined,
            border: '1px solid #99c'
          }}
        >
          {selectedLocked ? '選択ロック中' : '選択ロック'}
        </button>
      </div>
      <div style={{ marginBottom: 8 }}>
        <b>選択キャラ合計ランク: {totalRank}（目標: {totalCustomRank}）</b>
      </div>
      <div style={{ marginBottom: 16, fontSize: 14 }}>
        <b>合計 必要経験値: {totalExp.toLocaleString()} / スタチュウ: {totalStatue.toLocaleString()}個 / 虹スタチュウ: {totalRainbow.toLocaleString()}個</b>
      </div>
      <CharacterTable
        characters={filtered}
        selected={selected}
        setSelected={selectedLocked ? () => {} : setSelected}
        customRanks={customRanks}
        setCustomRanks={setCustomRanks}
      />
    </div>
  );
}

export default App
