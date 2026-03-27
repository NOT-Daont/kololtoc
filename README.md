# 🎰 Kololtoč – League of Legends Loadout Generator

Webová aplikace pro náhodné generování loadoutů (build, runy, summoner spelly) pro League of Legends. Postavena v **React + Vite + Tailwind CSS** s hextech-tématickým UI.

## ✨ Funkce

- 🎡 **Interaktivní kolo** – kliknutím nebo tlačítkem roztočíš kolo, animaci lze přeskočit
- 🎭 **Role filtry** – vyber TOP, JNG, MID, ADC nebo SUP a dostaneš pouze šampiony na danou linku
- 🧪 **Náhodný loadout** – summoner spelly, itemy, runy pro vybrané linku šampiona
- 🌍 **Čeština / Angličtina** – plná lokalizace UI i herních dat
- 🎨 **Hextech UI** – tmavé zlaté zbarvení, animace, fade-in obrázek šampiona
- ☕ **Ko-fi podpora** – plovoucí widget pro podporu autora

## 🚀 Instalace

```bash
npm install
npm run dev
```

## 🔨 Build

```bash
npm run build
```

## 📦 Technologie

| Technologie | Použití |
|---|---|
| React 18 | UI komponenty |
| Vite 4 | Build tool + dev server |
| Tailwind CSS | Stylování |
| Framer Motion | Animace kola |
| Riot Data Dragon | Data šampionů, itemů, run |

## 📁 Struktura

```
src/
├── api/          # Data Dragon API & Meraki loader
├── components/   # Wheel, ResultBoard
├── data/         # Statický JSON s pozicemi šampionů
├── utils/        # Generator logika
└── App.jsx       # Hlavní komponenta
```

## 📝 Poznámky

- Data šampionů se stahují živě z [Riot Data Dragon](https://ddragon.leagueoflegends.com)
- Pozice šampionů (která linka) jsou bundlované staticky v `src/data/championPositions.json`
- Pro aktualizaci pozic po větším patchi spusť script z Meraki Analytics

---

Made with ❤️ by **daont** | [Ko-fi](https://ko-fi.com/daont)
>>>>>>> 8cf9ef0 (Initial commit – Kololtoč LoL Generator)
