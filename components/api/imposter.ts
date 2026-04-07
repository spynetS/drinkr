import { words, Word } from "./words"
import { getPlayers } from "./utils"
import { lobbyPublish } from "./mqttClient"
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function saveNumImposters(numImposters: number) {
  console.log("saving", numImposters)
  await AsyncStorage.setItem('numImposters', JSON.stringify(numImposters));
}

export async function getImposterPlayers() {
  const raw = await AsyncStorage.getItem('numImposters');
  const players = await getPlayers();

  let nI: number = raw ? JSON.parse(raw) : 1;
  let randomNumImposters = true;

  // in 1/10 all players are imposters
  if(Math.floor(Math.random() * 10) === 1) {
    nI = players.length;
  }
  else if (randomNumImposters) {
    const min = 1;
    const max = nI;
    // we have weightedrandom so its less probeble to have more imposters
    const weightedRandom = Math.random() * Math.random(); 
    nI = Math.floor(weightedRandom * (max - min + 1) + min);
  }

  // shuffle the players
  // set the random players to imposter
  // then we shuffle again so the imposters arnt in order
  const shuffled = [...players].sort(() => Math.random() - 0.5);
    const pl = shuffled.map((player, index) => {
        player.imposter = index < nI;
        lobbyPublish("players/imposter", player);
        return player;
    });


    return [...pl].sort(() => Math.random() - 0.5);
}

/**
returns a list of words associated with a category
*/
export function getWords(category: string): Word[] {
  if(category === "Random") {
    const categories = getCategories();
    const ran = Math.floor(Math.random() * (categories.length-1))+1;
    const randomCat = categories[ran];
    return words[randomCat];
  }
  return words[category];
}

export function getCategories(): string[] {
  return ["Random"].concat(Object.keys(words));
}
