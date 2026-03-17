import { Text, TouchableOpacity, Animated } from "react-native";
import { StyleSheet } from 'react-native';
import { useRef } from 'react';

const styles = StyleSheet.create({
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  inner: {
    borderRadius: 50,
    overflow: 'hidden',
    // subtle inner highlight for depth
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.25)',
  },
});

export default function Button(props: any) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: 0.94,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 30,
      bounciness: 6,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={1}
        style={[
          styles.button,
          styles.inner,
          {
            backgroundColor: props.color,
            // layered shadow for depth
            shadowColor: props.color,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.45,
            shadowRadius: 12,
            elevation: 8,
          },
        ]}
      >
        <Text style={styles.buttonText}>{props.text}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
