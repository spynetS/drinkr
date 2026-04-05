import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';
import Button from '@/components/button';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link, router } from 'expo-router';

import { Avatar } from '@kolking/react-native-avatar';
import { TextInput, View, Text, ImageBackground,TouchableOpacity, Modal } from "react-native";
import { useState, useEffect } from "react"
import { setLobbyCode, getPlayers, addPlayer, removePlayer } from "@/components/api/utils"
import {subscribe} from "@/components/api/mqttClient"
import axios from "axios"

import GameCard from "@/components/game-card";

const image = {uri: ''};

axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.headers.post['Content-Type'] = 'application/json';


export default function HomeScreen() {
  const [offline, setOffline] = useState(true);
  const [players,setPlayers] = useState([]);
	const [isVisible, setVisible] = useState(false)
	const [playerName, setPlayerName] = useState("")
  const [lobby, setLobby] = useState("");

	useEffect(()=>{
    getPlayers().then(setPlayers).catch()

    function makeid(length) {
      var result           = '';
      var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      var charactersLength = characters.length;
      for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
    }
  
    setLobbyCode(makeid(6)).then(lobby=>{
      setLobby(lobby);
      // if we get a new player from mqtt we should add it the ui
      console.log("sub:",lobby+"/players/add")
      subscribe(lobby+"/players/add", player=>{
        addPlayer(player,false).then(player=>{
          setPlayers(prev=>[...prev,player])
        })
      })
    })
  
	},[])

	const addUser = () => {
		if (playerName === "") return;

    addPlayer({name:playerName}).then(player=>{
      setPlayerName("")
      setPlayers(prev=>[...prev,player])
    }).catch()
	};

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
				<Text style={{fontSize:18, color:"white", fontWeight:"800", padding:5}}  >PLAYERS PLAYING @ {lobby}?</Text>
				<View style={{flexDirection:"row", justifyContent:"flex-start", alignItems:"flex-start", width:"100%",}} >
					{players.map((e,index) =>
						<View key={index} style={{alignItems: "center", gap:3, marginLeft: 5, marginRight:5}} >
							<TouchableOpacity onPress={()=>removePlayer(e).then(setPlayers).catch()} >
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
				<GameCard onPlay={()=>router.push({pathname:"imposter", params:{
          _players:JSON.stringify(players),
          _offline:JSON.stringify(offline)
        }})} color="#ff43a5" title="Imposter" description="Everyone gets a word and are say another word associated with it. But one imposter doesnt know the word and are trying to fit in."/>
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
