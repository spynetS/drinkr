import mqtt, { MqttClient } from 'mqtt';
import { getLobbyCode } from "./utils.ts"

const BROKER_URL = 'ws://localhost:9001/ws';
const TOPIC_PREFIX = 'drinkr';

let client: MqttClient | null = null;

export function getMqttClient(): MqttClient {
  if (client && client.connected) return client;

  client = mqtt.connect(BROKER_URL, {
    clientId: `expo_${Math.random().toString(16).slice(2, 8)}`,
    clean: true,
    reconnectPeriod: 2000,
  });

  client.on('connect', () => console.log('MQTT connected'));
  client.on('error', (err) => console.error('MQTT error:', err.message));

  return client;
}

export function publish(subtopic: string, payload: object) {
  const c = getMqttClient();
  c.publish(`${TOPIC_PREFIX}/${subtopic}`, JSON.stringify(payload), { qos: 1 });
}

export function subscribe(subtopic: string, handler: (payload: any) => void) {
  const c = getMqttClient();
  const topic = `${TOPIC_PREFIX}/${subtopic}`;
  c.subscribe(topic, { qos: 1 });
  c.on('message', (t, p) => {
    if (t === topic) handler(JSON.parse(p.toString()));
  });
}
export function lobbyPublish(subtopic: string, payload: object) {
  getLobbyCode().then(lobby=>{
    publish(`${lobby}/${subtopic}`, payload)
  })
  
}

export function lobbySubscribe(subtopic: string, handler: (payload: any) => void) {
  getLobbyCode().then(lobby=>{
    subscribe(`${lobby}/${subtopic}`, handler)
  });
}
