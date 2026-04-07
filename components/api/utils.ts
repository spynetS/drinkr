import AsyncStorage from '@react-native-async-storage/async-storage';

type Player = {
    name: string;
    pk?: number;
    penelties?:number;
};

function playerEquals(p1:Player, p2:Player) {
    return (p1.pk !== undefined && p2.pk !== undefined && p1.pk == p2.pk) || p1.name === p2.name;
}
import { lobbyPublish } from './mqttClient';

export async function addPlayer(player: Player, publish=true) {
    const raw = await AsyncStorage.getItem('players');
    let players = raw ? JSON.parse(raw) : [];
    const exists = players.some((p: Player) => playerEquals(p, player));

    if (exists)
        throw new Error("Player already exists")

    players.push(player);
    await savePlayers(players);
    if(publish)
        lobbyPublish('players/add', player);
    return player;
}

export async function removePlayer(player: Player) {
    const raw = await AsyncStorage.getItem('players');
    let players: Player[] = raw ? JSON.parse(raw) : [];
    players = players.filter(p => !playerEquals(p, player));
    await savePlayers(players);
    lobbyPublish('players/remove', player);
    return players;
}

export async function playerPenelty(player: Player) {
    player.penelties = (player.penelties ?? 0) + 1;
    const saved = await savePlayer(player);
    lobbyPublish('players/penalty', saved);
    return saved;
}

export async function savePlayers(players:Player[]) {
    console.log("saving", players)
    await AsyncStorage.setItem('players', JSON.stringify(players));
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

export async function savePlayer(player: Player) {
    let players = await getPlayers();
    const index = players.findIndex(p => ((p.pk !== undefined && player.pk !== undefined ) && p.pk === player.pk) || p.name === player.name);
    if (index === -1) {
        players.push(player);
    } else {
        players[index] = player;
    }
    await savePlayers(players);
    return player;
}

export async function setLobbyCode(code:string) : string {
    await AsyncStorage.setItem("lobby", code);
    return code
}

export async function getLobbyCode() : string {
    return await AsyncStorage.getItem("lobby");
}


export async function startGame(game:string) {
    lobbyPublish("startGame",game)
}
