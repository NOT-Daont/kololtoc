import React from 'react';
import { getChampionImage, getItemImage, getSpellImage, getRuneImage } from '../api/dataDragon';

const ROLE_ICONS = {
  'Top': "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/svg/position-top.svg",
  'Jungle': "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/svg/position-jungle.svg",
  'Mid': "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/svg/position-middle.svg",
  'ADC': "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/svg/position-bottom.svg",
  'Support': "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/svg/position-utility.svg"
};
const ROLE_LABELS = { 'Top': 'TOP', 'Jungle': 'JNG', 'Mid': 'MID', 'ADC': 'ADC', 'Support': 'SUP' };

export default function ResultBoard({ loadout, onReset, language = 'cs_CZ' }) {
  if (!loadout) return null;

  const { version, role, champion, spells, build, runes } = loadout;
  
  const t = {
    runes: language === 'cs_CZ' ? 'Runy' : 'Runes',
    build: language === 'cs_CZ' ? 'Build' : 'Build',
    starter: language === 'cs_CZ' ? 'Začátek' : 'Starter',
    boots: language === 'cs_CZ' ? 'Boty' : 'Boots',
    core: language === 'cs_CZ' ? 'Dokončené předměty' : 'Core Items',
    none: language === 'cs_CZ' ? 'Nic' : 'None',
    spinAgain: language === 'cs_CZ' ? 'Znovu losovat' : 'Spin Again'
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col items-center animate-fadeIn">
    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-8 mb-6">
        
        {/* Left Column: Runes – mobile order 2, desktop order 1 */}
        <div className="order-2 md:order-1 border border-hextech-border p-4 lg:p-6 rounded-lg bg-hextech-dark/80 shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex flex-col items-center">
          <h2 className="text-xl lg:text-2xl font-bold mb-4 border-b border-hextech-border pb-2 w-full text-center text-white">{t.runes}</h2>
          
          <div className="flex w-full justify-around mb-4">
            {/* Primary tree */}
            <div className="flex flex-col items-center">
              <img 
                src={getRuneImage(runes.primaryTreeInfo.icon)} 
                alt={runes.primaryTreeInfo.name} 
                className="w-14 h-14 lg:w-16 lg:h-16 mb-4"
                title={runes.primaryTreeInfo.name}
              />
              {runes.primaryRuneSelection.map((rune, idx) => (
                <img 
                  key={rune.id} 
                  src={getRuneImage(rune.icon)} 
                  alt={rune.name} 
                  className={`mb-3 ${idx === 0 ? 'w-16 h-16 lg:w-20 lg:h-20 border-2 border-hextech-gold rounded-full' : 'w-12 h-12 lg:w-14 lg:h-14'} rounded-full bg-black/50 p-1 shadow-md`} 
                  title={rune.name}
                />
              ))}
            </div>
            
            {/* Secondary tree */}
            <div className="flex flex-col items-center">
               <img 
                src={getRuneImage(runes.secondaryTreeInfo.icon)} 
                alt={runes.secondaryTreeInfo.name} 
                className="w-10 h-10 lg:w-12 lg:h-12 mb-4 opacity-80"
                title={runes.secondaryTreeInfo.name}
              />
              {runes.secondaryRuneSelection.map((rune) => (
                <img key={rune.id} src={getRuneImage(rune.icon)} alt={rune.name} className="w-12 h-12 lg:w-14 lg:h-14 mb-3 rounded-full bg-black/50 p-1 shadow-md" title={rune.name} />
              ))}

              {/* Stat Shards */}
              <div className="mt-4 flex flex-col items-center border-t border-hextech-border/50 pt-4 w-full">
                {runes.shards.map((shard, idx) => (
                   <img 
                     key={idx} 
                     src={getRuneImage(shard.icon)} 
                     alt={shard.name} 
                     className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-black/80 border border-gray-600 mb-2 p-1" 
                     title={shard.name} 
                   />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Middle Column: Champion & Spells – mobile order 1, desktop order 2 */}
        <div className="order-1 md:order-2 border border-hextech-gold p-4 lg:p-6 rounded-lg bg-gradient-to-b from-hextech-blue/20 to-hextech-dark shadow-[0_0_30px_rgba(205,190,145,0.15)] relative overflow-hidden flex flex-col items-center">
          
          <h2 className="text-3xl lg:text-4xl font-black mb-3 mt-1 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] text-center">
            {champion.name}
            <span className="block text-sm font-normal text-hextech-gold mt-1">{champion.title}</span>
          </h2>
          
          <div className="w-28 h-28 lg:w-32 lg:h-32 relative mb-3 group">
            <div className="absolute inset-0 rounded-full border-[4px] border-transparent group-hover:block blur-[4px] z-0"></div>
            <img 
              src={getChampionImage(version, champion.image.full)} 
              alt={champion.name} 
              className="w-full h-full object-cover rounded-full border-4 border-hextech-gold shadow-[0_0_20px_rgba(0,0,0,1)] relative z-10"
            />
          </div>

          <div className="flex items-center gap-3 mb-4 bg-hextech-dark/80 border-[2px] border-hextech-gold px-4 py-2 rounded-full shadow-[0_0_15px_rgba(205,190,145,0.5)] transform hover:scale-105 transition-transform duration-300">
            <img src={ROLE_ICONS[role]} alt={role} className="w-6 h-6 lg:w-8 lg:h-8" />
            <span className="text-sm lg:text-base font-black tracking-[0.2em] text-hextech-gold uppercase drop-shadow-md">{ROLE_LABELS[role]}</span>
          </div>
          
          <div className="flex gap-4 lg:gap-6 mt-1">
            {spells.map((spell) => (
               <img 
                 key={spell.id}
                 src={getSpellImage(version, spell.image.full)} 
                 alt={spell.name} 
                 className="w-12 h-12 lg:w-16 lg:h-16 rounded border-2 border-hextech-border shadow-lg"
                 title={spell.name}
               />
            ))}
          </div>
        </div>

        {/* Right Column: Build – mobile order 3, desktop order 3 */}
        <div className="order-3 border border-hextech-border p-3 lg:p-4 rounded-lg bg-hextech-dark/80 shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex flex-col items-center">
          <h2 className="text-lg lg:text-xl font-bold mb-3 border-b border-hextech-border pb-2 text-center text-white w-full">{t.build}</h2>
          
          <div className="flex-1 w-full flex flex-col items-center">
            
            {/* Top Row: Starter (Left), Boots (Right) using the same grid layout */}
            <div className="grid grid-cols-3 gap-4 w-full mb-4">
              <div className="flex flex-col items-center justify-self-center col-start-1">
                <span className="text-[10px] lg:text-xs text-hextech-gold mb-2 uppercase tracking-wide whitespace-nowrap">{t.starter}</span>
                <div className="bg-black/50 p-1.5 lg:p-2 rounded border border-hextech-gold/80 shadow-[0_0_10px_rgba(205,190,145,0.1)] flex justify-center items-center">
                   {build.starter ? (
                     <img src={getItemImage(version, build.starter.image.full)} alt={build.starter.name} className="w-12 h-12 lg:w-16 lg:h-16 rounded border border-hextech-gold" title={build.starter.name} />
                   ) : (
                     <div className="w-12 h-12 lg:w-16 lg:h-16 rounded border border-gray-600/50 flex items-center justify-center text-hextech-gold text-xs">{t.none}</div>
                   )}
                </div>
              </div>
              
              <div className="flex flex-col items-center justify-self-center col-start-3">
                <span className="text-[10px] lg:text-xs text-hextech-gold mb-2 uppercase tracking-wide">{t.boots}</span>
                <div className="bg-black/50 p-1.5 lg:p-2 rounded border border-hextech-gold/80 shadow-[0_0_10px_rgba(205,190,145,0.1)] flex justify-center items-center">
                   {build.boots && (
                     <img src={getItemImage(version, build.boots.image.full)} alt={build.boots.name} className="w-12 h-12 lg:w-16 lg:h-16 rounded border border-hextech-gold" title={build.boots.name} />
                   )}
                </div>
              </div>
            </div>

            {/* Core Build Grid */}
            <span className="text-[10px] lg:text-xs text-hextech-gold mb-2 uppercase tracking-widest border-b border-hextech-border/30 pb-1 w-full text-center">{t.core}</span>
            <div className="grid grid-cols-3 gap-3 w-full">
              {build.core.map((item, idx) => (
                <div key={idx} className="bg-black/50 p-1 lg:p-1.5 rounded border border-hextech-gold/80 flex justify-center items-center shadow-[0_0_10px_rgba(205,190,145,0.1)] hover:scale-105 transition-transform justify-self-center">
                   <img 
                      src={getItemImage(version, item.image.full)} 
                      alt={item.name} 
                      className="w-10 h-10 lg:w-14 lg:h-14 object-cover border border-hextech-gold" 
                      title={item.name} 
                    />
                </div>
              ))}
            </div>
            
          </div>
        </div>

      </div>
      
      <button 
        onClick={onReset}
        className="btn-hextech text-lg lg:text-xl py-2 px-8"
      >
        {t.spinAgain}
      </button>
    </div>
  );
}
