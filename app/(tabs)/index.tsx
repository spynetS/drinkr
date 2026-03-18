import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';
import Button from '@/components/button';


import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';

import { Avatar } from '@kolking/react-native-avatar';
import { View, Text, ImageBackground,TouchableOpacity } from "react-native";
import { useState } from "react"

import GameCard from "@/components/game-card";

const image = {uri: ''};

export default function HomeScreen() {
  const [players,setPlayers] = useState(['erik','yan', 'stefan', 'håkan']);

  return (
		<ImageBackground
      source={require('@/assets/images/background.jpg')}
      style={styles.background}
      resizeMode="center">
			
			<View style={styles.tint} />

			<View style={styles.top}>
				<Text style={{fontSize:18, color:"white", fontWeight:"800", padding:5}}  >PLAYERS PLAYING?</Text>
				<View style={{flex:1, flexDirection:"row", alignItems:"space-between", justifyContent:"center", width:"100%"}} >
					{players.map(e =>
						<View style={{flex:1, alignItems: "center", gap:3}} >
							<Avatar colorize={true} name={e} size={30} />
							<Text style={{fontSize:12, color:"white"}}>{e}</Text>
						</View>
					)}
					<Button text="+"/>
				</View>
			</View>

			<Text style={{fontSize:36, color:'white', fontWeight:'600',marginTop:10, marginBottom:10}}  >LOBBY</Text>

			<View style={styles.cardContainer} >

				<GameCard color="#4a97e3" title="The classic" description="Pellentesque tristique imperdiet tortor.  "/>
				<GameCard color="#ff43a5" title="The classic" description="Phasellus neque orci, porta a, aliquet quis, semper a, massa.  "/>
				<GameCard color="#fedd1c" title="The classic" description="Donec hendrerit tempor tellus.  "/>
				<GameCard color="#4ffc8c" title="The classic" description="Donec posuere augue in quam.  "/>
				
			</View>
			
		</ImageBackground>
  );
}

const styles = StyleSheet.create({

	cardContainer:{
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap', // allows items to wrap to next row
    justifyContent: 'center',
    alignItems: 'center',
		gap:12,
	},
	top: {
		backgroundColor:"#aaaaaa30",
		padding:10,
		margin:10,
		marginTop:40,
		flex:"col",
		borderRadius:10,
		alignItems:"center",
		width:"90%"
	},
  background: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
	tint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
});
