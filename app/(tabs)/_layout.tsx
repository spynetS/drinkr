import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View } from 'react-native';
import { HapticTab } from '@/components/haptic-tab';
import { useColorScheme } from '@/hooks/use-color-scheme';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

const TAB_BAR_HEIGHT = 64;

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#a78bfa',
        tabBarInactiveTintColor: 'rgba(255,255,255,0.25)',
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: TAB_BAR_HEIGHT,
          paddingBottom: 0,
          paddingTop: 0,
          backgroundColor: 'rgba(15, 15, 24, 0.92)',
          borderTopWidth: 1,
          borderTopColor: 'rgba(255,255,255,0.07)',
          ...Platform.select({
            android: { elevation: 20 },
            ios: {
              shadowColor: '#7c3aed',
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.2,
              shadowRadius: 20,
            },
          }),
        },
        tabBarItemStyle: {
          paddingVertical: 8,
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          letterSpacing: 0.8,
          textTransform: 'uppercase',
          marginTop: 3,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Games',
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 28,
              borderRadius: 10,
              backgroundColor: focused ? 'rgba(124,58,237,0.2)' : 'transparent',
            }}>
              <Entypo name="game-controller" size={20} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: 'Stats',
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 28,
              borderRadius: 10,
              backgroundColor: focused ? 'rgba(124,58,237,0.2)' : 'transparent',
            }}>
              <MaterialCommunityIcons name="chart-bar" size={20} color={color} />
            </View>
          ),
        }}
      />
      />
    </Tabs>
  );
}
