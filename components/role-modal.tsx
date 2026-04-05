import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Modal } from 'react-native';
import { useState, useEffect } from "react"

type Props = {
  visible: boolean;
  onClose: () => void;
  playerName: string;
  isImposter: boolean;
};

export default function RoleModal({ visible, onClose, playerName, isImposter }: Props) {
  const [revealed, setRevealed] = useState(false);
  const theme = isImposter ? imposterTheme : crewmateTheme;

  // Reset when modal opens
  useEffect(() => {
    if (visible) setRevealed(false);
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={modalStyles.modalOverlay}>
        <View style={[modalStyles.modalCard, { borderColor: theme.borderColor, shadowColor: theme.shadowColor }]}>

          {!revealed ? (
            // Hidden state
            <>
              <Text style={modalStyles.modalEmoji}>🎴</Text>
              <View style={[modalStyles.eyebrowPill, { backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }]}>
                <Text style={[modalStyles.modalEyebrow, { color: 'rgba(196,181,253,0.7)' }]}>YOUR ROLE</Text>
              </View>
              <Text style={modalStyles.modalTitle}>Ready?</Text>
              <Text style={modalStyles.modalSubtitle}>
                Make sure nobody else{"\n"}is looking, {playerName}.
              </Text>
              <View style={modalStyles.modalDivider} />
              <TouchableOpacity
                style={[modalStyles.modalButton, {
                  backgroundColor: 'rgba(124,58,237,0.2)',
                  borderColor: 'rgba(124,58,237,0.5)',
                }]}
                onPress={() => setRevealed(true)}
                activeOpacity={0.8}
              >
                <Text style={[modalStyles.modalButtonText, { color: '#c4b5fd' }]}>
                  Reveal my role 👁
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            // Revealed state
            <>
              <Text style={modalStyles.modalEmoji}>{theme.emoji}</Text>
              <View style={[modalStyles.eyebrowPill, { backgroundColor: theme.pillBg, borderColor: theme.borderColor }]}>
                <Text style={[modalStyles.modalEyebrow, { color: theme.accent }]}>{theme.eyebrow}</Text>
              </View>
              <Text style={modalStyles.modalTitle}>{theme.title}</Text>
              <Text style={modalStyles.modalSubtitle}>{theme.subtitle}{"\n"}{playerName}</Text>
              <View style={modalStyles.modalDivider} />
              <TouchableOpacity
                style={[modalStyles.modalButton, { backgroundColor: theme.buttonBg, borderColor: theme.borderColor }]}
                onPress={onClose}
                activeOpacity={0.8}
              >
                <Text style={[modalStyles.modalButtonText, { color: theme.accent }]}>{theme.buttonText}</Text>
              </TouchableOpacity>
            </>
          )}

        </View>
      </View>
    </Modal>
  );
}

const imposterTheme = {
  emoji: '🕵️',
  eyebrow: '⚠ IMPOSTER',
  title: 'You are the\nImposter',
  subtitle: 'Blend in and deceive,',
  buttonText: "Got it, I won't tell 🤫",
  accent: '#fca5a5',
  borderColor: 'rgba(239,68,68,0.35)',
  shadowColor: '#ef4444',
  pillBg: 'rgba(239,68,68,0.1)',
  buttonBg: 'rgba(239,68,68,0.15)',
};

const crewmateTheme = {
  emoji: '👥',
  eyebrow: '✓ CREWMATE',
  title: 'You are a\nCrewmate',
  subtitle: 'Find the imposter,',
  buttonText: "Let's go! 🫡",
  accent: '#6ee7b7',
  borderColor: 'rgba(52,211,153,0.3)',
  shadowColor: '#34d399',
  pillBg: 'rgba(52,211,153,0.1)',
  buttonBg: 'rgba(52,211,153,0.1)',
};

export const modalStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#16162a',
    borderRadius: 28,
    borderWidth: 1,
    padding: 28,
    alignItems: 'center',
    gap: 8,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 20,
  },
  modalEmoji: {
    fontSize: 56,
    marginBottom: 4,
  },
  eyebrowPill: {
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  modalEyebrow: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 3,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    textAlign: 'center',
    lineHeight: 36,
  },
  modalSubtitle: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },
  modalDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    width: '100%',
    marginVertical: 8,
  },
  modalButton: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 14,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonText: {
    fontWeight: '800',
    fontSize: 15,
    letterSpacing: 0.5,
  },
});
