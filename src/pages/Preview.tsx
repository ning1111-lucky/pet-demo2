import React from 'react';
import { UserProfile } from '../types';
import { PixelPet } from '../components/PixelPet';
import { PixelScene } from '../components/PixelScene';

export const Preview = ({ profile, onNext }: { profile: UserProfile | null, onNext: () => void }) => {
  if (!profile) return null;

  return (
    <div className="flex flex-col animate-fade-in w-full h-full p-6 pb-20 justify-center gap-8">
      
      <div className="text-center">
        <h2 className="text-2xl font-black uppercase tracking-tighter">預覽初始寵物</h2>
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Base Embryo</p>
      </div>

      <div className="w-64 h-64 mx-auto bg-white border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] flex items-center justify-center relative overflow-hidden rounded-full">
         <PixelScene type="showcase" className="absolute inset-0 z-0" />
         <PixelPet stage={1} className="w-full h-full relative z-10 animate-pulse-slow max-w-40 max-h-40" />
      </div>

      <div className="pixel-box p-6 bg-white flex flex-col gap-4 text-center text-sm font-bold uppercase">
        <p>這是根據你目前的穿搭風格產生的預覽寵物。</p>
        <p className="text-[var(--color-pixel-pink)] highlight-shadow">你覺得牠會跟你是一個風格嗎？</p>
        <p>接下來，請用音樂慢慢孵化牠。</p>
      </div>

      <button onClick={onNext} className="pixel-btn p-4 w-full text-sm">
        開始用音樂孵化
      </button>

    </div>
  );
};
