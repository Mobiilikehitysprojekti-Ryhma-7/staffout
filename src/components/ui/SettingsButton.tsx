import { Pressable, StyleSheet } from 'react-native'
import React from 'react'
import { router } from 'expo-router'
import { Feather } from '@expo/vector-icons';

export default function SettingsButton() {
  return (
       <Pressable style={styles.actionBtn} onPress={() => router.push('/(settings)/settings')}>
          <Feather name="settings" size={20} color="#fff" />
        </Pressable>
  )
}

const styles = StyleSheet.create({
  actionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
  },
})