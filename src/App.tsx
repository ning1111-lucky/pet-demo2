/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppStep, UserProfile, FeedEvent, AppState, PetParts } from './types';
import { Landing } from './pages/Landing';
import { Questionnaire } from './pages/Questionnaire';
import { Preview } from './pages/Preview';
import { Feeding } from './pages/Feeding';
import { DailyResult } from './pages/DailyResult';
import { Progress } from './pages/Progress';
import { FinalPet } from './pages/FinalPet';
import { Rating } from './pages/Rating';
import { Interview } from './pages/Interview';
import { getSpotifyToken } from './lib/spotify';

const initialState: AppState = {
  step: 'HOME',
  profile: null,
  feeds: [],
  petParts: {
    body: null,
    accessory: null,
    headFeature: null,
    patternEffect: null
  }
};

export default function App() {
  const [isAuthLoading, setIsAuthLoading] = useState(window.location.pathname === '/callback' || window.location.pathname === '/callback.html');
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('music_pet_state');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return initialState;
  });

  useEffect(() => {
    localStorage.setItem('music_pet_state', JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    const checkCallback = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const code = searchParams.get('code');
      const error = searchParams.get('error');
      
      if (window.location.pathname === '/callback' || window.location.pathname === '/callback.html') {
        if (window.opener) {
          if (error) {
            window.opener.postMessage({ type: 'SPOTIFY_AUTH_ERROR', error }, '*');
          } else if (code) {
            window.opener.postMessage({ type: 'SPOTIFY_AUTH_SUCCESS', code }, '*');
          }
          window.close();
          return;
        }
      }

      if (code) {
        try {
          await getSpotifyToken(code);
          alert('Spotify 已連接成功！');
          window.history.replaceState({}, document.title, '/');
          setIsAuthLoading(false);
          
          // Optionally go straight to feeding if we have a profile and it's not finished
          setState(prev => {
             if (prev.profile && prev.feeds.length < 5) return { ...prev, step: 'FEEDING' };
             return prev;
          });
          
        } catch (e) {
          console.error(e);
          alert('連接 Spotify 失敗');
          window.history.replaceState({}, document.title, '/');
          setIsAuthLoading(false);
        }
      } else if (error) {
          alert('連接 Spotify 失敗');
          window.history.replaceState({}, document.title, '/');
          setIsAuthLoading(false);
      } else {
          setIsAuthLoading(false);
      }
    };
    checkCallback();
  }, []);

  const setStep = (step: AppStep) => setState(prev => ({ ...prev, step }));
  const setProfile = (profile: UserProfile | null) => setState(prev => ({ ...prev, profile }));
  const setFeeds = (feeds: FeedEvent[]) => setState(prev => ({ ...prev, feeds }));
  const setPetParts = (petParts: PetParts) => setState(prev => ({ ...prev, petParts }));

  const handleNext = (nextStep: AppStep) => {
    setStep(nextStep);
    window.scrollTo(0, 0);
  };

  const handleRestart = () => {
    localStorage.removeItem('music_pet_state');
    localStorage.removeItem('last_feed_date');
    setState(initialState);
  };

  const renderContent = () => {
    if (isAuthLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-4 gap-4 animate-pulse">
          <div className="pixel-box p-6 bg-black text-white border-4 border-white text-center">
            <span className="font-bold text-sm uppercase">正在連接 Spotify...</span>
          </div>
        </div>
      );
    }

    switch (state.step) {
      case 'HOME':
        return <Landing onNext={() => handleNext('QUESTIONNAIRE')} />;
      case 'QUESTIONNAIRE':
        return <Questionnaire profile={state.profile} setProfile={setProfile} onNext={() => handleNext('PREVIEW')} />;
      case 'PREVIEW':
        return <Preview profile={state.profile} onNext={() => handleNext('FEEDING')} />;
      case 'FEEDING':
        return <Feeding feeds={state.feeds} onFeed={(newFeed, newParts) => {
          setFeeds([...state.feeds, newFeed]);
          setPetParts(newParts);
          handleNext('DAILY_RESULT');
        }} profile={state.profile} petParts={state.petParts} />;
      case 'DAILY_RESULT':
        return <DailyResult feeds={state.feeds} petParts={state.petParts} profile={state.profile} onNext={() => handleNext('PROGRESS')} />;
      case 'PROGRESS':
        return <Progress feeds={state.feeds} onNext={() => {
          if (state.feeds.length >= 5) {
             handleNext('FINAL');
          } else {
             handleNext('FEEDING');
          }
        }} />;
      case 'FINAL':
        return <FinalPet profile={state.profile} feeds={state.feeds} onNext={() => handleNext('RATING')} />;
      case 'RATING':
        return <Rating onNext={() => handleNext('INTERVIEW')} />;
      case 'INTERVIEW':
        return <Interview onRestart={handleRestart} />;
      default:
        return <Landing onNext={() => handleNext('QUESTIONNAIRE')} />;
    }
  };

  return (
    <div className="min-h-screen pixel-bg font-pixel flex items-center justify-center py-4 px-2 sm:px-4 text-[#2D2D2D] select-none">
      <div className="w-full max-w-[430px] h-[850px] max-h-[95vh] bg-[var(--color-pixel-light)] border-4 border-black box-content shadow-[8px_8px_0_0_rgba(0,0,0,1)] shadow-inner-[inset_4px_4px_0_0_rgba(255,255,255,0.8),inset_-4px_-4px_0_0_rgba(0,0,0,0.1)] flex flex-col relative overflow-hidden" style={{boxShadow: '8px 8px 0 0 rgba(0,0,0,1), inset 4px 4px 0 0 rgba(255,255,255,0.8), inset -4px -4px 0 0 rgba(0,0,0,0.1)'}}>
        {/* Phone Top Bar */}
        <div className="h-6 bg-black text-white flex items-center justify-between px-4 text-[10px] uppercase font-bold flex-shrink-0 z-50">
          <span>{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
          <span>●●● 100%</span>
        </div>
        
        {/* Header Ribbon */}
        {(state.step !== 'HOME' && state.step !== 'INTERVIEW') && (
           <header className="h-12 border-b-4 border-black bg-white flex items-center px-4 shrink-0 z-40 sticky top-0">
             <div className="flex-1 flex justify-center items-center gap-2">
               <div className="w-4 h-4 bg-[var(--color-pixel-pink)] border-2 border-black"></div>
               <span className="font-black uppercase text-sm tracking-tighter w-full text-center truncate">Melody Pet</span>
             </div>
             {state.step !== 'HOME' && (
                <button aria-label="restart" onClick={handleRestart} className="absolute right-4 px-2 py-0.5 bg-black text-white text-[10px] uppercase hover:bg-gray-800">
                  RESET
                </button>
             )}
           </header>
        )}

        {/* Main Content Area - Scrollable */}
        <div className="flex-1 overflow-y-auto no-scrollbar relative w-full h-full bg-[var(--color-pixel-light)]">
          {renderContent()}
        </div>
        
      </div>
    </div>
  );
}

