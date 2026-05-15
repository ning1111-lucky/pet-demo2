import React from 'react';
import { PixelScene } from '../components/PixelScene';
import { PixelPet } from '../components/PixelPet';

export const Landing = ({ onNext }: { onNext: () => void }) => {
  return (
    <div className="flex flex-col h-full w-full animate-fade-in">
      <div className="flex-1 flex flex-col items-center justify-center p-6 gap-8">
        
        <div className="w-48 h-48 bg-white border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] flex items-center justify-center relative overflow-hidden rounded-full">
           <PixelScene type="incubation" className="absolute inset-0 z-0" />
           <PixelPet stage={0} className="w-full h-full relative z-10 animate-pulse-slow max-w-32 max-h-32" />
        </div>

        <div className="text-center flex flex-col gap-4">
          <h1 className="text-4xl font-black leading-tight uppercase tracking-tighter">
            音樂孵化你的<br/><span className="text-[var(--color-pixel-pink)] highlight-shadow">風格寵物</span>
          </h1>
          <p className="text-sm font-bold text-gray-700 bg-[var(--color-pixel-yellow)] border-2 border-black p-3 inline-block mx-auto uppercase">
            每天餵一首歌，慢慢長出屬於你的風格寵物。
          </p>
        </div>

      </div>

      <div className="p-6 bg-white border-t-4 border-black flex flex-col gap-4 shrink-0 shadow-[0_-4px_0_rgba(0,0,0,0.05)]">
        <button onClick={onNext} className="pixel-btn px-8 py-4 text-xl w-full">
          開始孵化 START
        </button>
        <p className="text-[10px] text-center font-bold text-gray-500 uppercase tracking-widest">v1.0.4 - Sonic Persona Research</p>
      </div>
    </div>
  );
};
