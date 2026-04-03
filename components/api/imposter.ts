import { words, Word } from "./words"
import { getPlayers } from "./utils"
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function saveNumImposters(numImposters: number) {
  console.log("saving", numImposters)
  await AsyncStorage.setItem('numImposters', JSON.stringify(numImposters));
}
export async function getImposterPlayers() {
  const raw = await AsyncStorage.getItem('numImposters');
  const players = await getPlayers();

  let nI: number = raw ? JSON.parse(raw) : 1; // fallback to 1
  let randomNumImposters = true;

  
  if (randomNumImposters) {
    const min = 1;
    const max = nI;
    nI = Math.floor(Math.random() * (max - min + 1) + min);
  }

  const shuffled = [...players].sort(() => Math.random() - 0.5);

  const pl = shuffled.map((player, index) => ({
    ...player,
    imposter: index < nI,
  }));

  return [...pl].sort(() => Math.random() - 0.5);
}

/**
returns a list of words associated with a category
*/
export function getWords(category: string): Word[] {
  return words[category];
}
export function getCategories(): string[] {
  return Object.keys(words);
}
