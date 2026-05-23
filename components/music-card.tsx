import React from "react";
import { View, Text, Image, Pressable, TouchableOpacity } from "react-native";

export default function MusicCard({
  title,
  artist,
  year,
  image,
  onPress,
  onUp,
  onDown,
  revealed = false,
}) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      {/* Glow background blob effect */}
      <View style={styles.glow} />

      {/* Album art */}
      <View style={styles.imageWrap}>
        <Image source={{ uri: image }} style={styles.image} />
      </View>

      {/* Text */}
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>

      <Text style={styles.artist} numberOfLines={1}>
        {artist}
      </Text>

      {/* Year reveal */}
      <View style={{flex:1, flexDirection:"row", alignItems:"center"}}>
        <TouchableOpacity
          style={[
            styles.yearPill,
            revealed ? styles.yearRevealed : styles.yearHidden,
          ]}
          onPress={onUp}
        >
          <Text style={{color:"white"}}>Upp</Text>
        </TouchableOpacity>

        <View
          style={[
            styles.yearPill,
            revealed ? styles.yearRevealed : styles.yearHidden,
          ]}
        >
          <Text style={styles.yearText}>
            {revealed ? year : "????"}
          </Text>
        </View>
        <TouchableOpacity
          onPress={onDown}
          style={[
            styles.yearPill,
            revealed ? styles.yearRevealed : styles.yearHidden,
          ]}>
          <Text style={{color:"white"}}>Ner</Text>
        </TouchableOpacity>
      </View>

    </Pressable>
  );
}

const styles = {
  card: {
    width: 160,
    borderRadius: 20,
    padding: 14,

    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",

    alignItems: "center",
    justifyContent: "center",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 12,

    position: "relative",
  },

  glow: {
    position: "absolute",
    top: -40,
    left: -40,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(124,58,237,0.18)",
  },

  imageWrap: {
    width: 110,
    height: 110,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 12,

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  title: {
    color: "#f1f0ff",
    fontSize: 14,
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: 0.3,
  },

  artist: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 12,
    marginTop: 4,
    textAlign: "center",
  },

  yearPill: {
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },

  yearHidden: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderColor: "rgba(255,255,255,0.08)",
  },

  yearRevealed: {
    backgroundColor: "rgba(124,58,237,0.15)",
    borderColor: "rgba(124,58,237,0.3)",
  },

  yearText: {
    color: "#f1f0ff",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
  },
};
