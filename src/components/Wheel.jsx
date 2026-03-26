import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

const ALL_ROLES = ['Top', 'Jungle', 'Mid', 'ADC', 'Support'];
const ROLE_LABELS = { 'Top': 'TOP', 'Jungle': 'JNG', 'Mid': 'MID', 'ADC': 'ADC', 'Support': 'SUP' };
const ROLE_ICONS = {
  'Top': "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/svg/position-top.svg",
  'Jungle': "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/svg/position-jungle.svg",
  'Mid': "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/svg/position-middle.svg",
  'ADC': "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/svg/position-bottom.svg",
  'Support': "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/svg/position-utility.svg"
};

export default function Wheel({ onSpinResult, language = 'cs_CZ', selectedRoles, setSelectedRoles }) {
  const [spinning, setSpinning] = useState(false);
  const timeoutRef = useRef(null);
  
  const handleSpinOrSkip = () => {
    if (spinning) {
      // Skip animation
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setSpinning(false);
      onSpinResult(selectedRoles);
    } else {
      // Start spin
      setSpinning(true);
      timeoutRef.current = setTimeout(() => {
        setSpinning(false);
        onSpinResult(selectedRoles);
      }, 3000);
    }
  };

  const toggleRole = (role) => {
    if (spinning) return;
    if (selectedRoles.includes(role)) {
      setSelectedRoles(selectedRoles.filter(r => r !== role));
    } else {
      setSelectedRoles([...selectedRoles, role]);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div 
        className="relative mb-6 flex justify-center items-center cursor-pointer group" 
        onClick={handleSpinOrSkip}
        title={spinning 
          ? (language === 'cs_CZ' ? "Klikni pro přeskočení animace" : "Click to skip animation") 
          : (language === 'cs_CZ' ? "Klikni pro roztočení" : "Click to spin")
        }
      >
        {/* Pointer indicator */}
        <div className="absolute top-[-16px] z-10 text-hextech-gold">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L22 22H2L12 2Z" fill="#cdbe91" className="drop-shadow-lg" />
          </svg>
        </div>

        {/* The Wheel */}
        <motion.div 
          className="w-56 h-56 md:w-80 md:h-80 rounded-full border-[6px] md:border-[8px] border-hextech-gold shadow-[0_0_40px_rgba(205,190,145,0.4)] group-hover:shadow-[0_0_50px_rgba(205,190,145,0.6)] transition-shadow bg-hextech-dark flex items-center justify-center overflow-hidden relative"
          animate={{ rotate: spinning ? 360 * 10 : 0 }} 
          transition={{ duration: spinning ? 3 : 0, ease: 'easeOut' }}
          style={{ background: 'conic-gradient(from 0deg, #005a82 0%, #010a13 50%, #005a82 100%)' }}
        >
          <div className="absolute w-[4px] h-full bg-hextech-border rotate-45"></div>
          <div className="absolute w-[4px] h-full bg-hextech-border -rotate-45"></div>
          <div className="absolute w-[4px] h-full bg-hextech-border rotate-90"></div>
          <div className="absolute w-[4px] h-full bg-hextech-border rotate-0"></div>
          
          <div className="w-12 h-12 md:w-16 md:h-16 bg-hextech-gold rounded-full z-10 shadow-lg border-[3px] md:border-[4px] border-[#4a3f2b]"></div>
        </motion.div>
      </div>
      
      {/* Role selector (same width as button) */}
      <div className="flex justify-between w-64 md:w-72 mb-4">
        {ALL_ROLES.map(role => (
          <button
            key={role}
            onClick={() => toggleRole(role)}
            disabled={spinning}
            title={role}
            className={`w-10 h-10 md:w-12 md:h-12 flex flex-col items-center justify-center rounded border-2 transition-all p-1 ${
              selectedRoles.includes(role) 
                ? 'bg-hextech-gold text-hextech-dark border-hextech-gold shadow-[0_0_15px_rgba(205,190,145,0.6)]' 
                : 'bg-hextech-dark/80 text-hextech-gold border-hextech-border hover:border-hextech-gold'
            }`}
          >
            <img 
               src={ROLE_ICONS[role]} 
               alt={role} 
               className={`w-6 h-6 md:w-7 md:h-7 ${selectedRoles.includes(role) ? 'brightness-0' : 'brightness-150'}`} 
            />
          </button>
        ))}
      </div>
      
      <button 
        onClick={handleSpinOrSkip}
        className={`btn-hextech text-xl md:text-2xl w-64 md:w-72 py-3 md:py-4 ${spinning ? 'opacity-90' : ''}`}
      >
        {spinning 
          ? (language === 'cs_CZ' ? 'Přeskočit' : 'Skip') 
          : (language === 'cs_CZ' ? 'Roztočit' : 'Spin')
        }
      </button>
    </div>
  );
}
