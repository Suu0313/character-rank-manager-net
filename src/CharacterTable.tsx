import React from 'react';
import { calculateRequiredExp } from './utils';

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

const CharacterTable: React.FC<Props> = ({ characters, selected, setSelected, customRanks, setCustomRanks }) => {
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
          <th style={{ border: '1px solid #ccc', padding: 4 }}>必要経験値等</th>
        </tr>
      </thead>
      <tbody>
        {characters.map((chara) => {
          const originalRank = parseInt(chara.rank) || 0;
          const customRank = customRanks[chara._idx] ? parseInt(customRanks[chara._idx]) : originalRank;
          const { exp, statue, rainbow } = calculateRequiredExp(originalRank, customRank, chara.isMax);
          return (
            <tr key={chara._idx}>
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
                />
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
