import { StyleSheet } from 'react-native'
import { Feather } from '@expo/vector-icons'
import React from 'react'
import { View } from '../Themed'

export default function MoreButton() {
    return (
        <View style={styles.actionBtn}>
            <Feather name="more-vertical" size={20} color="#fff" />
        </View>
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
});