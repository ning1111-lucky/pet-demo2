import React from 'react';

interface PixelSceneProps {
  type: 'incubation' | 'wardrobe' | 'showcase' | 'music-room' | 'daily-room' | 'stage' | 'gallery';
  genre?: string;
  day?: number;
  mood?: string;
  className?: string;
}

export const PixelScene = ({ type, genre, day = 1, mood, className = '' }: PixelSceneProps) => {
  const Rect = ({ x, y, w = 1, h = 1, fill = '#000', opacity = 1 }: any) => (
    <rect x={x} y={y} width={w} height={h} fill={fill} opacity={opacity} />
  );

  let wallColor = '#fdf0d5';
  let floorColor = '#ffb5a7';
  let accentColor = '#fcd5ce';
  
  if (genre === 'K-pop') { wallColor = '#ffcbf2'; floorColor = '#f3c4fb'; accentColor = '#fee440'; }
  else if (genre === '搖滾') { wallColor = '#343a40'; floorColor = '#e5383b'; accentColor = '#6c757d'; }
  else if (genre === '嘻哈') { wallColor = '#bc4749'; floorColor = '#386641'; accentColor = '#f2e8cf'; }
  else if (genre === '電子音樂') { wallColor = '#0b090a'; floorColor = '#161a1d'; accentColor = '#00f5d4'; }
  else if (genre === 'Lo-fi') { wallColor = '#fefae0'; floorColor = '#dda15e'; accentColor = '#cdb4db'; }
  else if (genre === '古典音樂') { wallColor = '#6f1d1b'; floorColor = '#99582a'; accentColor = '#ffd166'; }
  else if (genre === '獨立音樂') { wallColor = '#a3b18a'; floorColor = '#dad7cd'; accentColor = '#588157'; }
  else if (genre === '流行音樂') { wallColor = '#a2d2ff'; floorColor = '#bde0fe'; accentColor = '#ffafcc'; }

  return (
    <svg viewBox="0 0 32 32" className={`w-full h-full ${className}`} preserveAspectRatio="xMidYMid slice" shapeRendering="crispEdges">
      {type === 'incubation' && (
        <g>
          <Rect x={0} y={0} w={32} h={22} fill="#ffebcc" />
          <Rect x={0} y={22} w={32} h={10} fill="#e2c2a4" />
          {/* Window */}
          <Rect x={2} y={2} w={10} h={12} fill="#8b7355" />
          <Rect x={3} y={3} w={8} h={10} fill="#a4c3e2" />
          <Rect x={7} y={3} w={1} h={10} fill="#8b7355" />
          <Rect x={3} y={8} w={8} h={1} fill="#8b7355" />
          {/* Table */}
          <Rect x={7} y={22} w={18} h={2} fill="#8b7355" />
          <Rect x={9} y={24} w={2} h={8} fill="#6a543e" />
          <Rect x={21} y={24} w={2} h={8} fill="#6a543e" />
          {/* Plant */}
          <Rect x={26} y={16} w={4} h={6} fill="#4f772d" />
          <Rect x={27} y={22} w={2} h={4} fill="#90a955" />
          {/* Lamp */}
          <g className="animate-pulse-light">
             <Rect x={22} y={10} w={4} h={2} fill="#ffd166" />
             <Rect x={23} y={12} w={2} h={10} fill="#e07a5f" />
          </g>
        </g>
      )}

      {type === 'wardrobe' && (
        <g>
          <Rect x={0} y={0} w={32} h={22} fill="#dcd6f7" />
          <Rect x={0} y={22} w={32} h={10} fill="#a6b1e1" />
          {/* Mirror */}
          <Rect x={4} y={6} w={8} h={16} fill="#424874" />
          <Rect x={5} y={7} w={6} h={14} fill="#f4eeff" />
          {/* Closet */}
          <Rect x={18} y={4} w={12} h={18} fill="#424874" />
          <Rect x={19} y={5} w={10} h={16} fill="#a6b1e1" />
          {/* Clothes */}
          <Rect x={20} y={6} w={8} h={1} fill="#fff" />
          <Rect x={21} y={8} w={2} h={6} fill="#ffbbf2" />
          <Rect x={25} y={8} w={2} h={8} fill="#bde0fe" />
        </g>
      )}

      {type === 'showcase' && (
        <g>
          <Rect x={0} y={0} w={32} h={22} fill="#f4f1de" />
          <Rect x={0} y={22} w={32} h={10} fill="#e07a5f" />
          <Rect x={8} y={20} w={16} h={4} fill="#3d405b" />
          <Rect x={10} y={24} w={12} h={8} fill="#81b29a" />
        </g>
      )}

      {(type === 'music-room' || type === 'daily-room') && (
        <g>
          <Rect x={0} y={0} w={32} h={24} fill={wallColor} />
          <Rect x={0} y={24} w={32} h={8} fill={floorColor} />
          {/* Base Room Elements */}
          <Rect x={2} y={16} w={6} h={8} fill="#212529" /> {/* Speaker Left */}
          <Rect x={3} y={17} w={4} h={2} fill="#343a40" />
          <Rect x={3} y={20} w={4} h={3} fill="#343a40" />

          {/* Floating Notes */}
          {type === 'music-room' && (
             <g className="animate-float">
                <text x="4" y="14" fontSize="4" fill="#000" className="animate-float-up-fade origin-center" style={{ animationDelay: '0s', animationIterationCount: 'infinite' }}>♪</text>
                <text x="24" y="10" fontSize="5" fill="#000" className="animate-float-up-fade origin-center" style={{ animationDelay: '1s', animationIterationCount: 'infinite' }}>♫</text>
             </g>
          )}

          {/* Dynamic evolution over days */}
          {day >= 1 && (
            <Rect x={8} y={26} w={16} h={4} fill={accentColor} opacity={0.5} /> /* Rug */
          )}
          {day >= 2 && (
             <g>
                <Rect x={12} y={4} w={8} h={8} fill="#fff" /> /* Poster */
                <Rect x={13} y={5} w={6} h={6} fill={accentColor} />
             </g>
          )}
          {day >= 3 && (
            <Rect x={4} y={26} w={3} h={3} fill="#ffbe0b" /> /* Toy */
          )}
          {day >= 4 && (
            <g>
              <Rect x={0} y={2} w={32} h={1} fill="#fff" opacity={0.3} />
              <Rect x={4} y={2} w={1} h={2} fill="#fee440" />
              <Rect x={12} y={2} w={1} h={2} fill="#fee440" />
              <Rect x={20} y={2} w={1} h={2} fill="#fee440" />
              <Rect x={28} y={2} w={1} h={2} fill="#fee440" />
            </g>
          )}
        </g>
      )}

      {type === 'stage' && (
        <g>
          <Rect x={0} y={0} w={32} h={24} fill="#14213d" />
          
          <g className="animate-pulse-light">
             <Rect x={4} y={4} w={1} h={1} fill="#fee440" />
             <Rect x={28} y={8} w={1} h={1} fill="#fee440" />
             <Rect x={12} y={3} w={1} h={1} fill="#fee440" />
             <Rect x={20} y={6} w={1} h={1} fill="#fee440" />
          </g>

          <Rect x={0} y={24} w={32} h={8} fill="#fca311" />
          {/* Curtains */}
          <Rect x={0} y={0} w={6} h={24} fill="#d90429" />
          <Rect x={26} y={0} w={6} h={24} fill="#d90429" />
          {/* Spotlight */}
          <path d="M 16 0 L 10 24 L 22 24 Z" fill="#fff" opacity={0.15} />
          <Rect x={14} y={2} w={4} h={2} fill="#fff" />
        </g>
      )}

      {type === 'gallery' && (
        <g>
          <Rect x={0} y={0} w={32} h={32} fill="#2b2d42" />
          {/* Frames */}
          <Rect x={2} y={4} w={8} h={8} fill="#fff" opacity={0.8} />
          <Rect x={3} y={5} w={6} h={6} fill="#ef233c" opacity={0.5} />
          
          <Rect x={22} y={12} w={8} h={8} fill="#fff" opacity={0.8} />
          <Rect x={23} y={13} w={6} h={6} fill="#8d99ae" opacity={0.5} />
          
          <Rect x={4} y={20} w={8} h={8} fill="#fff" opacity={0.8} />
          <Rect x={5} y={21} w={6} h={6} fill="#edf2f4" opacity={0.5} />
        </g>
      )}
    </svg>
  );
};
