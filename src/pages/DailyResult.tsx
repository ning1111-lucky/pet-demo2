import React from 'react';
import { FeedEvent, PetParts, UserProfile } from '../types';
import { PixelScene } from '../components/PixelScene';
import { PixelPet } from '../components/PixelPet';

export const DailyResult = ({ 
  feeds, 
  petParts, 
  profile,
  onNext 
}: { 
  feeds: FeedEvent[];
  petParts: PetParts;
  profile: UserProfile | null;
  onNext: () => void;
}) => {
  const currentDay = feeds.length;
  const lastFeed = feeds[feeds.length - 1];

  let title = '';
  let partUnlocked = '';
  let originText = '';
  let descText = '';

  if (currentDay === 1) {
    title = '今天生成了：基礎身形與服裝';
    partUnlocked = petParts.body || '未知';
    originText = `來源：你的${profile?.clothingStyle}穿搭風格 + ${lastFeed.musicGenre}`;
    descText = '寵物獲得了基礎外觀與初步風格特徵。';
  } else if (currentDay === 2) {
    title = '今天生成了：專屬配件';
    partUnlocked = petParts.accessory || '未知';
    originText = `來源：${lastFeed.musicGenre} + ${lastFeed.mood}情緒`;
    descText = '根據你的音樂品味與情緒，寵物獲得了獨特的配飾。';
  } else if (currentDay === 3) {
    title = '今天生成了：頭部特徵';
    partUnlocked = petParts.headFeature || '未知';
    originText = `來源：${lastFeed.tempo}節奏`;
    descText = '節奏的快慢改變了寵物頭部的線條與形狀。';
  } else if (currentDay === 4) {
    title = '今天生成了：身體花紋 / 光效';
    partUnlocked = petParts.patternEffect || '未知';
    originText = `來源：${lastFeed.mood}情緒能量`;
    descText = '音樂情緒能量轉化為寵物身上的專屬印記。';
  } else if (currentDay === 5) {
    title = '能量累積完成！';
    partUnlocked = '所有部件已解鎖';
    originText = `來源：5天的音樂灌溉`;
    descText = '寵物的形體已經成熟，準備展現最終型態。';
  }

  return (
    <div className="flex flex-col p-6 animate-fade-in w-full gap-5 pb-20 justify-center h-full">
      <div className="text-center">
        <h2 className="text-2xl font-black uppercase tracking-tighter">每日轉化結果</h2>
        <span className="bg-black text-white px-3 py-1 font-black text-[10px] uppercase mt-2 inline-block">DAY {currentDay} LOG</span>
      </div>

      <div className="pixel-box border-4 border-black flex flex-col items-center justify-center relative overflow-hidden h-40 mx-auto w-full max-w-[280px] animate-pixel-flash">
         <PixelScene type="daily-room" genre={lastFeed.musicGenre} day={currentDay} className="absolute inset-0 z-0" />
         <PixelPet stage={Math.min(currentDay + 1, 5)} profile={profile} feeds={feeds} className="w-32 h-32 relative z-10 drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)]" />
      </div>

      <div className="pixel-box p-5 flex flex-col gap-3 bg-[var(--color-pixel-light)] text-sm">
         <h3 className="font-black border-b-2 border-black pb-2 text-[var(--color-pixel-pink)] highlight-shadow-small leading-tight">
           {title}
         </h3>
         <p className="font-bold text-xs bg-black text-[#5CFF5C] p-2 break-all">
           &gt; LOG: {partUnlocked}
         </p>
         <div className="flex flex-col gap-2 mt-2">
            <span className="font-bold text-[10px] uppercase text-gray-500 bg-white border border-gray-300 px-2 py-1 select-none">
              {originText}
            </span>
            <span className="font-bold text-xs uppercase leading-relaxed">
              {descText}
            </span>
         </div>
      </div>

      <button onClick={onNext} className="pixel-btn p-4 w-full text-sm mt-4 bg-[var(--color-pixel-blue)]">
        查看進度 VIEW PROGRESS
      </button>
    </div>
  );
};
