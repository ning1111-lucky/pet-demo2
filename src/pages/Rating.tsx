import React, { useState } from 'react';
import { PixelScene } from '../components/PixelScene';

export const Rating = ({ onNext }: { onNext: () => void }) => {
  const [q1, setQ1] = useState<number | null>(null);
  const [q2, setQ2] = useState<string>('');
  const [q3, setQ3] = useState<string>('');
  const [q4, setQ4] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const calculatedScore = Math.round(((q1 || 3) * 10 + (q4 || 3) * 10 + (q2 ? 10 : 0)) * 0.9);

  if (showResult) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full p-6 animate-fade-in text-center h-full relative z-10 overflow-hidden">
        <PixelScene type="gallery" className="absolute inset-0 w-full h-full object-cover z-0 opacity-50" />
        
        <div className="relative z-10 flex flex-col items-center gap-6 w-full">
          <h2 className="text-3xl font-black uppercase tracking-tighter text-white drop-shadow-[2px_2px_0_#000]">你的風格相似度<br/>
            <span className="text-sm tracking-widest text-[var(--color-pixel-pink)] highlight-shadow-small bg-black px-2 mt-2 inline-block">SIMILARITY</span>
          </h2>
          
          <div className="text-6xl font-black text-black pixel-box border-4 border-black p-6 bg-[var(--color-pixel-mint)] my-4 w-full text-center shadow-[4px_4px_0_#000]">
             {calculatedScore}%
          </div>
          
          <div className="pixel-box p-4 w-full text-left bg-white text-xs font-bold uppercase leading-relaxed shadow-[4px_4px_0_#000]">
            <ul className="space-y-3">
               <li><span className="bg-black text-[#5CFF5C] px-1 py-0.5 inline-block mb-1">外觀吻合度</span><br/> {q2 === '比較像我的外在風格' || q2 === '兩者都有' ? '高度吻合 HIGHEST MATCH' : '部分吻合 PARTIAL MATCH'}</li>
               <li><span className="bg-black text-[#5CFF5C] px-1 py-0.5 inline-block mb-1">音樂吻合度</span><br/> {q2 === '比較像我的音樂品味' || q2 === '兩者都有' ? '高度吻合 HIGHEST MATCH' : '部分吻合 PARTIAL MATCH'}</li>
               <li className="mt-3 pt-3 border-t-2 border-black text-[10px] text-gray-500 line-clamp-3">USER LOG: "{q3 || 'N/A'}"</li>
            </ul>
          </div>
          
          <button onClick={onNext} className="pixel-btn p-4 text-sm bg-[var(--color-pixel-pink)] w-full mt-auto shadow-[4px_4px_0_#000]">
            查看訪談問題
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto animate-fade-in w-full pb-20 bg-[var(--color-pixel-light)]">
      <div className="w-full h-24 border-b-4 border-black relative overflow-hidden shrink-0">
        <PixelScene type="gallery" className="absolute inset-0" />
      </div>

      <div className="p-6 pt-6 flex flex-col gap-6">
        <div className="text-center">
          <h2 className="text-2xl font-black uppercase tracking-tighter">相似度打分</h2>
          <span className="text-[10px] bg-black text-white px-2 py-1 uppercase mt-1 inline-block">RATE SIMILARITY</span>
        </div>
        
        <div className="pixel-box p-5 flex flex-col gap-8 bg-white text-xs">
        
        <div className="flex flex-col gap-3">
          <label className="font-black uppercase leading-tight">Q1: 你覺得這隻寵物和你的「穿搭風格」相似嗎？<br/><span className="text-[8px] text-gray-500">(1最不像, 5最像)</span></label>
          <div className="flex gap-2 justify-between">
            {[1, 2, 3, 4, 5].map(v => (
              <label key={v} className="flex flex-col items-center gap-1 cursor-pointer font-bold">
                <input type="radio" name="q1" value={v} checked={q1 === v} onChange={() => setQ1(v)} className="w-5 h-5 border-2 border-black accent-black" />
                <span>{v}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <label className="font-black uppercase leading-tight">Q2: 你覺得這隻寵物比較像你的外在風格，還是音樂品味？</label>
          <select className="pixel-input font-bold text-[10px]" value={q2} onChange={e => setQ2(e.target.value)}>
            <option value="">請選擇 CHOOSE...</option>
            <option>比較像我的外在風格 STYLE</option>
            <option>比較像我的音樂品味 MUSIC</option>
            <option>兩者都有 BOTH</option>
            <option>都不像 NONE</option>
          </select>
        </div>

        <div className="flex flex-col gap-3">
          <label className="font-black uppercase leading-tight">Q3: 你覺得哪些地方最像你？</label>
          <textarea className="pixel-input min-h-[80px] font-bold text-[10px]" placeholder="寫下你的想法..." value={q3} onChange={e => setQ3(e.target.value)} />
        </div>

        <div className="flex flex-col gap-3">
          <label className="font-black uppercase leading-tight">Q4: 如果這隻寵物代表你的數位身份，你覺得準確嗎？<br/><span className="text-[8px] text-gray-500">(1最不準, 5最準)</span></label>
          <div className="flex gap-2 justify-between">
            {[1, 2, 3, 4, 5].map(v => (
              <label key={v} className="flex flex-col items-center gap-1 cursor-pointer font-bold">
                <input type="radio" name="q4" value={v} checked={q4 === v} onChange={() => setQ4(v)} className="w-5 h-5 border-2 border-black accent-black" />
                <span>{v}</span>
              </label>
            ))}
          </div>
        </div>

      </div>

      <button onClick={() => setShowResult(true)} className="pixel-btn p-4 text-sm font-black uppercase bg-[var(--color-pixel-mint)] mt-2" disabled={!q2 || !q1 || !q4}>
        看結果 OUTCOME
      </button>
      </div>
    </div>
  );
};
