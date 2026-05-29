
export type MusicBrainzRecording = {
    id: string;
    title: string;
    "artist-credit": {
        name: string;
    }[];
    "first-release-date"?: string;
    order:number;
};

export async function getSongsByGenre(genre: string) : Promise<void> {
    const url = `https://musicbrainz.org/ws/2/recording?query=tag:${genre}&fmt=json&limit=10`;

    const res = await fetch(url, {
        headers: {
            "User-Agent": "MyMusicApp/1.0 ( myemail@example.com )",
        },
    });

    if (!res.ok) {
        throw new Error(`MusicBrainz error: ${res.status}`);
    }

    const data = await res.json();
    return data.recordings as MusicBrainzRecording[];
}
