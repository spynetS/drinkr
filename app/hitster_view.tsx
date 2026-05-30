import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { Platform, StyleSheet, Modal } from 'react-native';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from "react-native";
import { useLocalSearchParams, router } from 'expo-router';
import FlipCard from 'react-native-flip-card';
import { playerPenelty, Player, getPlayers } from "@/components/api/utils"
import { getImposterPlayers } from "@/components/api/imposter"
import { getWords } from "@/components/api/imposter"
import { lobbyPublish } from "@/components/api/mqttClient"
import MusicCard from "@/components/music-card"

import { getHitsterPlayers, getSongsByGenre, HitsterPlayer, Song } from "@/components/api/hitster";



export default function ImposterView() {
  const [players, setPlayers] = useState<HitsterPlayer[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<number>(0);

  const {category} = useLocalSearchParams();

  useEffect(() => {
    getHitsterPlayers("rock").then(setPlayers).catch(console.log)
    lobbyPublish("players/hitster", {});

  }, []);


  const getSelectedPlayer = () => {return players[selectedPlayer]};

  const getNewSong = () => {
    if (selectedPlayer === null) return;

    setPlayers(prev => {
      const player = prev[selectedPlayer];
      if (!player || player.songs.length === 0) return prev;

      const randomSong =
        player.songs[Math.floor(Math.random() * player.songs.length)];

      return prev.map((p, idx) =>
        idx === selectedPlayer
          ? {
            ...p,
            timeLineSongs: [...p.timeLineSongs, randomSong],
          }
          : p
      );
    });
  };

const changeOrder = (i: number, dir: number) => {
  setPlayers(prev => {
    const next = [...prev];
    const player = next[selectedPlayer];
    if (!player) return prev;

    const songs = [...player.timeLineSongs];
    const swapIndex = i + dir;

    // Bounds check
    if (swapIndex < 0 || swapIndex >= songs.length) return prev;

    // Swap the two songs
    [songs[i], songs[swapIndex]] = [songs[swapIndex], songs[i]];

    return next.map((p, idx) =>
      idx === selectedPlayer
        ? { ...p, timeLineSongs: songs }
        : p
    );
  });
};

  return (
    <SafeAreaView style={styles.container}>
      <View pointerEvents="none">
        <View style={styles.glowTopLeft} />
        <View style={styles.glowBottomRight} />
      </View>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.eyebrow}>ROUND START</Text>
        <Text style={styles.title}>HITSTER</Text>
        <View style={styles.instructionPill}>
          <Text style={styles.instructionText}>
                                                 Organize the songs based by year
          </Text>
        </View>
        <View style={{flexDirection:"row", gap:"10px"}} >
          {players.map((player, index) => {
            const isSelected = index === selectedPlayer;

            return (
              <TouchableOpacity
                key={player.player.name}
                style={isSelected ? styles.backButtonSelected : styles.backButton}
                onPress={() => setSelectedPlayer(index)}
                activeOpacity={0.8}
              >
                <Text style={styles.backButtonText}>
                  {player.player.name}
                </Text>
              </TouchableOpacity>
            );
          })}

        </View>
      </View>

      {/* Cards grid */}
      <ScrollView contentContainerStyle={styles.grid}>
        {players[selectedPlayer]?.timeLineSongs.map((song, i) => (
          <MusicCard
            key={i}
            onUp={()=> changeOrder(i,-1)}
            onDown={()=> changeOrder(i,1)}
            title={song.title}
            artist={song.artist}
            year={song.releaseDate} /> 
        ))}
      </ScrollView>

      {/* Footer */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => getNewSong()}
        activeOpacity={0.8}
      >
        <Text style={styles.backButtonText}>← New Game</Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f18",
    alignItems: "center",
    justifyContent: "space-between",
  },

  // Glow blobs
  glowTopLeft: {
    position: "absolute",
    top: -60,
    left: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(124,58,237,0.15)",
  },
  glowBottomRight: {
    position: "absolute",
    bottom: -60,
    right: -60,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(239,68,68,0.1)",
  },

  // Header
  header: {
    alignItems: "center",
    gap: 10,
    paddingTop: 12,
    paddingHorizontal: 20,
  },
  eyebrow: {
    color: "rgba(196,181,253,0.7)",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 3,
  },
  title: {
    color: "#f1f0ff",
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.5,
    textAlign: "center",
  },
  instructionPill: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 4,
  },
  instructionText: {
    color: "rgba(255,255,255,0.45)",
    fontSize: 12,
    letterSpacing: 0.3,
    textAlign: "center",
  },

  // Cards grid
  grid: {
    flexDirection: "column",
    height:"100%",
    //    flexWrap: "wrap",
    // justifyContent: "center",    
    alignItems: "center",
    gap: 14,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },

  // Card
  cardWrapper: {
    // width: "10%",
    // aspectRatio: 0.75,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: "rgba(124, 58, 237, 0.25)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  playerName: {
    fontWeight: "700",
    color: "#f1f0ff",
    fontSize: 15,
    letterSpacing: 0.5,
    textAlign: "center",
  },
  tapHint: {
    color: "rgba(196,181,253,0.6)",
    fontSize: 10,
    letterSpacing: 1.5,
    marginTop: 4,
    textTransform: "uppercase",
  },

  // Imposter back
  imposterBack: {
    backgroundColor: "rgba(127, 29, 29, 0.6)",
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.35)",
  },
  imposterBadge: {
    backgroundColor: "rgba(239,68,68,0.2)",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 10,
  },
  imposterBadgeText: {
    color: "#fca5a5",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  imposterTitle: {
    fontWeight: "800",
    color: "#fff",
    fontSize: 15,
    textAlign: "center",
    marginBottom: 10,
    lineHeight: 22,
  },
  hintPill: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  hintText: {
    color: "#fca5a5",
    fontSize: 11,
    textAlign: "center",
    fontStyle: "italic",
  },

  // Crewmate back
  crewmateBack: {
    backgroundColor: "rgba(17, 57, 39, 0.6)",
    borderWidth: 1,
    borderColor: "rgba(52,211,153,0.3)",
  },
  crewmateBadge: {
    backgroundColor: "rgba(52,211,153,0.15)",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 10,
  },
  crewmateBadgeText: {
    color: "#6ee7b7",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  wordLabel: {
    color: "rgba(110,231,183,0.7)",
    fontSize: 11,
    letterSpacing: 1,
    marginBottom: 6,
    textTransform: "uppercase",
  },
  wordText: {
    fontWeight: "800",
    color: "#ecfdf5",
    fontSize: 18,
    textAlign: "center",
    letterSpacing: 0.5,
  },

  // Footer
  backButton: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 14,
    paddingHorizontal: 28,
    paddingVertical: 14,
    marginBottom: 12,
  },
  backButtonSelected: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 14,
    paddingHorizontal: 28,
    paddingVertical: 14,
    marginBottom: 12,
  },
  backButtonText: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.5,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalCard: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "#16162a",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.5,
    shadowRadius: 40,
    elevation: 20,
  },
  modalEyebrow: {
    color: "rgba(196,181,253,0.7)",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 3,
    textAlign: "center",
    marginBottom: 6,
  },
  modalTitle: {
    color: "#f1f0ff",
    fontSize: 26,
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  modalSubtitle: {
    color: "rgba(255,255,255,0.3)",
    fontSize: 12,
    textAlign: "center",
    letterSpacing: 0.2,
  },
  modalDivider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
    marginVertical: 20,
  },

  // Imposter win button
  imposterWinButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    backgroundColor: "rgba(239,68,68,0.12)",
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.3)",
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
  },
  imposterWinIcon: {
    fontSize: 28,
  },
  imposterWinTitle: {
    color: "#fca5a5",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  imposterWinSub: {
    color: "rgba(252,165,165,0.5)",
    fontSize: 12,
    marginTop: 2,
  },

  // Crewmate win button
  crewmateWinButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    backgroundColor: "rgba(52,211,153,0.1)",
    borderWidth: 1,
    borderColor: "rgba(52,211,153,0.25)",
    borderRadius: 16,
    padding: 18,
  },
  crewmateWinIcon: {
    fontSize: 28,
    color: "#6ee7b7",
  },
  crewmateWinTitle: {
    color: "#6ee7b7",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  crewmateWinSub: {
    color: "rgba(110,231,183,0.5)",
    fontSize: 12,
    marginTop: 2,
  },

  // Cancel
  modalCancel: {
    color: "rgba(255,255,255,0.25)",
    fontSize: 13,
    textAlign: "center",
    letterSpacing: 0.3,
  },
});
