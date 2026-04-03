import { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity, RefreshControl } from 'react-native';
import { getPlayers } from '@/components/api/utils';

type Player = {
  name: string;
  penalties: number;
};

export default function StatsScreen() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'penalties'>('penalties');

  const load = async () => {
    const data = await getPlayers();
    setPlayers(data);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  useEffect(() => { load(); }, []);

  const sorted = [...players].sort((a, b) =>
    sortBy === 'penalties' ? b.penalties - a.penalties : a.name.localeCompare(b.name)
  );

  const maxPenalties = Math.max(...players.map(p => p.penalties), 1);
  const totalPenalties = players.reduce((sum, p) => sum + p.penalties, 0);

  const getMedalColor = (index: number) => {
    if (index === 0) return '#f59e0b'; // gold
    if (index === 1) return '#94a3b8'; // silver
    if (index === 2) return '#b45309'; // bronze
    return 'rgba(255,255,255,0.2)';
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Glow blobs */}
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <View style={styles.glowTopLeft} />
        <View style={styles.glowBottomRight} />
      </View>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.eyebrow}>LEADERBOARD</Text>
        <Text style={styles.title}>Player Stats</Text>

        {/* Summary pills */}
        <View style={styles.pillRow}>
          <View style={styles.pill}>
            <Text style={styles.pillValue}>{players.length}</Text>
            <Text style={styles.pillLabel}>Players</Text>
          </View>
          <View style={styles.pillDivider} />
          <View style={styles.pill}>
            <Text style={styles.pillValue}>{totalPenalties}</Text>
            <Text style={styles.pillLabel}>Total Penalties</Text>
          </View>
          <View style={styles.pillDivider} />
          <View style={styles.pill}>
            <Text style={styles.pillValue}>
              {players.length ? (totalPenalties / players.length).toFixed(1) : 0}
            </Text>
            <Text style={styles.pillLabel}>Avg</Text>
          </View>
        </View>

        {/* Sort toggle */}
        <View style={styles.sortRow}>
          <TouchableOpacity
            style={[styles.sortButton, sortBy === 'penalties' && styles.sortButtonActive]}
            onPress={() => setSortBy('penalties')}
          >
            <Text style={[styles.sortButtonText, sortBy === 'penalties' && styles.sortButtonTextActive]}>
              By Penalties
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortButton, sortBy === 'name' && styles.sortButtonActive]}
            onPress={() => setSortBy('name')}
          >
            <Text style={[styles.sortButtonText, sortBy === 'name' && styles.sortButtonTextActive]}>
              By Name
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* List */}
      <ScrollView
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="rgba(196,181,253,0.5)" />
        }
      >
        {sorted.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🎮</Text>
            <Text style={styles.emptyText}>No players yet</Text>
            <Text style={styles.emptySubtext}>Add players to see their stats here</Text>
          </View>
        )}

        {sorted.map((player, index) => {
          const barWidth = maxPenalties > 0 ? (player.penalties / maxPenalties) * 100 : 0;
          const isWorst = sortBy === 'penalties' && index === 0 && player.penalties > 0;

          return (
            <View key={player.name} style={[styles.playerRow, isWorst && styles.playerRowHighlight]}>
              {/* Rank */}
              <View style={[styles.rank, { backgroundColor: getMedalColor(index) + '22', borderColor: getMedalColor(index) + '55' }]}>
                <Text style={[styles.rankText, { color: getMedalColor(index) }]}>
                  {sortBy === 'penalties' ? index + 1 : '—'}
                </Text>
              </View>

              {/* Info */}
              <View style={styles.playerInfo}>
                <View style={styles.playerNameRow}>
                  <Text style={styles.playerName}>{player.name}</Text>
                  {isWorst && (
                    <View style={styles.worstBadge}>
                      <Text style={styles.worstBadgeText}>Most penalties</Text>
                    </View>
                  )}
                </View>

                {/* Bar */}
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { width: `${barWidth}%` as any }]} />
                </View>

                <Text style={styles.penaltySubtext}>
                  {player.penalties} {player.penalties === 1 ? 'penalty' : 'penalties'}
                </Text>
              </View>

              {/* Count */}
              <Text style={[styles.penaltyCount, player.penalties > 0 && styles.penaltyCountActive]}>
                {player.penalties}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f18',
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
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 14,
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

  // Summary pills
  pillRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  pill: {
    alignItems: 'center',
    flex: 1,
  },
  pillValue: {
    color: '#f1f0ff',
    fontSize: 22,
    fontWeight: '800',
  },
  pillLabel: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 10,
    letterSpacing: 0.5,
    marginTop: 2,
  },
  pillDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },

  // Sort
  sortRow: {
    flexDirection: 'row',
    gap: 8,
  },
  sortButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  sortButtonActive: {
    backgroundColor: 'rgba(124,58,237,0.2)',
    borderColor: 'rgba(124,58,237,0.5)',
  },
  sortButtonText: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 12,
    fontWeight: '600',
  },
  sortButtonTextActive: {
    color: '#c4b5fd',
  },

  // List
  list: {
    padding: 20,
    gap: 10,
  },

  // Player row
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: 14,
    gap: 14,
  },
  playerRowHighlight: {
    backgroundColor: 'rgba(239,68,68,0.07)',
    borderColor: 'rgba(239,68,68,0.2)',
  },
  rank: {
    width: 34,
    height: 34,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: {
    fontSize: 13,
    fontWeight: '800',
  },
  playerInfo: {
    flex: 1,
    gap: 6,
  },
  playerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  playerName: {
    color: '#f1f0ff',
    fontSize: 15,
    fontWeight: '700',
  },
  worstBadge: {
    backgroundColor: 'rgba(239,68,68,0.15)',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)',
  },
  worstBadgeText: {
    color: '#fca5a5',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  barTrack: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#7c3aed',
    borderRadius: 2,
  },
  penaltySubtext: {
    color: 'rgba(255,255,255,0.25)',
    fontSize: 10,
    letterSpacing: 0.3,
  },
  penaltyCount: {
    color: 'rgba(255,255,255,0.2)',
    fontSize: 22,
    fontWeight: '800',
    minWidth: 32,
    textAlign: 'right',
  },
  penaltyCountActive: {
    color: '#fca5a5',
  },

  // Empty state
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: 8,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  emptyText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 16,
    fontWeight: '700',
  },
  emptySubtext: {
    color: 'rgba(255,255,255,0.2)',
    fontSize: 13,
  },
});
