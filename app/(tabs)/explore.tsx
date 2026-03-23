import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";


export default function TabTwoScreen() {

	const [users,setUsers] = useState([]);
	const [events,setEvents] = useState([]);

	const [name, setName] = useState("");
	const [age, setAge] = useState(0);


	useEffect(()=>{
		fetch(`http://localhost:8000`).then(response=>{
			if (!response.ok) {
				throw new Error(`Response status: ${response.status}`);
			}

			response.json().then(result=>{
				setUsers(result.users)
			});
		})

		fetch(`http://localhost:8000`).then(response=>{
			if (!response.ok) {
				throw new Error(`Response status: ${response.status}`);
			}

			response.json().then(result=>{
				setEvents(result.events)
			});
		})
	
	},[])


	const add = () => {
		fetch(`http://localhost:8000/user/add/${name}/${age}`).then(response=>{
		  if (!response.ok) {
				throw new Error(`Response status: ${response.status}`);
			}

			response.json().then(result=>{
				console.log(result);
			});
		})
	}


  return (
    <View>
			<Text style={{color:"white"}} >Users</Text>
			{users.map(user=>
				<View style={styles.user}>
					<Text style={{color:"white"}} >{user.name}</Text>
				</View>
			)}

			<View style={{backgroundColor:"#aaa", marginTop:10}} >
				<TextInput onChangeText={setName} style={styles.input} placeholder="Name" ></TextInput>
				<TextInput onChangeText={setAge} style={styles.input} placeholder="Age" ></TextInput>

				<TouchableOpacity style={styles.user} onPress={add} >
					<Text>Add</Text>
				</TouchableOpacity>
				
			</View>			

			{events.map(event=>
				<ScrollView style={styles.user}>
					<Text style={{color:"white"}} >{event.data}</Text>
					<Text style={{color:"white"}} >Creator: {event.creator ? event.creator.name : ""}</Text>
					<Text style={{color:"white"}} >Sent to: {event.sendto ? event.sendto.name : ""}</Text>
				</ScrollView>
			)}
		</View>
  );
}

const styles = StyleSheet.create({
  user:{
		backgroundColor:"gray",
		margin:5,
		borderRadius:10,
		padding:10
	},
	input:{
		backgroundColor:"lightgray",
		margin:5,
		borderRadius:10,
		padding:10,
		color:"black"
	}
});
