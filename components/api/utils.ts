import AsyncStorage from '@react-native-async-storage/async-storage';

type Player = {
  name: string;
  pk?: number;
};


export async function savePlayers(players:Player[]) {
  console.log("saving", players)
  await AsyncStorage.setItem('players', JSON.stringify(players));
}

export async function addPlayer(player:Player) {
  const raw = await AsyncStorage.getItem("players")
  let players = raw ? JSON.parse(raw) : [];
  console.log(players)
  players.push(player)
  await savePlayers(players);
  return player;
}

export async function removePlayer(player: Player) {
  const raw = await AsyncStorage.getItem("players");
  let players: Player[] = raw ? JSON.parse(raw) : [];
  players = players.filter(p => p.pk !== player.pk);
  await savePlayers(players);
}
/**
Returns the players
*/
export async function getPlayers() : Promise<void> {
  if(false){
    axios.get('/users')
      .then(response => setPlayers(response.data))
      .catch(error => console.error('Error fetching users:', error));
  } else {
    const raw = await AsyncStorage.getItem("players")
    return raw ? (JSON.parse(raw) as Player[]) : [];
  }
}



