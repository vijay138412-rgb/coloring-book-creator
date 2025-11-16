
import React from 'react';

export const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

export const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m12 3-1.9 5.8-5.8 1.9 5.8 1.9 1.9 5.8 1.9-5.8 5.8-1.9-5.8-1.9Z" />
    <path d="M5 3v4" />
    <path d="M19 17v4" />
    <path d="M3 5h4" />
    <path d="M17 19h4" />
  </svg>
);

export const ChatIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
);

export const SendIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="22" y1="2" x2="11" y2="13"></line>
        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
);

export const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

export const CuteBotIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 8V4H8" />
    <rect width="16" height="12" x="4" y="8" rx="2" />
    <path d="M2 14h2" />
    <path d="M20 14h2" />
    <path d="M15 13v2" />
    <path d="M9 13v2" />
  </svg>
);

export const UserIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export const InfoIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);

export const MagicWandIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 4V2" />
    <path d="M15 10V8" />
    <path d="M12.5 7.5 14 6" />
    <path d="M6 21 3 18" />
    <path d="M21 15h-2" />
    <path d="M17 15h-2" />
    <path d="M9 15H7" />
    <path d="m15 15-2.5 2.5" />
    <path d="M19 21 3 7l4-4 14 14-4 4Z" />
  </svg>
);

export const ColorPaletteIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
    <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
    <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
    <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.668 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.5-2.45 5.5-5.5S17.051 2 12 2Z" />
  </svg>
);

export const DoodleBackground: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 800 600" 
    preserveAspectRatio="none"
    className={className}
  >
    <path d="M0 600V400C100 350, 150 450, 250 420S400 300, 500 350, 650 500, 800 450V600H0Z" fill="#a8e063" fillOpacity="0.5"/>
    <path d="M0 600V450C80 420, 180 500, 300 480S450 380, 550 420, 700 550, 800 500V600H0Z" fill="#8ec5fc" fillOpacity="0.4"/>
    
    <circle cx="100" cy="100" r="40" fill="#fbc2eb" fillOpacity="0.6"/>
    <circle cx="110" cy="90" r="5" fill="white"/>
    <circle cx="90" cy="90" r="5" fill="white"/>
    <path d="M90 105 Q100 115, 110 105" stroke="white" strokeWidth="3" fill="none"/>

    <path d="M600 150 C 580 130, 620 130, 600 150 C 580 170, 620 170, 600 150 Z" fill="#e0c3fc" fillOpacity="0.7"/>
    <path d="M650 120 C 630 100, 670 100, 650 120 C 630 140, 670 140, 650 120 Z" fill="#e0c3fc" fillOpacity="0.6"/>
    <path d="M720 160 C 700 140, 740 140, 720 160 C 700 180, 740 180, 720 160 Z" fill="#e0c3fc" fillOpacity="0.8"/>

    <path d="M200 380 L 200 350 M 190 365 L 210 365" stroke="#fbc2eb" strokeWidth="4" strokeLinecap="round"/>
    <circle cx="200" cy="340" r="10" fill="#fbc2eb" fillOpacity="0.8"/>
    
    <path d="M400 320 L 400 290 M 390 305 L 410 305" stroke="#fbc2eb" strokeWidth="4" strokeLinecap="round"/>
    <circle cx="400" cy="280" r="10" fill="#fbc2eb" fillOpacity="0.8"/>
    
    <path d="M650 420 L 650 390 M 640 405 L 660 405" stroke="#fbc2eb" strokeWidth="4" strokeLinecap="round"/>
    <circle cx="650" cy="380" r="10" fill="#fbc2eb" fillOpacity="0.8"/>
  </svg>
);

export const DinosaurIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path fill="#A8E063" d="M153.1,-2.3C153.1,30.3,76.5,60.6,18.8,60.6C-39,60.6,-77.9,30.3,-77.9,-2.3C-77.9,-35,-39,-70,18.8,-70C76.5,-70,153.1,-35,153.1,-2.3Z" transform="translate(100 120) scale(0.9)" />
    <path fill="#69B578" d="M148.8,11.3C142.2,45.3,101.4,70.1,64.2,70.1C27,70.1,-16.6,45.3,-39.8,11.3C-63,-22.6,-65.8,-65.8,-49,-87.3C-32.2,-108.8,1.3,-108.6,35.2,-102.5C69.1,-96.4,103.4,-84.4,115.5,-63.9C127.6,-43.4,155.5,-22.6,148.8,11.3Z" transform="translate(80 100)" />
    <circle cx="130" cy="70" r="5" fill="white" />
    <path d="M150 120 Q 140 130, 130 120" stroke="white" strokeWidth="3" fill="none" />
  </svg>
);

export const UnicornIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path fill="#FBC2EB" d="M42.4,-61.8C57.7,-53,74.7,-43.3,82.3,-29.4C90,-15.5,88.2,2.6,80.6,17.4C73,32.2,59.6,43.7,45.6,54.7C31.6,65.7,17.1,76.2,1.8,77.1C-13.5,78,-27.9,69.2,-41.8,59.3C-55.7,49.3,-69.1,38.2,-74.6,24.1C-80.1,10,-77.7,-7.1,-70,-20.5C-62.3,-33.9,-49.3,-43.6,-36.5,-51.7C-23.8,-59.8,-11.9,-66.3,2.2,-69.1C16.3,-71.9,32.7,-71.5,42.4,-61.8Z" transform="translate(100 100)" />
    <path fill="#8EC5FC" d="M50.1,-16.9C50.1,0.5,25.1,17.9,-3.1,17.9C-31.3,17.9,-62.5,0.5,-62.5,-16.9C-62.5,-34.3,-31.3,-51.7,-3.1,-51.7C25.1,-51.7,50.1,-34.3,50.1,-16.9Z" transform="translate(85 80) rotate(25)" />
    <path fill="#E0C3FC" d="M10,80 L20,50 L30,80 Z" />
    <circle cx="60" cy="75" r="4" fill="black" />
  </svg>
);

export const RocketIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path fill="#8EC5FC" d="M 60 20 L 140 20 L 140 150 L 120 180 L 80 180 L 60 150 Z" />
    <path fill="#E0C3FC" d="M 100 0 L 140 30 L 60 30 Z" />
    <circle cx="100" cy="90" r="20" fill="#FBC2EB" stroke="white" strokeWidth="4" />
    <path fill="#F9A826" d="M 80 180 C 60 200, 140 200, 120 180 L 100 170 Z" />
    <path fill="#FFC107" d="M 85 180 C 70 195, 130 195, 115 180 L 100 175 Z" />
  </svg>
);

export const CrayonsIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className={className}>
    <g transform="translate(20 80) rotate(-30)">
      <rect x="0" y="0" width="20" height="100" fill="#ff595e" />
      <path d="M 0 0 L 10  -20 L 20 0 Z" fill="#ff595e" />
    </g>
    <g transform="translate(50 80) rotate(-15)">
      <rect x="0" y="0" width="20" height="100" fill="#ffca3a" />
      <path d="M 0 0 L 10 -20 L 20 0 Z" fill="#ffca3a" />
    </g>
    <g transform="translate(80 80) rotate(0)">
      <rect x="0" y="0" width="20" height="100" fill="#8ac926" />
      <path d="M 0 0 L 10 -20 L 20 0 Z" fill="#8ac926" />
    </g>
    <g transform="translate(110 80) rotate(15)">
      <rect x="0" y="0" width="20" height="100" fill="#1982c4" />
      <path d="M 0 0 L 10 -20 L 20 0 Z" fill="#1982c4" />
    </g>
  </svg>
);

export const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export const ThickLineIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

export const DottedLineIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeDasharray="0.1 6" />
  </svg>
);

export const DashedLineIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeDasharray="6 4" />
  </svg>
);

export const EditIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
  </svg>
);

export const PencilIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="2" x2="22" y2="6" />
    <path d="M7.5 20.5 19 9l-4-4L3.5 16.5 2 22l5.5-1.5z" />
  </svg>
);

export const EraserIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21H7Z" />
    <path d="M22 11.5 12.5 2" />
    <path d="m14 6 6 6" />
  </svg>
);

export const UndoIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 7v6h6" />
    <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
  </svg>
);

export const RedoIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 7v6h-6" />
    <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3-4.3" />
  </svg>
);

export const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 6h18" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

export const RefreshIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M23 4v6h-6"></path>
    <path d="M1 20v-6h6"></path>
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10"></path>
    <path d="M20.49 15a9 9 0 0 1-14.85 3.36L1 14"></path>
  </svg>
);

export const ImageIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <circle cx="8.5" cy="8.5" r="1.5"></circle>
    <polyline points="21 15 16 10 5 21"></polyline>
  </svg>
);

export const PaintBucketIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m19 11-8-8-8.6 8.6a2 2 0 0 0 0 2.8l5.2 5.2c.8.8 2 .8 2.8 0L19 11Z" />
    <path d="m5 2 5 5" />
    <path d="M2 13h15" />
  </svg>
);

export const SprayCanIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 10V8a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v2"/>
    <path d="M12 10V4a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v6"/>
    <path d="M12 10h4"/>
    <path d="M14 10v10a2 2 0 0 1-2 2h0a2 2 0 0 1-2-2v-2"/>
    <path d="M8 12v6a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2v-2"/>
    <path d="M6 12h2"/>
    <path d="M5 15a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h0"/>
    <path d="M3 15a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h0"/>
  </svg>
);
