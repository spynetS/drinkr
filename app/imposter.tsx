import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import axios from "axios"
import Button from "@/components/button"
import { Dropdown } from 'react-native-element-dropdown';
import { useLocalSearchParams, router } from 'expo-router';
import { Checkbox } from 'expo-checkbox';
import { getPlayers } from "@/components/api/utils"
import { getCategories, getWords, getImposterPlayers, saveNumImposters2 } from "@/components/api/imposter"



export default function TabTwoScreen() {
  const [words, setWords] = useState([]);
  const [players, setPlayers] = useState([]);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [numImposters, setNumImposters] = useState(1);
  const [categoryFocus, setCategoryFocus] = useState(false);
  const [imposterFocus, setImposterFocus] = useState(false);
  const [randomNumImposters, setRandomNumImposters] = useState(true);

  const { _players, _offline } = useLocalSearchParams();

  useEffect(() => {
    getPlayers().then(setPlayers).catch()

    // get the categories and set it in the state formatted
    setCategories(getCategories().map(cat=>{
      const key_formatted = cat.replaceAll("_", " ");
      return { label: key_formatted, value: cat };
    }))

  
  }, []);

  const getImposterData = () => {
    return players.map((player, index) => ({
      label: `${index + 1} Imposter${index > 0 ? "s" : ""}`,
      value: index + 1,
    }));
  };

  return (
    <View style={styles.container}>
      {/* Background glow blobs */}
      <View>
        <View style={styles.glowTopLeft} />
        <View style={styles.glowBottomRight} />
      </View>
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.eyebrow}>GAME SETUP</Text>
          <Text style={styles.title}>Find the{"\n"}Imposter</Text>
          <Text style={styles.subtitle}>Configure your round before starting</Text>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Category Dropdown */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>CATEGORY</Text>
          <Dropdown
            style={[styles.dropdown, categoryFocus && styles.dropdownFocused]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            iconStyle={styles.iconStyle}
            containerStyle={styles.dropdownContainer}
            itemTextStyle={styles.itemTextStyle}
            activeColor="rgba(124,58,237,0.2)"
            data={categories}
            maxHeight={220}
            labelField="label"
            valueField="value"
            placeholder="Select a category"
            value={category}
            onFocus={() => setCategoryFocus(true)}
            onBlur={() => setCategoryFocus(false)}
            onChange={item => {
              setCategory(item.value);
              setCategoryFocus(false);
            }}
          />
        </View>

        {/* Imposters Dropdown */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>IMPOSTERS</Text>
          <Dropdown
            style={[styles.dropdown, imposterFocus && styles.dropdownFocused]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            iconStyle={styles.iconStyle}
            containerStyle={styles.dropdownContainer}
            itemTextStyle={styles.itemTextStyle}
            activeColor="rgba(124,58,237,0.2)"
            data={getImposterData()}
            maxHeight={220}
            labelField="label"
            valueField="value"
            placeholder="Number of imposters"
            value={numImposters}
            onFocus={() => setImposterFocus(true)}
            onBlur={() => setImposterFocus(false)}
            onChange={item => {
              setNumImposters(item.value);
              saveNumImposters(item.value);
              setImposterFocus(false);
            }}
          />
          <View style={{flex:1, flexDirection:"row", alignItems:"center", marginTop:"12px"}}>
            <Checkbox value={randomNumImposters} onValueChange={setRandomNumImposters} />
            <Text style={styles.pipLabel}>Randomize number of imposter</Text>
          </View>
        </View>

        {/* Imposter pip indicators */}
        <View style={styles.pipRow}>
          {[1, 2, 3, 4].map(n => (
            <View
              key={n}
              style={[styles.pip, n <= numImposters && styles.pipActive]}
            />
          ))}
          <Text style={styles.pipLabel}>
            {numImposters} imposter{numImposters > 1 ? "s" : ""} in the game
          </Text>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Start Button */}
        <TouchableOpacity
          style={[styles.startButton, (!category) && styles.startButtonDisabled]}
          onPress={() => {
            if (!category) return;
            getImposterPlayers().then(players => {
              router.push({
                pathname: "/imposter_view",
                params: {
                  category:category
                },
              });
            })
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.startButtonText}>START GAME</Text>
          <Text style={styles.startButtonArrow}>→</Text>
        </TouchableOpacity>

        {!category && (
          <Text style={styles.warningText}>Select a category to continue</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f18",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },

  // Background glows
  glowTopLeft: {
    position: "absolute",
    top: -80,
    left: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(124,58,237,0.18)",
  },
  glowBottomRight: {
    position: "absolute",
    bottom: -80,
    right: -80,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(239,68,68,0.12)",
  },

  // Main card
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    padding: 28,
    shadowColor: "#7c3aed",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 16,
  },

  // Header
  header: {
    marginBottom: 20,
  },
  eyebrow: {
    color: "rgba(196,181,253,0.7)",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 3,
    marginBottom: 8,
  },
  title: {
    color: "#f1f0ff",
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: -0.5,
    lineHeight: 38,
    marginBottom: 8,
  },
  subtitle: {
    color: "rgba(255,255,255,0.35)",
    fontSize: 13,
    letterSpacing: 0.2,
  },

  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
    marginVertical: 20,
  },

  // Field groups
  fieldGroup: {
    marginBottom: 16,
  },
  fieldLabel: {
    color: "rgba(196,181,253,0.7)",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 2,
    marginBottom: 8,
  },

  // Dropdowns
  dropdown: {
    height: 52,
    backgroundColor: "rgba(255,255,255,0.07)",
    borderColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
  },
  dropdownFocused: {
    borderColor: "rgba(124,58,237,0.7)",
    backgroundColor: "rgba(124,58,237,0.08)",
  },
  dropdownContainer: {
    backgroundColor: "#1a1a2e",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    overflow: "hidden",
  },
  placeholderStyle: {
    fontSize: 15,
    color: "rgba(255,255,255,0.3)",
  },
  selectedTextStyle: {
    fontSize: 15,
    color: "#f1f0ff",
    fontWeight: "600",
  },
  iconStyle: {
    width: 20,
    height: 20,
    tintColor: "rgba(196,181,253,0.6)",
  },
  itemTextStyle: {
    color: "#d1d5db",
    fontSize: 14,
    textTransform: "capitalize",
  },

  // Pip indicators
  pipRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
    marginBottom: 4,
  },
  pip: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  pipActive: {
    backgroundColor: "#7c3aed",
    borderColor: "#a78bfa",
    shadowColor: "#7c3aed",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  pipLabel: {
    color: "rgba(255,255,255,0.35)",
    fontSize: 11,
    marginLeft: 4,
    letterSpacing: 0.3,
  },

  // Start button
  startButton: {
    backgroundColor: "#7c3aed",
    borderRadius: 14,
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    shadowColor: "#7c3aed",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 10,
  },
  startButtonDisabled: {
    backgroundColor: "rgba(124,58,237,0.3)",
    shadowOpacity: 0,
  },
  startButtonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 15,
    letterSpacing: 2,
  },
  startButtonArrow: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 18,
  },
  warningText: {
    color: "rgba(255,255,255,0.25)",
    fontSize: 11,
    textAlign: "center",
    marginTop: 12,
    letterSpacing: 0.3,
  },
});
