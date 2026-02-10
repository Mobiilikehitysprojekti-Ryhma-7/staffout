import { TouchableOpacity, Platform } from 'react-native'
import React from 'react'
import { handleSignOut } from '../../services/auth/auth.service';
import { MaterialIcons } from '@expo/vector-icons';
import ConfirmSignout from './ConfirmSignout';
export default function HeaderSignoutButton() {
    return (
        <TouchableOpacity
            onPress={Platform.OS === 'web' ? handleSignOut : ConfirmSignout}
            style={{ marginLeft: 7.5 }}
        >
            <MaterialIcons name="logout" size={24} color="red" />
        </TouchableOpacity>)
}