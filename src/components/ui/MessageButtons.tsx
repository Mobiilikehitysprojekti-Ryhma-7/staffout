import { View, StyleSheet } from 'react-native'
import React from 'react'
import { MaterialIcons } from '@expo/vector-icons';

export default function SendButton({ disabled }: { disabled: boolean }) {
  return (
       <View style={[styles.actionBtn, { backgroundColor: disabled ? "#ccc" : "#007AFF" }]}>
          <MaterialIcons name="send" size={20} color="#fff" />
        </View>
  )
}

const styles = StyleSheet.create({
  actionBtn: {
    marginLeft: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
})