import { getChampions, getItems, getRunes, getSpells, getLatestVersion, getMerakiPositions } from '../api/dataDragon';

export const ROLES = ['Top', 'Jungle', 'Mid', 'ADC', 'Support'];

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomItems(array, count, exclude = []) {
  const result = [];
  const pool = array.filter(item => !exclude.includes(item));
  for (let i = 0; i < count; i++) {
    if (pool.length === 0) break;
    const index = Math.floor(Math.random() * pool.length);
    result.push(pool[index]);
    pool.splice(index, 1);
  }
  return result;
}

export async function generateRandomLoadout(allowedRoles = [], lang = 'cs_CZ', randomMode = false) {
  // 1. Fetch all data
  const [champions, allItems, runes, spells, version, posMap] = await Promise.all([
    getChampions(lang),
    getItems(lang),
    getRunes(lang),
    getSpells(lang),
    getLatestVersion(),
    getMerakiPositions()
  ]);

  // 2. Select Role
  const rolePool = allowedRoles.length > 0 ? allowedRoles : ROLES;
  const role = getRandomItem(rolePool);

  // 3. Select Champion
  let champion;
  if (randomMode) {
    // Random mode: any champion, regardless of their lane
    champion = getRandomItem(champions);
  } else {
    // Normal mode: only champions that belong to the selected role
    if (Object.keys(posMap).length === 0) {
      throw new Error('Pozice šampionů se nepodařilo načíst. Zkuste to prosím znovu.');
    }
    const LANE_POSITION = {
      'Top':     'TOP',
      'Jungle':  'JUNGLE',
      'Mid':     'MIDDLE',
      'ADC':     'BOTTOM',
      'Support': 'SUPPORT',
    };
    const getChampionsForRole = (champs, r) => {
      const laneKey = LANE_POSITION[r];
      return champs.filter(c => {
        const positions = posMap[c.name] || [];
        if (positions.length === 0) return false;
        return positions.includes(laneKey);
      });
    };
    const validChampions = getChampionsForRole(champions, role);
    if (validChampions.length === 0) {
      throw new Error(`Žádný šampion nebyl nalezen pro roli ${role}. Zkuste to znovu.`);
    }
    champion = getRandomItem(validChampions);
  }

  // 4. Select Spells
  const validSpells = spells.filter(s => s.modes.includes('CLASSIC'));
  
  let selectedSpells = [];
  if (role === 'Jungle') {
    const smite = validSpells.find(s => s.id === 'SummonerSmite');
    const others = validSpells.filter(s => s.id !== 'SummonerSmite');
    selectedSpells = [smite, getRandomItem(others)];
  } else {
    const nonSmiteSpells = validSpells.filter(s => s.id !== 'SummonerSmite');
    selectedSpells = getRandomItems(nonSmiteSpells, 2);
  }

  // 5. Select Items
  const uniqueNames = new Set();
  const validMap11Item = (i) => i.maps && i.maps['11'] === true && i.inStore !== false && i.gold?.purchasable !== false;
  
  // ID itemů z Arény, staré itemy odstraněné z normal hry, atd. (univerzální pro všechny jazyky včetně cs_CZ)
  // Zephyr (3172) byl odebrán z blacklistu, aby se mohl objevovat jako T3 boty.
  const blacklistIds = [
    "3039", "3131", "3193", "4011", "4403", "4636", "4644", "6035", "6630", "6632", "6655", 
    "6656", "6667", "6671", "6691", "6693", "124011", "223039", "223193", "224403", 
    "224636", "224644", "226035", "226630", "226632", "226655", "226656", "226667", "226671", 
    "226691", "226693", "443056", "443060", "443079", "443193", "444636", "444644", "446632", 
    "446656", "446667", "446671", "446691", "446693", "447101", "447107", "447109", "447112", 
    "663039", "663056", "663058", "663060", "663193", "664011", "664403", "664644", "667101", 
    "667109", "667112", "994403"
  ];
  
  const isAllowedLegendary = (i) => {
    return i.gold.total > 1600 && 
           validMap11Item(i) && 
           !i.name.includes("Enchantment") && 
           !i.name.includes("Očarování") && 
           !i.name.includes("Kápě hvězdné noci") && 
           !i.name.includes("Cloak of Starry") &&
           !i.requiredAlly &&
           !blacklistIds.includes(i.id) &&
           !(i.description && i.description.toLowerCase().includes("arén"));
  };

  const boots = allItems.filter(i => {
    // Basic filter for boots tag and >400 gold
    if (i.tags && i.tags.includes('Boots') && Number(i.gold.total) > 400 && validMap11Item(i) && !blacklistIds.includes(i.id)) {
      
      // Tier 3 boots IDs (all level 15 upgrades + Synchronized Souls)
      const TIER3_IDS = ["3013", "3170", "3171", "3172", "3173", "3174", "3175", "3176"];
      const isTier3 = TIER3_IDS.includes(i.id);
      
      if (role === 'Mid') {
        if (!isTier3) return false; // Mid ONLY gets Tier 3 boots
      } else {
        if (isTier3) return false; // Others ONLY get Tier 2 boots
      }

      if (!uniqueNames.has(i.name)) {
        uniqueNames.add(i.name);
        return true;
      }
    }
    return false;
  });

  // Support starters limit to 5 final evolutions:
  // 3869 (Celestial Opposition), 3870 (Dream Maker), 3871 (Zaz'Zak's Realmspike), 3876 (Solstice Sleigh), 3877 (Bloodsong)
  // Do NOT use validMap11Item(i) because Support quest rewards have inStore/purchasable sets to false!
  const starterSupport = allItems.filter(i => ["3869", "3870", "3871", "3876", "3877"].includes(i.id));
  
  const legendaryItems = allItems.filter(i => {
    if (isAllowedLegendary(i)) {
      if (!uniqueNames.has(i.name)) {
        uniqueNames.add(i.name);
        return true;
      }
    }
    return false;
  });

  let buildBoots = getRandomItem(boots) || boots[0]; // fallback
  
  let starterItemOptions = [];
  if (role === 'Support') {
    starterItemOptions = starterSupport;
  } else if (role === 'Jungle') {
    const pets = allItems.filter(i => ['1101', '1102', '1103'].includes(i.id));
    starterItemOptions = pets;
  } else {
    // Doran's items
    const dorans = allItems.filter(i => ['1054', '1055', '1056'].includes(i.id));
    starterItemOptions = dorans;
  }
  
  let starterItem = starterItemOptions.length > 0 ? getRandomItem(starterItemOptions) : null;
  
  // ADC = 6 legendaries. Others = 5 legendaries.
  const legendaryCount = role === 'ADC' ? 6 : 5;
  const coreBuild = getRandomItems(legendaryItems, legendaryCount);

  // 6. Select Runes
  const primaryTree = getRandomItem(runes);
  const secondaryTrees = runes.filter(r => r.id !== primaryTree.id);
  const secondaryTree = getRandomItem(secondaryTrees);

  const primaryRunes = [
    getRandomItem(primaryTree.slots[0].runes), // keystone
    getRandomItem(primaryTree.slots[1].runes), // row 1
    getRandomItem(primaryTree.slots[2].runes), // row 2
    getRandomItem(primaryTree.slots[3].runes), // row 3
  ];

  const secRows = [1, 2, 3];
  const chosenSecRows = getRandomItems(secRows, 2);
  const secondaryRunes = [
    getRandomItem(secondaryTree.slots[chosenSecRows[0]].runes),
    getRandomItem(secondaryTree.slots[chosenSecRows[1]].runes),
  ];

  const isCZ = lang === 'cs_CZ';
  const statShardsOptions = {
    offense: [
      { name: isCZ ? "Adaptivní síla" : "Adaptive Force", icon: "perk-images/StatMods/StatModsAdaptiveForceIcon.png" },
      { name: isCZ ? "Rychlost útoků" : "Attack Speed", icon: "perk-images/StatMods/StatModsAttackSpeedIcon.png" },
      { name: isCZ ? "Zrychlení schopností" : "Ability Haste", icon: "perk-images/StatMods/StatModsCDRScalingIcon.png" }
    ],
    flex: [
      { name: isCZ ? "Adaptivní síla" : "Adaptive Force", icon: "perk-images/StatMods/StatModsAdaptiveForceIcon.png" },
      { name: isCZ ? "Rychlost pohybu" : "Movement Speed", icon: "perk-images/StatMods/StatModsMovementSpeedIcon.png" },
      { name: isCZ ? "Zvyšování zdraví" : "Health Scaling", icon: "perk-images/StatMods/StatModsHealthScalingIcon.png" }
    ],
    defense: [
      { name: isCZ ? "Zdraví" : "Health", icon: "perk-images/StatMods/StatModsHealthPlusIcon.png" },
      { name: isCZ ? "Houževnatost" : "Tenacity", icon: "perk-images/StatMods/StatModsTenacityIcon.png" },
      { name: isCZ ? "Zvyšování zdraví" : "Health Scaling", icon: "perk-images/StatMods/StatModsHealthScalingIcon.png" }
    ]
  };
  const statShards = [
    getRandomItem(statShardsOptions.offense),
    getRandomItem(statShardsOptions.flex),
    getRandomItem(statShardsOptions.defense),
  ];

  return {
    version,
    role,
    champion,
    spells: selectedSpells,
    build: {
      starter: starterItem,
      boots: buildBoots,
      core: coreBuild
    },
    runes: {
      primaryTreeInfo: primaryTree,
      primaryRuneSelection: primaryRunes,
      secondaryTreeInfo: secondaryTree,
      secondaryRuneSelection: secondaryRunes,
      shards: statShards
    }
  };
}
