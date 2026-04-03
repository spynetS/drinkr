import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 58,
          paddingBottom: 0,
          paddingTop: 0,
          backgroundColor: isDark ? '#1c242ede' : '#FFFFFF',
          borderTopWidth: 0,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: isDark ? 0.3 : 0.08,
          shadowRadius: 16,
          ...Platform.select({
            android: { elevation: 10 },
          }),
        },
        tabBarItemStyle: {
          paddingVertical: 0,
          paddingHorizontal: 0,
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          letterSpacing: 0.2,
          marginTop: 2,
        },
        tabBarInactiveTintColor: isDark ? '#636366' : '#AEAEB2',
        tabBarShowLabel: true,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Game',
          tabBarIcon: ({ color }) => (
						<Entypo name="game-controller" size={24} color="#fbfcfe" />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={22} name="paperplane.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="imposter"
        options={{
          title: 'Imposter',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={22} name="paperplane.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
