import React from 'react';
import { FeedEvent } from '../types';
import { PixelScene } from '../components/PixelScene';

export const Progress = ({ feeds, onNext }: { feeds: FeedEvent[], onNext: () => void }) => {
  const isFinished = feeds.length >= 5;

  const steps = [
    { day: 1, label: '衣服 / 身形' },
    { day: 2, label: '配飾生成' },
    { day: 3, label: '頭部特徵' },
    { day: 4, label: '花紋 / 光效' },
    { day: 5, label: '完整孵化' }
  ];

  return (
    <div className="flex flex-col bg-[var(--color-pixel-light)] h-full w-full pb-20 overflow-y-auto animate-fade-in">
      <div className="w-full h-24 border-b-4 border-black relative overflow-hidden shrink-0">
        <PixelScene type="daily-room" day={feeds.length} genre={feeds[feeds.length-1]?.musicGenre} className="absolute inset-0" />
      </div>

      <div className="p-6 flex flex-col gap-8">
        <div className="text-center">
          <h2 className="text-2xl font-black uppercase tracking-tighter">
            {isFinished ? '孵化完成！ HATCHED' : '孵化進度紀錄 PROGRESS'}
          </h2>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Timeline</p>
        </div>

        <div className="pixel-box p-6 flex flex-col gap-6 bg-white shrink-0 relative">
          <div className="absolute top-0 bottom-0 left-[35px] w-2 bg-black z-0" />
          
          {steps.map(({ day, label }) => {
            const hasFed = day <= feeds.length;
            const isCurrent = day === feeds.length + 1;
            
            return (
              <div key={day} className="flex items-center gap-4 z-10 relative">
                <div className={`w-12 h-12 flex-shrink-0 flex items-center justify-center font-black text-sm uppercase border-4 border-black ${
                  hasFed ? 'bg-black text-[#5CFF5C]' : 'bg-[var(--color-pixel-light)] text-gray-400'
                } ${isCurrent ? 'animate-pulse shadow-[4px_4px_0_var(--color-pixel-pink)]' : ''}`}>
                  D{day}
                </div>
                <div className={`px-4 py-2 border-2 border-black flex-1 font-bold text-xs uppercase ${hasFed ? 'bg-[var(--color-pixel-yellow)]' : 'bg-gray-100 text-gray-400'}`}>
                  {label} {hasFed && '✓'}
                </div>
              </div>
            );
          })}
        </div>

        <button onClick={onNext} className="pixel-btn p-4 w-full text-sm bg-[var(--color-pixel-mint)]">
          {isFinished ? '查看最終寵物 VIEW RESULT' : '進行下一天的餵養 NEXT DAY'}
        </button>
      </div>
    </div>
  );
};
