import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useLocalSearchParams, router } from 'expo-router';
import FlipCard from 'react-native-flip-card';

const Card = ({ player, word }) => {
  const cardBase = {
    width: "100%",
    height: "100%",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backfaceVisibility: "hidden",
  };

  const glassStyle = {
    backgroundColor: "rgba(255,255,255,0.07)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  };

  return (
    <View style={styles.cardWrapper}>
      <FlipCard
        flip={false}
        clickable={true}
        style={styles.flipCard}
      >
        {/* Front */}
        <View style={[cardBase, glassStyle]}>
          <View style={styles.iconContainer}>
            <Image
              source={require("@/assets/images/dice.png")}
              style={{ width: 36, height: 36, tintColor: "#c4b5fd" }}
            />
          </View>
          <Text style={styles.playerName}>{player.name}</Text>
          <Text style={styles.tapHint}>Tap to reveal</Text>
        </View>

        {/* Back */}
        {player.imposter ? (
          <View style={[cardBase, styles.imposterBack]}>
            <View style={styles.imposterBadge}>
              <Text style={styles.imposterBadgeText}>⚠ Imposter</Text>
            </View>
            <Text style={styles.imposterTitle}>You are the{"\n"}Imposter</Text>
            <View style={styles.hintPill}>
              <Text style={styles.hintText}>Hint: {word.hint}</Text>
            </View>
          </View>
        ) : (
          <View style={[cardBase, styles.crewmateBack]}>
            <View style={styles.crewmateBadge}>
              <Text style={styles.crewmateBadgeText}>✓ Crewmate</Text>
            </View>
            <Text style={styles.wordLabel}>Your word</Text>
            <Text style={styles.wordText}>{word.word}</Text>
          </View>
        )}
      </FlipCard>
    </View>
  );
};

export default function ImposterView() {
  const { players, words } = useLocalSearchParams();

  const [_players, _setPlayers] = useState([]);
  const [_words, _setWords] = useState([]);

  useEffect(() => {
    _setPlayers(JSON.parse(players));
    _setWords(JSON.parse(words));
  }, []);

  return (
    <View style={styles.container}>
      {/* Background glow blobs */}
      <View style={styles.glowTopLeft} />
      <View style={styles.glowBottomRight} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.eyebrow}>ROUND START</Text>
        <Text style={styles.title}>Find the Imposter</Text>
        <View style={styles.instructionPill}>
          <Text style={styles.instructionText}>
            🤫 Pass the phone — tap your card in secret
          </Text>
        </View>
      </View>

      {/* Cards grid */}
      <View style={styles.grid}>
        {_players.map((player, i) => (
          <Card key={i} player={player} word={_words[0]} />
        ))}
      </View>

      {/* Footer */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.8}>
        <Text style={styles.backButtonText}>← New Game</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f18",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 48,
    paddingHorizontal: 20,
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
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    gap: 14,
    paddingVertical: 20,
  },

  // Card
  cardWrapper: {
    width: "42%",
    aspectRatio: 0.75,
  },
  flipCard: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    backgroundColor: "rgba(20, 20, 30, 0.85)",
    shadowColor: "#7c3aed",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 20,
    elevation: 14,
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
  },
  backButtonText: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});
