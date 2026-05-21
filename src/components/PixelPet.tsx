import React from 'react';
import { UserProfile, FeedEvent } from '../types';

interface PixelPetProps {
  stage: number; // 0 = egg, 1 = embryo, 2=clothes, 3=accessory, 4=head feature, 5=pattern/tail
  profile?: UserProfile | null;
  feeds?: FeedEvent[];
  className?: string;
}

export const PixelPet: React.FC<PixelPetProps> = ({ stage, profile, feeds = [], className = '' }) => {
  // Base colors
  const colorMap: Record<string, string> = {
    '奶油黃': 'var(--color-pixel-yellow)',
    '淺粉': 'var(--color-pixel-pink)',
    '薄荷綠': 'var(--color-pixel-mint)',
    '天空藍': 'var(--color-pixel-blue)',
    '淡紫色': 'var(--color-pixel-purple)',
  };

  const baseColor = profile?.favoriteColor ? (colorMap[profile.favoriteColor] || '#ffcfd2') : '#f8f9fa';
  const outline = 'var(--color-pixel-dark)';

  const clothingStyle = profile?.clothingStyle || '';
  const lastFeed = feeds.length > 0 ? feeds[feeds.length - 1] : null;

  const Pixel = ({ x, y, w = 1, h = 1, fill = outline, opacity = 1 }: { x: number, y: number, w?: number, h?: number, fill?: string, opacity?: number }) => (
    <rect x={x} y={y} width={w} height={h} fill={fill} opacity={opacity} />
  );

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 32 32"
        className="w-full h-full max-w-[300px] max-h-[300px]"
        style={{ shapeRendering: 'crispEdges' }}
      >
        {/* Stage 0: Egg */}
        {stage === 0 && (
          <g className="animate-egg-shake origin-center" style={{ transformBox: 'fill-box' }}>
            <Pixel x={12} y={8} w={8} h={1} />
            <Pixel x={10} y={9} w={2} h={1} />
            <Pixel x={20} y={9} w={2} h={1} />
            <Pixel x={9} y={10} w={1} h={2} />
            <Pixel x={22} y={10} w={1} h={2} />
            <Pixel x={8} y={12} w={1} h={8} />
            <Pixel x={23} y={12} w={1} h={8} />
            <Pixel x={9} y={20} w={1} h={3} />
            <Pixel x={22} y={20} w={1} h={3} />
            <Pixel x={10} y={23} w={2} h={1} />
            <Pixel x={20} y={23} w={2} h={1} />
            <Pixel x={12} y={24} w={8} h={1} />
            
            <Pixel x={12} y={9} w={8} h={1} fill={baseColor} />
            <Pixel x={10} y={10} w={12} h={2} fill={baseColor} />
            <Pixel x={9} y={12} w={14} h={8} fill={baseColor} />
            <Pixel x={10} y={20} w={12} h={3} fill={baseColor} />
            <Pixel x={12} y={23} w={8} h={1} fill={baseColor} />
          </g>
        )}

        {/* Stage >= 1: Embryo/Pet */}
        {stage > 0 && (
          <g className={className?.includes('animate-pulse') ? '' : 'animate-float'}>
            {/* Body Outline */}
            <Pixel x={10} y={12} w={12} h={1} />
            <Pixel x={8} y={13} w={2} h={1} />
            <Pixel x={22} y={13} w={2} h={1} />
            <Pixel x={7} y={14} w={1} h={8} />
            <Pixel x={24} y={14} w={1} h={8} />
            <Pixel x={8} y={22} w={2} h={1} />
            <Pixel x={22} y={22} w={2} h={1} />
            <Pixel x={10} y={23} w={12} h={1} />
            
            {/* Body Fill */}
            <Pixel x={10} y={13} w={12} h={1} fill={baseColor} />
            <Pixel x={8} y={14} w={16} h={8} fill={baseColor} />
            <Pixel x={10} y={22} w={12} h={1} fill={baseColor} />

            {/* Legs */}
            <Pixel x={12} y={23} w={2} h={2} fill={baseColor} />
            <Pixel x={11} y={23} w={1} h={2} />
            <Pixel x={14} y={23} w={1} h={2} />
            <Pixel x={12} y={25} w={3} h={1} />

            <Pixel x={18} y={23} w={2} h={2} fill={baseColor} />
            <Pixel x={17} y={23} w={1} h={2} />
            <Pixel x={20} y={23} w={1} h={2} />
            <Pixel x={17} y={25} w={3} h={1} />

            {/* Eyes */}
            <g className="animate-blink origin-center" style={{ transformBox: 'fill-box' }}>
              {lastFeed?.mood === '開心' ? (
                <>
                  <Pixel x={11} y={16} w={2} h={1} /><Pixel x={11} y={17} w={1} h={1} /><Pixel x={12} y={17} w={1} h={1} />
                  <Pixel x={19} y={16} w={2} h={1} /><Pixel x={19} y={17} w={1} h={1} /><Pixel x={20} y={17} w={1} h={1} />
                 </>
              ) : lastFeed?.mood === '憂鬱' ? (
                <>
                  <Pixel x={11} y={17} w={2} h={1} />
                  <Pixel x={19} y={17} w={2} h={1} />
                </>
              ) : (
                <>
                  <Pixel x={11} y={16} w={2} h={2} />
                  <Pixel x={19} y={16} w={2} h={2} />
                </>
              )}
            </g>

            {/* Stage 2+ : Clothing/Body Mod */}
            {stage >= 2 && (
              <g>
                <Pixel x={10} y={19} w={12} h={3} fill={clothingStyle === '街頭潮流' ? '#333' : clothingStyle === '粉紅甜心' ? '#ff99c8' : '#a2d2ff'} />
              </g>
            )}

            {/* Stage 3+ : Accessory */}
            {stage >= 3 && feeds.some(f => f.musicGenre) && (
              <g>
                <Pixel x={10} y={15} w={12} h={4} fill="#00f5d4" opacity={0.6} />
              </g>
            )}

            {/* Stage 4+ : Head Feature */}
            {stage >= 4 && (
              <g>
                {/* Horns or Ears depending on tempo */}
                {feeds.some(f => f.tempo === '快') ? (
                  <>
                    <Pixel x={11} y={9} w={1} h={3} fill="#000" />
                    <Pixel x={20} y={9} w={1} h={3} fill="#000" />
                  </>
                ) : (
                  <>
                     <Pixel x={6} y={14} w={2} h={4} fill={baseColor} />
                     <Pixel x={5} y={14} w={1} h={4} />
                     <Pixel x={24} y={14} w={2} h={4} fill={baseColor} />
                     <Pixel x={26} y={14} w={1} h={4} />
                  </>
                )}
              </g>
            )}

            {/* Stage 5 : Pattern/Tail */}
            {stage >= 5 && (
               <g>
                 <Pixel x={24} y={20} w={3} h={1} fill={baseColor} />
                 <Pixel x={27} y={18} w={1} h={3} fill={baseColor} />
                 <Pixel x={26} y={17} w={1} h={1} fill={baseColor} />
                 
                 {/* Sparkles/Effects */}
                 <Pixel x={4} y={8} w={1} h={1} fill="#ffbe0b" />
                 <Pixel x={26} y={6} w={1} h={1} fill="#ffbe0b" />
                 <Pixel x={24} y={26} w={1} h={1} fill="#ffbe0b" />
               </g>
            )}
          </g>
        )}
      </svg>
    </div>
  );
};
