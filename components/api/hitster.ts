import { getPlayers, Player } from "@/components/api/utils"

export type HitsterPlayer = {
  songs: Song[];
  timeLineSongs: Song[];
  player: Player;
};

export interface Song {
  id: string;
  title: string;
  artist: string;
  coverArt?: string;
  releaseDate: string;
}

const HEADERS = { "User-Agent": "MyMusicApp/1.0 ( myemail@example.com )" };

async function getCoverArt(releaseId: string): Promise<string | undefined> {
  try {
    const res = await fetch(
      `https://coverartarchive.org/release/${releaseId}/front-250`,
      { headers: HEADERS, redirect: "follow" }
    );
    // Returns a redirect to the actual image — use the final URL
    return res.ok ? res.url : undefined;
  } catch {
    return undefined;
  }
}

export async function getSongsByGenre(genre: string): Promise<Song[]> {
  const url = `https://musicbrainz.org/ws/2/recording?query=tag:${genre}&fmt=json&limit=10`;
  const res = await fetch(url, { headers: HEADERS });

  if (!res.ok) throw new Error(`MusicBrainz error: ${res.status}`);

  const data = await res.json();
  const recordings = data.recordings ?? [];

  return Promise.all(
    recordings.map(async (rec: any) => {
      const releaseId = rec.releases?.[0]?.id;
      const coverArt = releaseId ? await getCoverArt(releaseId) : undefined;

      return {
        id: rec.id,
        title: rec.title,
        artist: rec["artist-credit"]?.[0]?.name ?? "Unknown",
        releaseDate: rec["first-release-date"],
        coverArt,
      };
    })
  );
}

export async function getHitsterPlayers(genre: string) : Promise<HitsterPlayer[]> {

  const players = await getPlayers();
  const hitsterPlayers : HitsterPlayer[] = [];

  const songs: Song[] = await getSongsByGenre(genre);

  players.forEach(player=>{
    
    const hplayer: HitsterPlayer = {
      songs: songs,
      timeLineSongs: [],
      player: player
    }

    hitsterPlayers.push(hplayer);

  })
  
  return hitsterPlayers;
}
