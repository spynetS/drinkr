import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";


const Card = ({player}) => {

  return (
    <View>
      <Text>{player}</Text>
    </View>
  )

}


export default function TabTwoScreen() {

  const [words, setWords] = useState([])
  const [players, setPlayers] = useState([])
  // number of imposters
  // category
  // hints on

  useEffect(()=>{
    axios.get()
  },[]);

  return (
    <View>
      {players.map(player => <Card player={player}/>)}
		</View>
  );
}

const styles = StyleSheet.create({
  
});
