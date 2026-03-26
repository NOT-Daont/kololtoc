import staticPositions from '../data/championPositions.json';

const BASE_API = 'https://ddragon.leagueoflegends.com/api/versions.json';
const BASE_CDN = 'https://ddragon.leagueoflegends.com/cdn';

let latestVersion = null;

// Helper to get latest version
export async function getLatestVersion() {
  if (latestVersion) return latestVersion;
  try {
    const res = await fetch(BASE_API);
    const versions = await res.json();
    latestVersion = versions[0];
    return latestVersion;
  } catch (error) {
    console.error("Failed fetching version, using fallback 14.24.1");
    return '14.24.1';
  }
}

// Fetch general JSON data
async function fetchGameData(endpoint, lang = 'cs_CZ') {
  const version = await getLatestVersion();
  const url = `${BASE_CDN}/${version}/data/${lang}/${endpoint}.json`;
  
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`DataDragon returned ${res.status} for URL: ${url}`);
    return await res.json();
  } catch (err) {
    if (lang !== 'en_US') {
      console.warn(`Falling back to en_US for ${endpoint}`);
      const fallbackUrl = `${BASE_CDN}/${version}/data/en_US/${endpoint}.json`;
      const fallbackRes = await fetch(fallbackUrl);
      if (!fallbackRes.ok) throw new Error(`en_US fallback failed: ${fallbackRes.status}`);
      return await fallbackRes.json();
    }
    throw err;
  }
}

export async function getChampions(lang = 'cs_CZ') {
  const data = await fetchGameData('champion', lang);
  return Object.values(data.data);
}

export function getMerakiPositions() {
  return Promise.resolve(staticPositions);
}

export async function getItems(lang = 'cs_CZ') {
  const data = await fetchGameData('item', lang);
  // API returns object with item IDs as keys
  const itemsArray = Object.entries(data.data).map(([id, info]) => ({ id, ...info }));
  return itemsArray;
}

export async function getRunes(lang = 'cs_CZ') {
  const data = await fetchGameData('runesReforged', lang);
  // It's already an array of trees
  return data;
}

export async function getSpells(lang = 'cs_CZ') {
  const data = await fetchGameData('summoner', lang);
  return Object.values(data.data);
}

// Helpers for image URLs
export function getChampionImage(version, imageName) {
  return `${BASE_CDN}/${version}/img/champion/${imageName}`;
}
export function getItemImage(version, imageName) {
  return `${BASE_CDN}/${version}/img/item/${imageName}`;
}
export function getSpellImage(version, imageName) {
  return `${BASE_CDN}/${version}/img/spell/${imageName}`;
}
export function getRuneImage(runeIconPath) {
  // Runes are weird, their path is like "perk-images/Styles/..."
  return `https://ddragon.leagueoflegends.com/cdn/img/${runeIconPath}`;
}
