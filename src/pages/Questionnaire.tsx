import React, { useState } from 'react';
import { UserProfile } from '../types';
import { PixelScene } from '../components/PixelScene';

export const Questionnaire = ({ 
  profile, 
  setProfile, 
  onNext 
}: { 
  profile: UserProfile | null;
  setProfile: (p: UserProfile) => void;
  onNext: () => void;
}) => {
  const [localProfile, setLocalProfile] = useState<UserProfile>(
    profile || {
      age: '', gender: '', clothingStyle: '韓系簡約', favoriteColor: '天空藍', musicGenre: '流行音樂', photoUploaded: false
    }
  );

  const [uploadText, setUploadText] = useState('上傳照片');

  const clothingOptions = ['韓系簡約', '日系休閒', '街頭潮流', '甜酷風', '暗黑龐克', '文青風', '運動休閒', 'Y2K', '復古風', '極簡中性'];
  const colorOptions = ['奶油黃', '淺粉', '薄荷綠', '天空藍', '淡紫色'];
  const musicOptions = ['K-pop', '搖滾', '嘻哈', '電子音樂', 'Lo-fi', '獨立音樂', '古典音樂', '流行音樂'];

  const handleFakeUpload = () => {
     setUploadText('載入成功 [✓]');
     setLocalProfile({ ...localProfile, photoUploaded: true });
  };

  const update = (field: keyof UserProfile, value: string) => {
    setLocalProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    setProfile(localProfile);
    onNext();
  };

  return (
    <div className="flex flex-col animate-fade-in pb-20 bg-[var(--color-pixel-light)] h-full overflow-y-auto w-full">
      
      <div className="w-full h-32 border-b-4 border-black relative overflow-hidden shrink-0">
        <PixelScene type="wardrobe" className="absolute inset-0" />
      </div>

      <div className="p-6 flex flex-col gap-6">
        <div className="text-center mb-2">
          <h2 className="text-2xl font-black uppercase tracking-tighter">角色初始設定</h2>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Character Creation</p>
        </div>

      <div className="pixel-box p-4 bg-[var(--color-pixel-blue)]">
         <div className="text-[10px] font-black uppercase tracking-widest border-b-2 border-black pb-1 mb-2">System Log</div>
         <p className="text-xs font-bold animate-pulse">&gt; 輸入參數以生成初始胚胎...</p>
      </div>
      
      <div className="flex flex-col gap-6">
        <div className="flex gap-4">
          <label className="flex-1 flex flex-col gap-2">
            <span className="text-[10px] font-black uppercase bg-black text-white px-2 py-1 self-start">年齡 AGE</span>
            <input type="text" className="pixel-input font-bold" placeholder="ex: 24" value={localProfile.age} onChange={e => update('age', e.target.value)} />
          </label>
          <label className="flex-1 flex flex-col gap-2">
            <span className="text-[10px] font-black uppercase bg-black text-white px-2 py-1 self-start">性別 GENDER</span>
             <select className="pixel-input font-bold" value={localProfile.gender} onChange={e => update('gender', e.target.value)}>
                <option value="">選擇...</option>
                <option value="male">男</option>
                <option value="female">女</option>
                <option value="other">其他</option>
             </select>
          </label>
        </div>

        <label className="flex flex-col gap-2">
          <span className="text-[10px] font-black uppercase bg-black text-[var(--color-pixel-pink)] px-2 py-1 self-start">穿搭風格 STYLE</span>
          <div className="grid grid-cols-2 gap-2 mt-1">
            {clothingOptions.map(opt => (
              <div 
                key={opt}
                onClick={() => update('clothingStyle', opt)}
                className={`border-2 border-black p-2 text-xs font-bold text-center cursor-pointer transition-colors ${localProfile.clothingStyle === opt ? 'bg-black text-[var(--color-pixel-pink)]' : 'bg-white hover:bg-gray-100'}`}
              >
                {opt}
              </div>
            ))}
          </div>
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-[10px] font-black uppercase bg-black text-[var(--color-pixel-yellow)] px-2 py-1 self-start">喜歡的顏色 COLOR</span>
          <select className="pixel-input font-bold" value={localProfile.favoriteColor} onChange={e => update('favoriteColor', e.target.value)}>
            {colorOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-[10px] font-black uppercase bg-black text-[var(--color-pixel-mint)] px-2 py-1 self-start">音樂類型 MUSIC</span>
          <select className="pixel-input font-bold" value={localProfile.musicGenre} onChange={e => update('musicGenre', e.target.value)}>
            {musicOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </label>

        <div className="flex flex-col gap-2">
           <span className="text-[10px] font-black uppercase bg-black text-[var(--color-pixel-blue)] px-2 py-1 self-start">外在特徵 PHOTO (可選)</span>
           <button onClick={handleFakeUpload} className={`border-2 border-dashed border-black p-4 text-center text-sm font-bold cursor-pointer transition-colors ${localProfile.photoUploaded ? 'bg-[var(--color-pixel-blue)] text-black' : 'bg-white hover:bg-gray-100'}`}>
              + {uploadText}
           </button>
        </div>

        <button onClick={handleNext} className="pixel-btn p-4 mt-4 text-sm bg-[var(--color-pixel-mint)]">
          建立設定 INITIALIZE
        </button>
      </div>
      </div>

    </div>
  );
};
