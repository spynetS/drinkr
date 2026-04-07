import { View, Text, TextInput, StyleSheet, SafeAreaView, TouchableOpacity, Modal, Animated } from 'react-native';


export default function PenaltyModal({penaltyVisible, setPenaltyVisible, playerName}) {
  return (
      <Modal visible={penaltyVisible} transparent animationType="fade" onRequestClose={() => setPenaltyVisible(false)}>
      <View style={modalStyles.modalOverlay}>
        <View style={modalStyles.modalCard}>
          <Text style={modalStyles.modalEmoji}>🍺</Text>
          <Text style={modalStyles.modalEyebrow}>PENALTY</Text>
          <Text style={modalStyles.modalTitle}>Take a Drink!</Text>
          <Text style={modalStyles.modalSubtitle}>
                                               You've been assigned a penalty,{"\n"}{playerName}.
          </Text>

          <View style={modalStyles.modalDivider} />

          <TouchableOpacity
            style={modalStyles.modalButton}
            onPress={() => setPenaltyVisible(false)}
            activeOpacity={0.8}
          >
            <Text style={modalStyles.modalButtonText}>I'll take it 🫡</Text>
          </TouchableOpacity>
        </View>
      </View>
      </Modal>

  )
}


export const modalStyles = StyleSheet.create({
  
  // Modal
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
    borderColor: 'rgba(239,68,68,0.3)',
    padding: 28,
    alignItems: 'center',
    gap: 8,
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 20,
  },
  modalEmoji: {
    fontSize: 56,
    marginBottom: 4,
  },
  modalEyebrow: {
    color: '#fca5a5',
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
    backgroundColor: 'rgba(239,68,68,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.35)',
    borderRadius: 14,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonText: {
    color: '#fca5a5',
    fontWeight: '800',
    fontSize: 15,
    letterSpacing: 0.5,
  },
})
