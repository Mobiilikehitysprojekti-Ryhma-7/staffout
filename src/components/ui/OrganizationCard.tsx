import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'
import OrganizationSettingsButton from '@/src/components/ui/OrganizationSettingsButton';
import { OrganizationAvatarPlaceholder } from './AvatarPlaceholder';


export default function OrganizationCard({ organizationId, organizationName, organizationDescription, organizationAvatar, interactive = false }: { organizationId: string | undefined; organizationName: string; organizationDescription: string; organizationAvatar: string; interactive?: boolean; }) {
    return (
        <>
            {organizationId && (
                <View style={styles.card}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', backgroundColor: 'transparent' }}>
                        {organizationAvatar ? (
                            <Image source={{ uri: organizationAvatar }} style={styles.avatar} />
                        ) : (
                            <OrganizationAvatarPlaceholder />
                        )}
                        <View style={{ flex: 1, marginHorizontal: 20, backgroundColor: 'transparent' }}>
                            {organizationName && (
                                <Text style={styles.organizationTitle}>
                                    {organizationName}
                                </Text>
                            )}
                            {organizationDescription && interactive && (
                                <Text style={styles.description}>
                                    {organizationDescription}
                                </Text>
                            )}
                        </View>
                    </View>
                    {interactive && <OrganizationSettingsButton />}
                </View>
            )}
        </>
    )
}

const styles = StyleSheet.create({
    avatar: {
        width: 50, height: 50, borderRadius: 25
    },
    card: {
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 10,
        backgroundColor: '#F5F5F5',
        padding: 10,
        borderRadius: 10,
        width: '100%'
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
    },
    organizationTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000000',
    },
    description: {
        marginTop: 5,
        fontSize: 14,
        fontWeight: '400',
        color: '#666',
    },
});