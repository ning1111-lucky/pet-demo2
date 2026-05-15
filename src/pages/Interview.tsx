import React from 'react';
import { PixelScene } from '../components/PixelScene';

export const Interview = ({ onRestart }: { onRestart: () => void }) => {
  return (
    <div className="flex flex-col h-full overflow-y-auto animate-fade-in w-full pb-20 bg-[var(--color-pixel-light)]">
      <div className="w-full h-24 border-b-4 border-black relative overflow-hidden shrink-0">
        <PixelScene type="gallery" className="absolute inset-0" />
      </div>

      <div className="p-6 pt-6 flex flex-col gap-6">
        <div className="text-center">
          <h2 className="text-2xl font-black uppercase tracking-tighter">研究訪談提示</h2>
          <span className="text-[10px] bg-black text-[#5CFF5C] px-2 py-1 uppercase mt-1 inline-block">INTERVIEW PROMPTS</span>
        </div>
        
        <div className="flex flex-col gap-4">
        <div className="pixel-box p-4 bg-white">
          <h3 className="font-black bg-black text-[#5CFF5C] inline-block px-1 py-0.5 mb-2 text-[8px] uppercase">預期落差 EXPECTATION</h3>
          <ul className="list-none space-y-2 text-[10px] font-bold">
            <li className="flex gap-2"><span className="text-gray-400">01</span><span className="leading-tight">一開始的「預覽寵物」像你嗎？</span></li>
            <li className="flex gap-2"><span className="text-gray-400">02</span><span className="leading-tight">孵化過程中哪個變化讓你覺得最像自己？</span></li>
          </ul>
        </div>

        <div className="pixel-box p-4 bg-white">
          <h3 className="font-black bg-black text-[var(--color-pixel-pink)] inline-block px-1 py-0.5 mb-2 text-[8px] uppercase">轉譯 TRANSLATION</h3>
          <ul className="list-none space-y-2 text-[10px] font-bold">
             <li className="flex gap-2"><span className="text-gray-400">03</span><span className="leading-tight">最後孵化出的寵物像你嗎？</span></li>
             <li className="flex gap-2"><span className="text-gray-400">04</span><span className="leading-tight">牠比較像穿搭還是音樂品味？</span></li>
             <li className="flex gap-2"><span className="text-gray-400">05</span><span className="leading-tight">覺得音樂真的影響了外觀，還是隨機的？</span></li>
          </ul>
        </div>

        <div className="pixel-box p-4 bg-[var(--color-pixel-light)]">
           <h3 className="font-black bg-black text-[var(--color-pixel-blue)] inline-block px-1 py-0.5 mb-2 text-[8px] uppercase">數位身份 IDENTITY</h3>
           <ul className="list-none space-y-2 text-[10px] font-bold">
              <li className="flex gap-2"><span className="text-gray-400">06</span><span className="leading-tight">你會想用這個寵物當數位分身社交嗎？</span></li>
              <li className="flex gap-2"><span className="text-gray-400">07</span><span className="leading-tight">你想怎麼調整這個孵化機制？</span></li>
           </ul>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
         <button onClick={onRestart} className="pixel-btn p-4 text-xs font-black uppercase bg-[var(--color-pixel-yellow)] w-full text-black">
           重新開始 RESTART
         </button>
      </div>
      </div>
    </div>
  );
};
