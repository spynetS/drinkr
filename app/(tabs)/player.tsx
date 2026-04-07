import { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView, TouchableOpacity, Modal, Animated } from 'react-native';
import { subscribe, publish } from '@/components/api/mqttClient';
import Button from '@/components/button';
import PenaltyModal from '@/components/penalty-modal'
import RoleModal from '@/components/role-modal'

type Player = {
  name: string;
  penalties: number;
};

export default function LobbyScreen() {
  const [lobby, setLobby] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [events, setEvents] = useState<any[]>([]);
  const [connected, setConnected] = useState(false);
  const [penaltyVisible, setPenaltyVisible] = useState(false);
  const [lobbyFocus, setLobbyFocus] = useState(false);
  const [nameFocus, setNameFocus] = useState(false);

  const [isImposter, setIsImposter] = useState(false);
  const [showRole, setShowRole] = useState(false);

  const [subs, setSubs] = useState([])

  const disconnect = () => {
    subs.forEach(sub=>{sub()});
    setConnected(false);
  }

  const connect = () => {
    publish(lobby+"/players/add", {name:playerName})

    let _subs = subs;
    _subs.push(subscribe(lobby + "/players/penalty", (payload) => {
      if (playerName === payload.name) {
        setPenaltyVisible(true);
      }
    }));
    _subs.push(subscribe(lobby + "/players/imposter", (payload) => {
      console.log(payload)
      if (playerName === payload.name) {
        setIsImposter(payload.imposter)
        setShowRole(true)
      }
    }));
    _subs.push(subscribe(lobby + "/startGame", (payload) => {
      setEvents(prev => [...prev, payload]);
    }));
    setSubs(_subs)
    setConnected(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Glow blobs */}
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <View style={styles.glowTopLeft} />
        <View style={styles.glowBottomRight} />
      </View>

      <View style={styles.inner}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.eyebrow}>MULTIPLAYER</Text>
          <Text style={styles.title}>Join Lobby</Text>
          <Text style={styles.subtitle}>Enter a code to connect with other players</Text>
        </View>

        {/* Card */}
        {!connected ? (
        <View style={styles.card}>
          {/* Lobby code */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>LOBBY CODE</Text>
              <TextInput
                placeholder="e.g. XKCD42"
                placeholderTextColor="rgba(255,255,255,0.25)"
                value={lobby}
                style={[styles.input, lobbyFocus && styles.inputFocused]}
                onChangeText={setLobby}
                onFocus={() => setLobbyFocus(true)}
                onBlur={() => setLobbyFocus(false)}
                autoCapitalize="characters"
              />
            </View>

          {/* Player name */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>YOUR NAME</Text>
            <TextInput
              placeholder="Enter your name"
              placeholderTextColor="rgba(255,255,255,0.25)"
              value={playerName}
              style={[styles.input, nameFocus && styles.inputFocused]}
              onChangeText={setPlayerName}
              onFocus={() => setNameFocus(true)}
              onBlur={() => setNameFocus(false)}
            />
          </View>

          <View style={styles.divider} />

          {/* Connect button */}
          <TouchableOpacity
            style={[styles.connectButton, (!lobby || !playerName) && styles.connectButtonDisabled]}
            onPress={connect}
            activeOpacity={0.8}
            disabled={!lobby || !playerName}
          >
            <Text style={styles.connectButtonText}>
              {connected ? "✓  Connected" : "Connect to Lobby"}
            </Text>
          </TouchableOpacity>
        </View>) : (     <TouchableOpacity
                           style={[styles.connectButton, (!lobby || !playerName) && styles.connectButtonDisabled]}
                           onPress={disconnect}
                           activeOpacity={0.8}
                           disabled={!lobby || !playerName}>
                           <Text style={styles.connectButtonText}>
                             Disconnect
                           </Text>
                         </TouchableOpacity>)}

        {/* Status / events */}
        {connected && (
          <View style={styles.statusCard}>
            <View style={styles.statusHeader}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Live — {lobby}</Text>
              <Text style={styles.statusName}>{playerName}</Text>
            </View>

            {events.length === 0 ? (
              <Text style={styles.waitingText}>⏳ Waiting for the host to start...</Text>
            ) : (
              events.map((event, i) => (
                <View key={i} style={styles.eventRow}>
                  <Text style={styles.eventText}>{JSON.stringify(event)}</Text>
                </View>
              ))
            )}
          </View>
        )}
      </View>
      
      <PenaltyModal
        playerName={playerName}
        penaltyVisible={penaltyVisible}
        setPenaltyVisible={setPenaltyVisible} />
      
      <RoleModal
        isImposter={isImposter}
        visible={showRole}
        onClose={()=>setShowRole(false)} />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f18',
  },
  inner: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 16,
  },

  // Glows
  glowTopLeft: {
    position: 'absolute',
    top: -60,
    left: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(124,58,237,0.15)',
  },
  glowBottomRight: {
    position: 'absolute',
    bottom: -60,
    right: -60,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(239,68,68,0.1)',
  },

  // Header
  header: {
    gap: 6,
    paddingTop: 8,
  },
  eyebrow: {
    color: 'rgba(196,181,253,0.7)',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 3,
  },
  title: {
    color: '#f1f0ff',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 13,
    letterSpacing: 0.2,
  },

  // Card
  card: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 24,
    padding: 20,
    gap: 14,
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },

  // Fields
  fieldGroup: {
    gap: 8,
  },
  fieldLabel: {
    color: 'rgba(196,181,253,0.7)',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
  },
  input: {
    height: 52,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 12,
    paddingHorizontal: 14,
    color: '#f1f0ff',
    fontSize: 15,
  },
  inputFocused: {
    borderColor: 'rgba(124,58,237,0.7)',
    backgroundColor: 'rgba(124,58,237,0.08)',
  },

  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },

  // Connect button
  connectButton: {
    backgroundColor: '#7c3aed',
    borderRadius: 14,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 10,
  },
  connectButtonDisabled: {
    backgroundColor: 'rgba(124,58,237,0.3)',
    shadowOpacity: 0,
  },
  connectButtonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 15,
    letterSpacing: 1,
  },

  // Status card
  statusCard: {
    backgroundColor: 'rgba(52,211,153,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(52,211,153,0.2)',
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#34d399',
    shadowColor: '#34d399',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
  },
  statusText: {
    color: '#6ee7b7',
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
  },
  statusName: {
    color: 'rgba(110,231,183,0.5)',
    fontSize: 12,
  },
  waitingText: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 13,
    textAlign: 'center',
    paddingVertical: 8,
  },
  eventRow: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  eventText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    fontFamily: 'monospace',
  },

});
