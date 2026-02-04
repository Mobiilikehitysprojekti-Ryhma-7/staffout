import { View } from 'react-native'
import React from 'react'
import { Feather } from '@expo/vector-icons';

export function AvatarPlaceholder() {
    return (
        <View style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: '#000000', alignItems: 'center', justifyContent: 'center' }}>
            <Feather name="user" size={30} color="#ffffff" />
        </View>
    )
}

export function OrganizationAvatarPlaceholder() {
    return (
        <View style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: '#000000', alignItems: 'center', justifyContent: 'center' }}>
            <Feather name="briefcase" size={30} color="#ffffff" />
        </View>
    )
}