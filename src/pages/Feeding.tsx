import React, { useState } from 'react';
import { FeedEvent, UserProfile, PetParts } from '../types';
import { PixelPet } from '../components/PixelPet';
import { PixelScene } from '../components/PixelScene';

export const Feeding = ({ 
  feeds, 
  onFeed,
  profile,
  petParts
}: { 
  feeds: FeedEvent[];
  onFeed: (feed: FeedEvent, newParts: PetParts) => void;
  profile: UserProfile | null;
  petParts: PetParts;
}) => {
  const [songName, setSongName] = useState('');
  const [musicGenre, setMusicGenre] = useState('流行音樂');
  const [mood, setMood] = useState('開心');
  const [tempo, setTempo] = useState('中');
  const [isFeeding, setIsFeeding] = useState(false);

  const currentDay = feeds.length + 1;

  const musicOptions = ['K-pop', '搖滾', '嘻哈', '電子音樂', 'Lo-fi', '獨立音樂', '古典音樂', '流行音樂'];
  const moodOptions = ['開心', '慵懶', '憂鬱', '熱血', '夢幻', '冷酷'];
  const tempoOptions = ['慢', '中', '快'];

  const handleFeed = () => {
    if (!songName) return alert('請輸入歌名！');
    
    setIsFeeding(true);

    setTimeout(() => {
      let updatedParts = { ...petParts };

      if (currentDay === 1) {
         updatedParts.body = `${profile?.clothingStyle || 'Basic'} + ${musicGenre}`;
      } else if (currentDay === 2) {
         updatedParts.accessory = `${musicGenre} + ${mood}`;
      } else if (currentDay === 3) {
         updatedParts.headFeature = `Tempo: ${tempo}`;
      } else if (currentDay === 4) {
         updatedParts.patternEffect = `Mood: ${mood}`;
      }

      onFeed({
        songName, musicGenre, mood, tempo, day: currentDay
      }, updatedParts);
      setIsFeeding(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col p-6 animate-fade-in w-full gap-6 pb-20 justify-center">
      
      <div className="text-center">
        <h2 className="text-2xl font-black uppercase tracking-tighter">第 {currentDay} 天餵養</h2>
        <span className="bg-black text-[#5CFF5C] px-3 py-1 font-black text-[10px] uppercase mt-2 inline-block">STAGE {currentDay}/5</span>
      </div>

      <div className={`pixel-box border-4 border-black flex flex-col items-center justify-center relative overflow-hidden h-64 mx-auto w-full max-w-[280px] transition-all ${isFeeding ? 'animate-pixel-flash' : ''}`}>
         <PixelScene type="music-room" genre={musicGenre} day={currentDay} className="absolute inset-0 z-0" />
         <div className="absolute top-2 left-2 border-2 border-black p-1 bg-[var(--color-pixel-yellow)] text-[8px] font-bold uppercase z-10 w-max shadow-[2px_2px_0_#000]">Feeding Phase</div>
         <PixelPet stage={currentDay} profile={profile} feeds={feeds} className={`w-48 h-48 relative z-10 drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)] ${isFeeding ? 'animate-float-fast' : ''}`} />
      </div>

      <div className="pixel-box p-4 flex flex-col gap-4 bg-[var(--color-pixel-mint)]">
        <label className="flex flex-col gap-2">
          <span className="text-[10px] font-black uppercase">今日要餵的歌名： CURRENT SONG</span>
          <input className="pixel-input font-bold" placeholder="e.g. Ditto" value={songName} onChange={e => setSongName(e.target.value)} />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-[10px] font-black uppercase">音樂類型 GENRE</span>
          <select className="pixel-input font-bold" value={musicGenre} onChange={e => setMusicGenre(e.target.value)}>
            {musicOptions.map(opt => <option key={opt}>{opt}</option>)}
          </select>
        </label>
        <div className="flex gap-2">
          <label className="flex-1 flex flex-col gap-2">
            <span className="text-[10px] font-black uppercase">情緒 MOOD</span>
            <select className="pixel-input font-bold text-xs" value={mood} onChange={e => setMood(e.target.value)}>
              {moodOptions.map(opt => <option key={opt}>{opt}</option>)}
            </select>
          </label>
          <label className="flex-1 flex flex-col gap-2">
            <span className="text-[10px] font-black uppercase">節奏 TEMPO</span>
            <select className="pixel-input font-bold text-xs" value={tempo} onChange={e => setTempo(e.target.value)}>
              {tempoOptions.map(opt => <option key={opt}>{opt}</option>)}
            </select>
          </label>
        </div>

        <button onClick={handleFeed} disabled={isFeeding} className="pixel-btn p-3 mt-2 bg-[var(--color-pixel-pink)] text-xs disabled:opacity-50">
          {isFeeding ? '餵食中... FEEDING...' : '餵給寵物 FEED & MUTATE'}
        </button>
      </div>

    </div>
  );
};
