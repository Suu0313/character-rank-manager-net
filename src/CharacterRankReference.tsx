
import React, { useState } from "react";
import "./App.css";
import { expTable, calculateRequiredExp } from "./utils";

const CharacterRankReference: React.FC = () => {
  const [fromRank, setFromRank] = useState(1);
  const [toRank, setToRank] = useState(10);

  const result = fromRank >= toRank
    ? { exp: 0, statue: 0, rainbow: 0 }
    : calculateRequiredExp(fromRank, toRank, true);

  return (
    <div style={{ maxWidth: 900, margin: "2em auto" }}>
    <h2>合計キャラランク・対象キャラクター（イロドリミドリ）</h2>
    <div style={{ overflowX: "auto" }}>
      <table style={{ borderCollapse: "collapse", margin: "2em auto" }}>
        <caption style={{ fontSize: "1.2em", marginBottom: "1em" }}>必要な合計キャラランク</caption>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ccc", padding: "0.5em 1em", background: "#333", color: "#fff" }}>キャラクター名</th>
            <th style={{ border: "1px solid #ccc", padding: "0.5em 1em", background: "#333", color: "#fff" }}>対象人数</th>
            <th style={{ border: "1px solid #ccc", padding: "0.5em 1em", background: "#333", color: "#fff" }}>ゴールド称号</th>
            <th style={{ border: "1px solid #ccc", padding: "0.5em 1em", background: "#333", color: "#fff" }}>プラチナ称号</th>
            <th style={{ border: "1px solid #ccc", padding: "0.5em 1em", background: "#333", color: "#fff" }}>フェニックスドレス</th>
          </tr>
        </thead>
        <tbody>
          <tr><td style={{ border: "1px solid #ccc", padding: "0.5em 1em" }}>明坂 芹菜</td><td>10</td><td>350</td><td>525</td><td>700</td></tr>
          <tr><td style={{ border: "1px solid #ccc", padding: "0.5em 1em" }}>御形 アリシアナ</td><td>10</td><td>350</td><td>525</td><td>700</td></tr>
          <tr><td style={{ border: "1px solid #ccc", padding: "0.5em 1em" }}>天王洲 なずな</td><td>10</td><td>350</td><td>525</td><td>700</td></tr>
          <tr><td style={{ border: "1px solid #ccc", padding: "0.5em 1em" }}>小仏 凪</td><td>10</td><td>350</td><td>525</td><td>700</td></tr>
          <tr><td style={{ border: "1px solid #ccc", padding: "0.5em 1em" }}>箱部 なる</td><td>10</td><td>350</td><td>525</td><td>700</td></tr>
          <tr><td style={{ border: "1px solid #ccc", padding: "0.5em 1em" }}>月鈴 那知</td><td>3</td><td>162</td><td>243</td><td>324</td></tr>
          <tr><td style={{ border: "1px solid #ccc", padding: "0.5em 1em" }}>月鈴 白奈</td><td>9</td><td>326</td><td>489</td><td>652</td></tr>
          <tr><td style={{ border: "1px solid #ccc", padding: "0.5em 1em" }}>五十嵐 撫子</td><td>5</td><td>224</td><td>336</td><td>448</td></tr>
          <tr><td style={{ border: "1px solid #ccc", padding: "0.5em 1em" }}>萩原 七々瀬</td><td>5</td><td>224</td><td>336</td><td>448</td></tr>
          <tr><td style={{ border: "1px solid #ccc", padding: "0.5em 1em" }}>葛城 華</td><td>4</td><td>194</td><td>291</td><td>388</td></tr>
          <tr><td style={{ border: "1px solid #ccc", padding: "0.5em 1em" }}>小野 美苗</td><td>4</td><td>194</td><td>291</td><td>388</td></tr>
          <tr><td style={{ border: "1px solid #ccc", padding: "0.5em 1em" }}>藤堂 陽南袴</td><td>3</td><td>162</td><td>243</td><td>324</td></tr>
          <tr><td style={{ border: "1px solid #ccc", padding: "0.5em 1em" }}>桔梗 小夜曲</td><td>3</td><td>162</td><td>243</td><td>324</td></tr>
          <tr><td style={{ border: "1px solid #ccc", padding: "0.5em 1em" }}>芒崎 奏</td><td>3</td><td>162</td><td>243</td><td>324</td></tr>
        </tbody>
      </table>
    </div>
    <p style={{ textAlign: "center", marginTop: "0.5em" }}>
      参考: <a href="https://info-chunithm.sega.jp/7222/" target="_blank" rel="noopener">公式お知らせ「イロドリミドリに特別な衣装が登場！」</a>
    </p>

    {/* --- 経験値計算機 --- */}
    <h2 style={{ marginTop: "3em", textAlign: "center" }}>ランクアップ必要経験値計算機</h2>
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, margin: "1em 0" }}>
      <label>
        RANK
        <input type="number" min={1} max={200} value={fromRank} onChange={e => setFromRank(Number(e.target.value))} style={{ width: 60, margin: "0 4px" }} />
      </label>
      から
      <label>
        RANK
        <input type="number" min={1} max={200} value={toRank} onChange={e => setToRank(Number(e.target.value))} style={{ width: 60, margin: "0 4px" }} />
      </label>
      まで
    </div>
    <div style={{ textAlign: "center", marginBottom: "2em" }}>
      <b>必要経験値: {result.exp.toLocaleString()} / スタチュウ: {result.statue}個 / 虹スタチュウ: {result.rainbow}個</b>
    </div>

    {/* --- 経験値テーブル --- */}
    <h2 style={{ marginTop: "3em", textAlign: "center" }}>ランク別必要経験値表</h2>
    <div style={{ overflowX: "auto", maxWidth: 600, margin: "2em auto" }}>
      <table style={{ borderCollapse: "collapse", margin: "0 auto" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ccc", padding: "0.5em 1em", background: "#333", color: "#fff" }}>RANK</th>
            <th style={{ border: "1px solid #ccc", padding: "0.5em 1em", background: "#333", color: "#fff" }}>必要経験値</th>
            <th style={{ border: "1px solid #ccc", padding: "0.5em 1em", background: "#333", color: "#fff" }}>スタチュウ</th>
            <th style={{ border: "1px solid #ccc", padding: "0.5em 1em", background: "#333", color: "#fff" }}>虹スタチュウ</th>
          </tr>
        </thead>
        <tbody>
          {expTable.map((row, i) => (
            <tr key={i}>
              <td style={{ border: "1px solid #ccc", padding: "0.5em 1em", textAlign: "right" }}>{Math.max(i * 5, 1)}～{i * 5 + 4}</td>
              <td style={{ border: "1px solid #ccc", padding: "0.5em 1em", textAlign: "right" }}>{row.exp}</td>
              <td style={{ border: "1px solid #ccc", padding: "0.5em 1em", textAlign: "right" }}>{row.statue}</td>
              <td style={{ border: "1px solid #ccc", padding: "0.5em 1em", textAlign: "right" }}>{row.rainbow}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  );
};

export default CharacterRankReference;
