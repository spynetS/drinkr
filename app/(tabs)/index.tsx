import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';
import Button from '@/components/button';

import { router } from 'expo-router'
import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';

import { Avatar } from '@kolking/react-native-avatar';
import { TextInput, View, Text, ImageBackground,TouchableOpacity, Modal } from "react-native";
import { useState, useEffect } from "react"

import axios from "axios"

import GameCard from "@/components/game-card";

const image = {uri: ''};

axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.headers.post['Content-Type'] = 'application/json';


export default function HomeScreen() {
  const [players,setPlayers] = useState([]);
	const [isVisible, setVisible] = useState(false)

	const [playerName, setPlayerName] = useState("")

	useEffect(()=>{
		axios.get('/events')
			.then(response => console.log(response))
			.catch(error => console.error('Error fetching users:', error));

		axios.get('/users')
			.then(response => setPlayers(response.data))
			.catch(error => console.error('Error fetching users:', error));
	
	},[])

	const addUser = () => {

		if (playerName === "") return;

		axios.post('/user/', { name: playerName })
			.then(response => {
				setPlayers(prev => [...prev, response.data]);
				setPlayerName("");
			})
			.catch(error => console.error(error));

	};

	const removePlayer = (rmPlayer) => {

		axios.delete(`/user/${rmPlayer.pk}`)
			.then(response => console.log(response.data));

		const filtered = players.filter(player => player.pk !== rmPlayer.pk);
		setPlayers(filtered)
	}

  return (
		<ImageBackground
      source={require('@/assets/images/background.jpg')}
      style={styles.background}
      resizeMode="cover">
			
			<View style={styles.tint} />

			<Modal transparent visible={isVisible} animationType="fade">
				<View style={styles.overlay}>
					<View style={styles.popup}>
						<Text>Player name</Text>
						<TextInput value={playerName} style={styles.input} onChangeText={setPlayerName} />
						<View style={{flexDirection:"row", justifyContent:"space-around",width:"100%"}}>
							<Button onPress={addUser} text="ADD" color="#4a97e3"/>
							<Button onPress={()=>setVisible(false)} text="CLOSE" color="#4a97e3"/>
						</View>

					</View>
				</View>
			</Modal>

			<View style={styles.top}>
				<Text style={{fontSize:18, color:"white", fontWeight:"800", padding:5}}  >PLAYERS PLAYING?</Text>
				<View style={{flexDirection:"row", justifyContent:"flex-start", alignItems:"flex-start", width:"100%",}} >
					{players.map((e,index) =>
						<View key={index} style={{alignItems: "center", gap:3, marginLeft: 5, marginRight:5}} >
							<TouchableOpacity onPress={()=>removePlayer(e)} >
								<Avatar colorize={true} name={e.name} size={30} />
							</TouchableOpacity>								
							<Text style={{fontSize:12, color:"white"}}>{e.name}</Text>
						</View>
					)}
					<Button onPress={()=>setVisible(true)} text="+" color="#4a97e3" />
				</View>
			</View>

			<Text style={{fontSize:36, color:'white', fontWeight:'600',marginTop:10, marginBottom:10}}  >LOBBY</Text>

			<View style={styles.cardContainer} >
				<GameCard color="#4a97e3" title="The classic" description="Pellentesque tristique imperdiet tortor.  "/>
				<GameCard onPlay={()=>router.replace("imposter")} color="#ff43a5" title="Imposter" description="Everyone gets a word and are say another word associated with it. But one imposter doesnt know the word and are trying to fit in."/>
				<GameCard color="#fedd1c" title="The classic" description="Donec hendrerit tempor tellus.  "/>
				<GameCard color="#4ffc8c" title="The classic" description="Donec posuere augue in quam.  "/>
			</View>
			
		</ImageBackground>
  );
}

const styles = StyleSheet.create({
	overlay: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		justifyContent: "center",
		alignItems: "center",
		zIndex: 999,
	},

	// Popup box
	popup: {
		backgroundColor: "#ffffff",
		padding: 20,
		borderRadius: 12,
		width: "80%",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.2,
		shadowRadius: 8,
		elevation: 8, // Android shadow
		zIndex: 1000,
	},

	// Add this keyframe in your CSS file
	"@keyframes fadeIn": {
		from: { opacity: 0, transform: "translateY(-6px)" },
		to:   { opacity: 1, transform: "translateY(0)" },
	},
	input:{
		backgroundColor:"lightgray",
		margin:5,
		borderRadius:10,
		padding:10,
		color:"black"
	},
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
