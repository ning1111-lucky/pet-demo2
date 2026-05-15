import React from 'react';
import { UserProfile, FeedEvent } from '../types';
import { PixelPet } from '../components/PixelPet';
import { PixelScene } from '../components/PixelScene';

export const FinalPet = ({ profile, feeds, onNext }: { profile: UserProfile | null, feeds: FeedEvent[], onNext: () => void }) => {
  return (
    <div className="flex flex-col p-6 gap-6 animate-fade-in w-full pb-20 justify-center min-h-full">
      <div className="text-center">
        <h2 className="text-3xl font-black uppercase tracking-tighter">你的風格寵物<br/>孵化完成！</h2>
        <span className="text-[10px] text-gray-500 font-bold tracking-widest mt-2 bg-white px-2 py-1 border border-gray-300 uppercase block w-max mx-auto">HATCHING COMPLETE</span>
      </div>
      
      <div className="flex flex-col gap-6">
        <div className="pixel-box flex items-center justify-center h-72 border-4 border-black relative overflow-hidden mx-auto w-full max-w-[300px]">
           <PixelScene type="stage" className="absolute inset-0 z-0" />
           <PixelPet stage={5} profile={profile} feeds={feeds} className="w-56 h-56 animate-float relative z-10 drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)]" />
           <div className="absolute top-2 left-2 border-2 border-black p-1 bg-white text-[8px] font-bold uppercase z-10 shadow-[2px_2px_0_#000]">Lvl 5: Final Hatch</div>
        </div>

        <div className="pixel-box p-4 bg-white flex flex-col gap-3">
           <div className="text-xs font-black uppercase border-b-2 border-black pb-1">風格來源分析</div>
           <ul className="space-y-3 text-[10px] font-bold uppercase leading-tight">
             <li>
               <span className="bg-black text-white px-1 py-0.5 inline-block mb-1">D1: BODY</span><br/>
               <span className="text-gray-600">衣服來自你的穿搭風格 ({profile?.clothingStyle}) 與首日音樂。</span>
             </li>
             <li>
               <span className="bg-black text-white px-1 py-0.5 inline-block mb-1">D2: ACCESSORY</span><br/>
               <span className="text-gray-600">配飾來自你餵養的音樂類型 ({feeds[1]?.musicGenre})。</span>
             </li>
             <li>
               <span className="bg-black text-white px-1 py-0.5 inline-block mb-1">D3: HEAD FEATURE</span><br/>
               <span className="text-gray-600">頭部特徵受節奏快慢影響 ({feeds[2]?.tempo})。</span>
             </li>
             <li>
               <span className="bg-black text-white px-1 py-0.5 inline-block mb-1">D4: PATTERN / EFFECT</span><br/>
               <span className="text-gray-600">花紋與光效受累積情緒能量影響。</span>
             </li>
           </ul>
        </div>
      </div>

      <div className="pixel-box p-4 mt-2 bg-[var(--color-pixel-blue)]">
         <div className="text-[10px] font-black uppercase mb-3 bg-white border-2 border-black px-1 inline-block">Feed Log</div>
         <div className="flex flex-col gap-2">
            {feeds.map((f, i) => (
               <div key={i} className="border-2 border-black bg-white p-2 text-[8px] font-bold uppercase shadow-[2px_2px_0_#000] flex justify-between items-center">
                 <div className="flex-1">
                   <div className="bg-black text-[#5CFF5C] px-1 inline-block mb-1">D{f.day}: {f.songName}</div>
                   <div className="text-gray-500 whitespace-nowrap overflow-hidden text-ellipsis w-48">{f.musicGenre} / {f.mood} / {f.tempo}</div>
                 </div>
               </div>
            ))}
         </div>
      </div>

      <div className="mt-4">
         <button onClick={onNext} className="pixel-btn p-4 w-full text-sm bg-[var(--color-pixel-pink)] font-black uppercase">
           相似度打分 RATE SIMILARITY
         </button>
      </div>
    </div>
  );
};
