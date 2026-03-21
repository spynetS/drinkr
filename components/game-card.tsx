import { Image, View, Text, TouchableOpacity } from "react-native";
import { StyleSheet } from 'react-native';
import Button from '@/components/button';
import axios from 'axios'

interface Props {
  title: string;
  description: string;
  color: string;
}

export default function GameCard({ color, title, description }: Props) {

	let darkColor = darkenHexColor(color,0.7);

	const play = () => {
		axios.post('/events/',{
			"data": description,
			"type": 0,
			"creator": 1,
			"sendto": null
		})
			.then(response => console.log(response))
			.catch(error => console.error('Error fetching users:', error));

	}

  return (
    <View style={{
			width: "40%",
			borderWidth: 3,
			borderRadius: 16,
			shadowOffset: { width: 0, height: 0 },
			shadowOpacity: 0.9,
			shadowRadius: 15,
			elevation: 10,
			padding: 5,
			flexDirection: "column",
			alignItems: "center",
			backgroundColor: darkColor,
			borderColor: color,
			shadowColor: color
		}}>
      <Image source={require("@/assets/images/dice.png")} style={{ width: 80, height: 80 }} />
      <Text style={{ fontWeight: "800", color: "white", fontSize: 16, margin: 2 }}>{title}</Text>
      <Text style={{ fontWeight: "300", color: "#aaa", fontSize: 12, textAlign: "center", marginTop: 5, marginBottom: 10 }}>{description}</Text>
      <Button onPress={play} text={"PLAY"} color={color}/>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    
  }
});


function darkenHexColor(hex, amount = 0.2) {
  if (!hex) return '#000000'; // fallback if hex is undefined
  // Remove # if present
  hex = hex.replace('#', '');

  // Convert 3-digit hex to 6-digit
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }

  // Parse R, G, B
  const r = parseInt(hex.substring(0,2), 16);
  const g = parseInt(hex.substring(2,4), 16);
  const b = parseInt(hex.substring(4,6), 16);

  // Darken by multiplying each by (1 - amount)
  const newR = Math.max(0, Math.min(255, Math.floor(r * (1 - amount))));
  const newG = Math.max(0, Math.min(255, Math.floor(g * (1 - amount))));
  const newB = Math.max(0, Math.min(255, Math.floor(b * (1 - amount))));

  // Convert back to hex and return
  const toHex = (n) => n.toString(16).padStart(2, '0');
  return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`;
}
