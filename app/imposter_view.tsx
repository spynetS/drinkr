import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { Platform, StyleSheet, Modal } from 'react-native';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from "react-native";
import { useLocalSearchParams, router } from 'expo-router';
import FlipCard from 'react-native-flip-card';
import { playerPenalty } from "@/components/api/utils"
import { getImposterPlayers } from "@/components/api/imposter"
import { getWords } from "@/components/api/imposter"

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
      <FlipCard flip={false} clickable={true} style={styles.flipCard}>
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

const ResultModal = ({ visible, onClose, onResult }) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          {/* Header */}
          <Text style={styles.modalEyebrow}>ROUND OVER</Text>
          <Text style={styles.modalTitle}>Who won?</Text>
          <Text style={styles.modalSubtitle}>Select the winning team to record the result</Text>

          <View style={styles.modalDivider} />

          {/* Options */}
          <TouchableOpacity
            style={styles.imposterWinButton}
            onPress={() => onResult("imposters")}
            activeOpacity={0.8}
          >
            <Text style={styles.imposterWinIcon}>⚠</Text>
            <View>
              <Text style={styles.imposterWinTitle}>Imposters Won</Text>
              <Text style={styles.imposterWinSub}>The crew was fooled</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.crewmateWinButton}
            onPress={() => onResult("crewmates")}
            activeOpacity={0.8}
          >
            <Text style={styles.crewmateWinIcon}>✓</Text>
            <View>
              <Text style={styles.crewmateWinTitle}>Crewmates Won</Text>
              <Text style={styles.crewmateWinSub}>The imposter was caught</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.modalDivider} />

          {/* Cancel */}
          <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
            <Text style={styles.modalCancel}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default function ImposterView() {
  const [players, setPlayers] = useState([]);
  const [word, setWord] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const {category} = useLocalSearchParams();

  useEffect(() => {
    getImposterPlayers().then(setPlayers).catch()
    const words = getWords(category)
    console.log(words)
    setWord(words[Math.floor(Math.random() * words.length)]);
  }, []);
  
  const handleResult = async (winner) => {
    setModalVisible(false);

    for (const player of players) {
      if (
        (winner === "imposters" && player.imposter === false) ||
          (winner === "crewmates" && player.imposter === true)
      ) {
        await playerPenalty(player);
      }
    }

    router.back();
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
        <Text style={styles.title}>Find the Imposter</Text>
        <View style={styles.instructionPill}>
          <Text style={styles.instructionText}>
            🤫 Pass the phone — tap your card in secret
          </Text>
        </View>
      </View>

      {/* Cards grid */}
      <ScrollView contentContainerStyle={styles.grid}>
        {players.map((player, i) => (
          <Card key={i} player={player} word={word} />
        ))}
      </ScrollView>

      {/* Footer */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        <Text style={styles.backButtonText}>← New Game</Text>
      </TouchableOpacity>

      <ResultModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onResult={handleResult}
      />
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
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    gap: 14,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },

  // Card
  cardWrapper: {
    width: "40%",
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
