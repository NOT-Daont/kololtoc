import React, { useState } from 'react';
import Wheel from './components/Wheel';
import ResultBoard from './components/ResultBoard';
import { generateRandomLoadout } from './utils/generator';
import { getChampionImage } from './api/dataDragon';

function App() {
  const [appState, setAppState] = useState(1);
  const [loadout, setLoadout] = useState(null);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('cs_CZ');
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [bgVisible, setBgVisible] = useState(false);

  const handleSpinResult = async (rolesFromWheel) => {
    setLoading(true);
    const rolesToUse = (rolesFromWheel && rolesFromWheel.length > 0) ? rolesFromWheel : selectedRoles;
    try {
      const data = await generateRandomLoadout(rolesToUse, language);
      setLoadout(data);
      setAppState(2);
      setBgVisible(false);
      // Delay so image has time to start loading before we fade it in
      setTimeout(() => setBgVisible(true), 200);
    } catch (error) {
      console.error("Generator failed", error);
      alert("Chyba při stahování dat: " + error.message + "\n\n" + (error.stack || ''));
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setAppState(1);
    setLoadout(null);
    setBgVisible(false);
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'cs_CZ' ? 'en_US' : 'cs_CZ');
  };

  // Champion splash art for background
  const bgImage = loadout?.champion ? `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${loadout.champion.id}_0.jpg` : null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-4 relative overflow-hidden transition-all duration-1000">
      
      {/* Background with Champion Splash (if loaded) or default hextech decorations */}
      {appState === 2 && bgImage ? (
        <div 
          className={`absolute inset-0 -z-20 bg-center bg-cover bg-no-repeat blur-sm scale-105 transition-opacity duration-[2000ms] ease-in ${bgVisible ? 'opacity-45' : 'opacity-0'}`}
          style={{ backgroundImage: `url(${bgImage})` }}
        />
      ) : (
        <div className="absolute inset-0 -z-20">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-hextech-blue/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-hextech-gold/10 rounded-full blur-[100px]"></div>
        </div>
      )}
      
      {/* Black overlay that fades OUT as bg image fades IN */}
      {appState === 2 && (
        <div
          className={`absolute inset-0 z-0 bg-black transition-opacity duration-[2500ms] ease-out pointer-events-none ${bgVisible ? 'opacity-0' : 'opacity-100'}`}
        />
      )}

      {/* Dimming overlay so text is readable – only when bg is visible */}
      <div className={`absolute inset-0 -z-10 bg-hextech-dark/40 transition-opacity duration-[2000ms] ${bgVisible ? 'opacity-100' : 'opacity-0'}`}></div>
      
      {/* Language Toggle Button */}
      {appState === 1 && (
        <button 
          onClick={toggleLanguage}
          className="absolute top-4 left-4 lg:top-6 lg:left-6 z-50 btn-hextech py-2 px-4 shadow-[0_0_15px_rgba(205,190,145,0.4)] text-sm lg:text-base font-bold tracking-widest hover:scale-105 transition-transform"
          title="Toggle Language / Přepnout jazyk"
        >
          {language === 'cs_CZ' ? '🇨🇿 CZ' : '🇬🇧 EN'}
        </button>
      )}

      <div className="w-full flex-1 flex flex-col items-center justify-center max-w-7xl z-10 pt-16 lg:pt-0">
        <header className={`transition-all duration-500 text-center flex-none ${appState === 1 ? 'mb-6 mt-4' : 'mb-2 mt-1'}`}>
          <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-hextech-gold via-yellow-200 to-hextech-gold drop-shadow-[0_2px_10px_rgba(205,190,145,0.4)] tracking-tighter uppercase font-serif">
            Kololtoč
          </h1>
        </header>

        <main className="w-full relative flex-1 flex flex-col items-center justify-center">
          {appState === 1 ? (
            <Wheel 
              onSpinResult={handleSpinResult} 
              language={language} 
              selectedRoles={selectedRoles} 
              setSelectedRoles={setSelectedRoles} 
            />
          ) : (
            <ResultBoard loadout={loadout} onReset={handleReset} language={language} />
          )}
        </main>
      </div>
      
      {/* Footer area for Loading State */}
      <footer className="w-full flex flex-col items-center justify-end z-50 mt-6 mb-2 flex-none gap-3">
        {loading && appState === 1 && (
          <div className="text-hextech-gold animate-pulse font-medium">
             {language === 'cs_CZ' ? 'Načítám data z Data Dragon...' : 'Loading Data Dragon assets...'}
          </div>
        )}
      </footer>
    </div>
  );
}

export default App;
