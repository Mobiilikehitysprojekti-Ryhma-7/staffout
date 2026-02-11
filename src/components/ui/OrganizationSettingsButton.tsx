import { Pressable, Text, StyleSheet, View } from 'react-native'
import React from 'react'
import { router } from 'expo-router'
import { Feather } from '@expo/vector-icons';
import { useOrganizationMembership } from '../../hooks/useOrganizationMembership';

export default function OrganizationSettingsButton() {
    const { role } = useOrganizationMembership();
    if (role !== 'admin') return null;
  return (
       <Pressable style={styles.actionBtn} onPress={() => router.push('/(admin)/admin-settings')}>
        <Text style={{ color: "#ffffff", fontWeight: "600", fontSize: 16 }}>Ylläpitäjän asetukset</Text>
          <Feather name="settings" size={20} color="#ffffff" />
        </Pressable>
  )
}

const styles = StyleSheet.create({
  actionBtn: {
    marginTop: 10,
    height: 40,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 10,
    backgroundColor: "#000000",
    justifyContent: "center",
    width: '100%'
  },
})