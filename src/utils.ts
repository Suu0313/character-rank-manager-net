// 経験値テーブル
export const expTable = [
  { exp: 2, statue: 0, rainbow: 0 }, // RANK ~ 5
  { exp: 2, statue: 0, rainbow: 0 }, // RANK ~ 10
  { exp: 10, statue: 0, rainbow: 0 }, // RANK ~ 15
  { exp: 15, statue: 1, rainbow: 0 }, // RANK ~ 20
  { exp: 20, statue: 1, rainbow: 0 }, // RANK ~ 25
  { exp: 30, statue: 2, rainbow: 0 }, // RANK ~ 30
  { exp: 40, statue: 2, rainbow: 0 }, // RANK ~ 35
  { exp: 50, statue: 2, rainbow: 0 }, // RANK ~ 40
  { exp: 60, statue: 2, rainbow: 0 }, // RANK ~ 45
  { exp: 70, statue: 2, rainbow: 0 }, // RANK ~ 50
  { exp: 90, statue: 0, rainbow: 1 }, // RANK ~ 55
  { exp: 110, statue: 3, rainbow: 0 }, // RANK ~ 60
  { exp: 130, statue: 3, rainbow: 0 }, // RANK ~ 65
  { exp: 150, statue: 3, rainbow: 0 }, // RANK ~ 70
  { exp: 170, statue: 3, rainbow: 0 }, // RANK ~ 75
  { exp: 190, statue: 4, rainbow: 0 }, // RANK ~ 80
  { exp: 210, statue: 4, rainbow: 0 }, // RANK ~ 85
  { exp: 230, statue: 4, rainbow: 0 }, // RANK ~ 90
  { exp: 250, statue: 4, rainbow: 0 }, // RANK ~ 95
  { exp: 270, statue: 4, rainbow: 0 }, // RANK ~ 100
  { exp: 300, statue: 0, rainbow: 1 }, // RANK ~ 105
  { exp: 330, statue: 5, rainbow: 0 }, // RANK ~ 110
  { exp: 360, statue: 5, rainbow: 0 }, // RANK ~ 115
  { exp: 390, statue: 5, rainbow: 0 }, // RANK ~ 120
  { exp: 420, statue: 5, rainbow: 0 }, // RANK ~ 125
  { exp: 450, statue: 6, rainbow: 0 }, // RANK ~ 130
  { exp: 480, statue: 6, rainbow: 0 }, // RANK ~ 135
  { exp: 510, statue: 6, rainbow: 0 }, // RANK ~ 140
  { exp: 540, statue: 6, rainbow: 0 }, // RANK ~ 145
  { exp: 570, statue: 6, rainbow: 0 }, // RANK ~ 150
  { exp: 610, statue: 0, rainbow: 2 }, // RANK ~ 155
  { exp: 650, statue: 7, rainbow: 0 }, // RANK ~ 160
  { exp: 690, statue: 7, rainbow: 0 }, // RANK ~ 165
  { exp: 730, statue: 7, rainbow: 0 }, // RANK ~ 170
  { exp: 770, statue: 7, rainbow: 0 }, // RANK ~ 175
  { exp: 810, statue: 8, rainbow: 0 }, // RANK ~ 180
  { exp: 850, statue: 8, rainbow: 0 }, // RANK ~ 185
  { exp: 890, statue: 8, rainbow: 0 }, // RANK ~ 190
  { exp: 930, statue: 8, rainbow: 0 }, // RANK ~ 195
  { exp: 970, statue: 8, rainbow: 0 } // RANK ~ 200 (MAX)
];

export function calculateRequiredExp(currentRank: number, targetRank: number, isMax: boolean) {
  let exp = 0, statue = 0, rainbow = 0;
  const defaultRank = currentRank;
  if (currentRank >= targetRank) return { exp, statue, rainbow };
  for (let index = 0; index < expTable.length; index++) {
    const minRank = index * 5, maxRank = minRank + 4;
    if (maxRank < currentRank) continue;
    if (targetRank <= minRank) break;
    // 限界突破
    if (currentRank === minRank) {
      if (!(currentRank === defaultRank && !isMax)) {
        statue += expTable[index].statue;
        rainbow += expTable[index].rainbow;
      }
    }
    if (targetRank <= maxRank) {
      exp += expTable[index].exp * (targetRank - currentRank);
    } else {
      exp += expTable[index].exp * (maxRank - currentRank + 1);
    }
    currentRank = maxRank + 1;
  }
  return { exp, statue, rainbow };
}

/**
 * Calculate total experience required from rank 1 to a given rank
 * Used for progress display calculations
 * @param rank - Target rank (1-200)
 * @returns Total experience points required from rank 1 to target rank
 */
export function calculateTotalExpFromRank1(rank: number): number {
  return calculateRequiredExp(1, rank, false).exp;
}

export const irodorimidoriCharacters = [
  "明坂 芹菜",
  "御形 アリシアナ",
  "天王洲 なずな",
  "小仏 凪",
  "箱部 なる",
  "月鈴 那知",
  "月鈴 白奈",
  "五十嵐 撫子",
  "萩原 七々瀬",
  "葛城 華",
  "小野 美苗",
  "藤堂 陽南袴",
  "桔梗 小夜曲",
  "芒崎 奏"
] as const;

import LZString from 'lz-string';

/**
 * Character data structure for compression
 */
interface CharacterData {
  name: string;
  charaId: string;
  imgSrc: string;
  rank: string;
  isMax: boolean;
}

/**
 * Base URL for character images
 */
const IMAGE_BASE_URL = "https://new.chunithm-net.com/chuni-mobile/html/mobile/img/";

/**
 * Convert character data to compressed array format
 */
export function compressCharacterData(characters: CharacterData[]): string {
  try {
    const compressed = characters.map(char => [
      char.name,
      char.charaId,
      char.imgSrc.startsWith(IMAGE_BASE_URL) ? char.imgSrc.substring(IMAGE_BASE_URL.length) : char.imgSrc,
      char.rank,
      char.isMax ? 1 : 0
    ]);
    return LZString.compressToEncodedURIComponent(JSON.stringify(compressed));
  } catch (error) {
    console.error('Failed to compress character data:', error);
    return '';
  }
}

/**
 * Decompress compressed array format back to character data
 */
export function decompressCharacterData(compressedData: string): CharacterData[] {
  try {
    // Use LZ-string decompression 
    const lzDecompressed = LZString.decompressFromEncodedURIComponent(compressedData);
    if (!lzDecompressed) {
      throw new Error('LZ-string decompression failed');
    }
    
    const decompressed = JSON.parse(lzDecompressed);
    
    if (!Array.isArray(decompressed)) {
      throw new Error('Decompressed data is not an array');
    }
    
    return decompressed.map((item: unknown) => {
      if (Array.isArray(item) && item.length === 5) {
        // New compressed format: [name, charaId, imgFile, rank, isMax]
        return {
          name: String(item[0]),
          charaId: String(item[1]),
          imgSrc: String(item[2]).startsWith('http') ? String(item[2]) : IMAGE_BASE_URL + String(item[2]),
          rank: String(item[3]),
          isMax: Boolean(item[4])
        };
      } else if (typeof item === 'object' && item !== null) {
        // Old format: full object (for backward compatibility)
        const obj = item as Record<string, unknown>;
        return {
          name: String(obj.name || ''),
          charaId: String(obj.charaId || ''),
          imgSrc: String(obj.imgSrc || ''),
          rank: String(obj.rank || ''),
          isMax: Boolean(obj.isMax)
        };
      } else {
        throw new Error('Invalid item format');
      }
    });
  } catch (error) {
    console.error('Failed to decompress character data:', error);
    return [];
  }
}

/**
 * Simple compression using base64 encoding for URL parameters (legacy function)
 * For larger data, we could use LZ-string, but base64 should be sufficient for most cases
 */
export function compressData(data: string): string {
  try {
    return btoa(encodeURIComponent(data));
  } catch (error) {
    console.error('Failed to compress data:', error);
    return '';
  }
}

/**
 * Decompress data that was compressed with compressData (legacy function)
 */
export function decompressData(compressedData: string): string {
  try {
    return decodeURIComponent(atob(compressedData));
  } catch (error) {
    console.error('Failed to decompress data:', error);
    return '';
  }
}
