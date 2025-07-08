import React from 'react';
import { calculateRequiredExp, calculateTotalExpFromRank1 } from './utils';

type Character = {
  name: string;
  charaId: string;
  imgSrc: string;
  rank: string;
  isMax: boolean;
  _idx: number;
};

type Props = {
  characters: Character[];
  selected: { [id: number]: boolean };
  setSelected: React.Dispatch<React.SetStateAction<{ [id: number]: boolean }>>;
  customRanks: { [id: number]: string };
  setCustomRanks: React.Dispatch<React.SetStateAction<{ [id: number]: string }>>;
};


import { useState } from 'react';

const CharacterTable: React.FC<Props> = ({ characters, selected, setSelected, customRanks, setCustomRanks }) => {
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [dragSelecting, setDragSelecting] = useState<boolean | null>(null); // true: select, false: deselect

  // 範囲選択用
  const handleRowMouseDown = (idx: number, checked: boolean, e: React.MouseEvent) => {
    // 入力部クリック時は何もしない
    const tag = (e.target as HTMLElement).tagName;
    if (tag === 'INPUT' || tag === 'BUTTON' || tag === 'SELECT' || tag === 'TEXTAREA') return;

    setSelected(sel => ({ ...sel, [idx]: !sel[idx] }));
    setIsMouseDown(true);
    setDragSelecting(!checked); // ドラッグ開始時の状態
  };

  const handleRowMouseEnter = (idx: number) => {
    if (isMouseDown && dragSelecting !== null) {
      setSelected(sel => ({ ...sel, [idx]: dragSelecting }));
    }
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
    setDragSelecting(null);
  };

  React.useEffect(() => {
    if (isMouseDown) {
      window.addEventListener('mouseup', handleMouseUp);
      return () => window.removeEventListener('mouseup', handleMouseUp);
    }
  }, [isMouseDown]);

  return (
    <table style={{ borderCollapse: 'collapse', width: '100%' }}>
      <thead>
        <tr>
          <th style={{ border: '1px solid #ccc', padding: 4 }}>選択</th>
          <th style={{ border: '1px solid #ccc', padding: 4 }}>画像</th>
          <th style={{ border: '1px solid #ccc', padding: 4 }}>名前</th>
          <th style={{ border: '1px solid #ccc', padding: 4 }}>ランク</th>
          <th style={{ border: '1px solid #ccc', padding: 4 }}>限界</th>
          <th style={{ border: '1px solid #ccc', padding: 4 }}>目標RANK</th>
          <th style={{ border: '1px solid #ccc', padding: 4 }}>進捗</th>
          <th style={{ border: '1px solid #ccc', padding: 4 }}>必要経験値等</th>
        </tr>
      </thead>
      <tbody>
        {characters.map((chara) => {
          const originalRank = parseInt(chara.rank) || 0;
          const customRank = customRanks[chara._idx] ? parseInt(customRanks[chara._idx]) : originalRank;
          const { exp, statue, rainbow } = calculateRequiredExp(originalRank, customRank, chara.isMax);
          
          // 進捗計算：入力した目標ランクについて, ランク1から現在のランクまでの経験値合計/ランク1から目標ランクまでの経験値合計
          const currentExpFromRank1 = calculateTotalExpFromRank1(originalRank);
          const targetExpFromRank1 = calculateTotalExpFromRank1(customRank);
          const progress = targetExpFromRank1 > 0 ? (currentExpFromRank1 / targetExpFromRank1) * 100 : 0;
          
          return (
            <tr
              key={chara._idx}
              onMouseDown={e => handleRowMouseDown(chara._idx, !!selected[chara._idx], e)}
              onMouseEnter={() => handleRowMouseEnter(chara._idx)}
              style={{
                userSelect: 'none',
                background: selected[chara._idx] ? '#6f8bc1' : undefined,
                color: selected[chara._idx] ? '#000' : undefined
              }}
            >
              <td style={{ border: '1px solid #ccc', padding: 4, textAlign: 'center' }}>
                <input
                  type="checkbox"
                  checked={!!selected[chara._idx]}
                  onChange={e =>
                    setSelected(sel => ({
                      ...sel,
                      [chara._idx]: e.target.checked
                    }))
                  }
                  onClick={e => e.stopPropagation()}
                />
              </td>
              <td style={{ border: '1px solid #ccc', padding: 4 }}>
                {chara.imgSrc ? (
                  <img src={chara.imgSrc} alt={chara.name} style={{ height: 48 }} />
                ) : null}
              </td>
              <td style={{ border: '1px solid #ccc', padding: 4 }}>{chara.name}</td>
              <td style={{ border: '1px solid #ccc', padding: 4 }}>{chara.rank}</td>
              <td style={{ border: '1px solid #ccc', padding: 4 }}>{chara.isMax ? '★' : ''}</td>
              <td style={{ border: '1px solid #ccc', padding: 4 }}>
                <input
                  type="number"
                  min={originalRank}
                  max={200}
                  value={customRanks[chara._idx] ?? ''}
                  placeholder="目標RANK"
                  style={{ width: 60 }}
                  onChange={e => {
                    const v = e.target.value;
                    setCustomRanks(r => ({ ...r, [chara._idx]: v }));
                  }}
                  onClick={e => e.stopPropagation()}
                />
              </td>
              <td style={{ border: '1px solid #ccc', padding: 4, fontSize: 12 }}>
                {customRanks[chara._idx] && customRank > originalRank ? (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 11, marginBottom: 2 }}>
                      {progress.toFixed(1)}%
                    </div>
                    <div style={{ background: '#f0f0f0', height: 8, borderRadius: 4, overflow: 'hidden' }}>
                      <div 
                        style={{ 
                          background: '#4CAF50', 
                          height: '100%', 
                          width: `${Math.min(progress, 100)}%`,
                          transition: 'width 0.3s ease'
                        }}
                      />
                    </div>
                    <div style={{ fontSize: 9, color: '#666', marginTop: 1 }}>
                      {currentExpFromRank1.toLocaleString()}/{targetExpFromRank1.toLocaleString()}
                    </div>
                  </div>
                ) : null}
              </td>
              <td style={{ border: '1px solid #ccc', padding: 4, fontSize: 12 }}>
                {customRanks[chara._idx] ? (
                  <>
                    必要経験値: {exp.toLocaleString()}<br />
                    スタチュウ: {statue.toLocaleString()}個<br />
                    虹スタチュウ: {rainbow.toLocaleString()}個
                  </>
                ) : null}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default CharacterTable;
