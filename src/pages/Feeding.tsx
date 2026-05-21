import React, { useState, useEffect } from 'react';
import { FeedEvent, UserProfile, PetParts } from '../types';
import { PixelPet } from '../components/PixelPet';
import { PixelScene } from '../components/PixelScene';
import { getSpotifyAuthUrl, getValidSpotifyToken, getRecentlyPlayed } from '../lib/spotify';
import { getTagsForTrack, analyzeTags } from '../lib/lastfm';

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
  const [isLoadingSpotify, setIsLoadingSpotify] = useState(true);
  const [isReadingTracks, setIsReadingTracks] = useState(false);
  const [spotifyConnected, setSpotifyConnected] = useState(false);
  const [todayTracks, setTodayTracks] = useState<any[]>([]);
  const [analyzedResult, setAnalyzedResult] = useState<any>(null);

  const currentDay = feeds.length + 1;
  const todayDateString = new Date().toLocaleDateString('en-US');
  const hasFedToday = localStorage.getItem('last_feed_date') === todayDateString;

  useEffect(() => {
    checkSpotifyStatus();
  }, []);

  const checkSpotifyStatus = async () => {
    setIsLoadingSpotify(true);
    const token = await getValidSpotifyToken();
    if (token) {
      setSpotifyConnected(true);
      await fetchTodayTracks(token);
    }
    setIsLoadingSpotify(false);
  };

  const handleConnectSpotify = async () => {
    const url = await getSpotifyAuthUrl();
    if (url) {
      const authWindow = window.open(url, 'spotify_oauth', 'width=600,height=700');
      if (!authWindow) {
        alert('請允許開啟彈出視窗以連接 Spotify');
      }
    }
  };

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      const origin = event.origin;
      if (!origin.endsWith('.run.app') && !origin.includes('localhost') && origin !== window.location.origin) {
        return;
      }
      if (event.data?.type === 'SPOTIFY_AUTH_SUCCESS') {
         setIsLoadingSpotify(true);
         try {
           const token = await import('../lib/spotify').then(m => m.getSpotifyToken(event.data.code));
           setSpotifyConnected(true);
           await fetchTodayTracks(token);
         } catch (e) {
           console.error("Auth failed Error:", e);
         }
         setIsLoadingSpotify(false);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const fetchTodayTracks = async (token: string) => {
    setIsReadingTracks(true);
    try {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const items = await getRecentlyPlayed(token, todayStart.getTime());
      
      const tracks = items.map((item: any) => ({
        id: item.track.id,
        name: item.track.name,
        artist: item.track.artists[0]?.name,
        cover: item.track.album?.images[0]?.url,
        playedAt: new Date(item.played_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        url: item.track.external_urls?.spotify
      }));
      setTodayTracks(tracks);

      // Analyze rules
      if (tracks.length > 0) {
        // Collect tags for top 5 recent tracks to avoid too many API calls
        let allTags: string[] = [];
        for (const track of tracks.slice(0, 5)) {
            const tags = await getTagsForTrack(track.artist, track.name);
            allTags = allTags.concat(tags);
        }
        
        let result;
        if (allTags.length > 0) {
            result = analyzeTags(allTags);
            setMusicGenre(result.genre);
            setMood(result.mood);
            setTempo(result.tempo);
            setAnalyzedResult(result);
        } else {
            setAnalyzedResult(null);
        }
      } else {
        setAnalyzedResult(null);
      }
    } catch (e) {
      console.error(e);
      alert('無法讀取 Spotify 紀錄');
    }
    setIsReadingTracks(false);
  };

  const musicOptions = ['K-pop', '搖滾', '嘻哈', '電子音樂', 'Lo-fi', '獨立音樂', '古典音樂', '流行音樂'];
  const moodOptions = ['開心', '慵懶', '憂鬱', '熱血', '夢幻', '冷酷'];
  const tempoOptions = ['慢', '中', '快'];

  const handleFeed = () => {
    if (hasFedToday) return alert('今天已經完成餵食！');
    
    const actualGenre = analyzedResult ? analyzedResult.genre : musicGenre;
    const actualMood = analyzedResult ? analyzedResult.mood : mood;
    const actualTempo = analyzedResult ? analyzedResult.tempo : tempo;
    const actualSongName = spotifyConnected && todayTracks.length > 0 ? `${todayTracks[0].name} 等 ${todayTracks.length} 首歌` : songName;

    if (!actualSongName) return alert('今天沒有紀錄，請手動輸入歌曲名稱！');

    setIsFeeding(true);

    setTimeout(() => {
      let updatedParts = { ...petParts };

      if (currentDay === 1) {
         updatedParts.body = `${profile?.clothingStyle || 'Basic'} + ${actualGenre}`;
      } else if (currentDay === 2) {
         updatedParts.accessory = `${actualGenre} + ${actualMood}`;
      } else if (currentDay === 3) {
         updatedParts.headFeature = `Tempo: ${actualTempo}`;
      } else if (currentDay === 4) {
         updatedParts.patternEffect = `Mood: ${actualMood}`;
      }

      localStorage.setItem('last_feed_date', todayDateString);

      onFeed({
        songName: actualSongName, musicGenre: actualGenre, mood: actualMood, tempo: actualTempo, day: currentDay
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
         <PixelScene type="music-room" genre={analyzedResult?.genre || musicGenre} day={currentDay} className="absolute inset-0 z-0" />
         <div className="absolute top-2 left-2 border-2 border-black p-1 bg-[var(--color-pixel-yellow)] text-[8px] font-bold uppercase z-10 w-max shadow-[2px_2px_0_#000]">Feeding Phase</div>
         <PixelPet stage={currentDay} profile={profile} feeds={feeds} className={`w-48 h-48 relative z-10 drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)] ${isFeeding ? 'animate-float-fast' : ''}`} />
      </div>

      <div className="pixel-box p-4 flex flex-col gap-4 bg-[var(--color-pixel-mint)]">
        {hasFedToday ? (
          <div className="text-center font-bold text-sm bg-black text-white p-3 border-2 border-black">今天已經完成餵食！</div>
        ) : isLoadingSpotify ? (
          <div className="text-center font-bold text-xs animate-pulse">Checking Spotify Status...</div>
        ) : !spotifyConnected ? (
          <div className="flex flex-col gap-3 object-center text-center">
            <span className="text-[12px] font-black">連接 Spotify 讀取你今天聽過的歌曲</span>
            <button onClick={handleConnectSpotify} className="pixel-btn p-3 bg-[#1DB954] text-white text-xs">
              連接 Spotify
            </button>
            <div className="border-t-2 border-black my-2"></div>
            <span className="text-[10px] font-bold text-gray-700">或手動輸入:</span>
            <input className="pixel-input font-bold" placeholder="歌曲名稱" value={songName} onChange={e => setSongName(e.target.value)} />
          </div>
        ) : isReadingTracks ? (
          <div className="text-center font-bold text-xs animate-pulse">正在讀取 Spotify 紀錄...</div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <span className="text-[12px] font-black uppercase bg-[#1DB954] text-white px-2 py-1 border-2 border-black">今日 Spotify 播放紀錄</span>
              <button onClick={() => checkSpotifyStatus()} className="text-[10px] underline font-bold px-1 py-1 hover:bg-black hover:text-white">重新讀取</button>
            </div>
            
            <p className="text-[9px] font-bold leading-tight">Spotify 最多回傳最近 50 首播放記錄，若今天播放超過 50 首，系統將以最近 50 首為主。</p>
            <p className="text-xs font-black">今天讀到的歌曲數量：{todayTracks.length}</p>
            
            {todayTracks.length > 0 && (
              <div className="flex flex-col gap-2 max-h-32 overflow-y-auto no-scrollbar border-2 border-black bg-white p-2 shadow-inner">
                {todayTracks.map((t, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-[10px] font-bold border-b-2 border-dashed border-gray-300 pb-1">
                    {t.cover && <img src={t.cover} alt="cover" className="w-6 h-6 border border-black pixelated object-cover" />}
                    <div className="flex-1 truncate">
                      <span className="truncate block">{t.name}</span>
                      <span className="text-gray-500 truncate block text-[8px]">{t.artist}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[8px]">{t.playedAt}</span>
                      <a href={t.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-[8px]">Link</a>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {analyzedResult && (
              <div className="bg-[var(--color-pixel-light)] border-2 border-black p-2 flex flex-col gap-1">
                <span className="text-[10px] font-black mb-1 border-b-2 border-black pb-1">今日音樂風格分析</span>
                <span className="text-[10px] font-bold">▶ 流行標籤: {analyzedResult.topTags.join(', ') || '標籤不足'}</span>
                <span className="text-[10px] font-bold">▶ 預測曲風: {analyzedResult.genre}</span>
                <span className="text-[10px] font-bold">▶ 衍生情緒: {analyzedResult.mood}</span>
                <span className="text-[10px] font-bold">▶ 推測節奏: {analyzedResult.tempo}</span>
                <span className="text-[10px] font-bold text-red-600 mt-1">預計生成: {analyzedResult.style}</span>
              </div>
            )}

            {(!analyzedResult || analyzedResult.topTags.length === 0) && (
              <div className="flex flex-col gap-2 mt-2 bg-yellow-100 p-2 border-2 border-black">
                <span className="text-[10px] font-bold">標籤不足，請手動補選今日音樂感覺：</span>
                <select className="pixel-input font-bold text-xs" value={musicGenre} onChange={e => setMusicGenre(e.target.value)}>
                  {musicOptions.map(opt => <option key={opt}>{opt}</option>)}
                </select>
                <div className="flex gap-2">
                  <select className="pixel-input font-bold text-xs flex-1" value={mood} onChange={e => setMood(e.target.value)}>
                    {moodOptions.map(opt => <option key={opt}>{opt}</option>)}
                  </select>
                  <select className="pixel-input font-bold text-xs flex-1" value={tempo} onChange={e => setTempo(e.target.value)}>
                    {tempoOptions.map(opt => <option key={opt}>{opt}</option>)}
                  </select>
                </div>
              </div>
            )}
          </div>
        )}

        {(!hasFedToday && (!isLoadingSpotify || spotifyConnected)) && (
          <button onClick={handleFeed} disabled={isFeeding || (spotifyConnected && isReadingTracks)} className="pixel-btn p-3 mt-2 bg-[var(--color-pixel-pink)] text-xs disabled:opacity-50 break-words whitespace-normal leading-tight">
            {isFeeding ? '餵食中... FEEDING...' : spotifyConnected ? (todayTracks.length > 0 ? '確認使用今日音樂餵食' : '沒有紀錄，跳過今天') : '餵給寵物 FEED & MUTATE'}
          </button>
        )}
      </div>

    </div>
  );
};
