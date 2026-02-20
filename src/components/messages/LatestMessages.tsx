import { View, Text, StyleSheet, Image, Pressable } from 'react-native'
import React, { useCallback, useState } from 'react'
import { getLatestMessages } from '../../services/chat/messages.service';
import { getUserById } from '../../services/users.service';
import { useFocusEffect } from 'expo-router';
import { useUserProfile } from '@/src/hooks/useUserProfile';
import { AvatarPlaceholderSmall } from '../ui/AvatarPlaceholder';
import { getChannelById } from '@/src/services/chat/channels.service';
import { router } from 'expo-router';
import LoadingScreen from '../ui/LoadingScreen';
import { typography } from "@/src/styles/regularStyles";


export default function LatestMessages() {
    const [merged, setMerged] = useState<any[]>([]);
    const { user } = useUserProfile();
    const oid = user?.organizationId;
    const [loading, setLoading] = useState(false);

    useFocusEffect(
        useCallback(() => {
            let isActive = true; // Prevents setting state if component unmounts

            const loadData = async () => {
                if (!oid) return;

                try {
                    setLoading(true);
                    const messages = await getLatestMessages(oid);

                    if (!messages || messages.length === 0) {
                        if (isActive) {
                            setMerged([]);
                            setLoading(false);
                        }
                        return;
                    }

                    const mergedData = await Promise.all(
                        messages.map(async (message: any) => {
                            try {

                                const [channel, userProfile] = await Promise.all([
                                    getChannelById(oid, message.channelId),
                                    getUserById(message.createdBy)
                                ]);

                                return {
                                    ...message,
                                    ...userProfile,
                                    ...channel
                                };
                            } catch (err) {
                                console.error("Error merging message", err);
                                return message;
                            }
                        })
                    );

                    if (isActive) {
                        setMerged(mergedData);
                    }
                } catch (error) {
                    console.error("Failed to fetch messages", error);
                } finally {
                    if (isActive) setLoading(false);
                }
            };

            loadData();

            return () => {
                isActive = false;
            };
        }, [oid])
    );
    if (loading) {
        return (
            <LoadingScreen />
        );
    }

    return (
        <View>
            <Text style={styles.sectionTitle}>Uusimmat viestit</Text>
            {merged.length > 0 ? merged.slice(0, 3).map((item, index) => (
                <Pressable onPress={() => router.push({ pathname: "/(chat)/messages", params: { channelId: item.channelId, name: item.channelName } })} style={styles.card} key={index}>
                    <View style={{ flex: 1 }}>
                        <View style={styles.headerRow}>
                            {item.photoURL ? (
                                <Image source={{ uri: item.photoURL }}
                                    style={styles.avatar} />
                            ) : (
                                <AvatarPlaceholderSmall />
                            )}
                            <View style={styles.contentContainer}>
                                <View style={styles.textRow}>
                                    <Text style={styles.nameText}>{item.channelName || "Unknown Channel"}</Text>
                                    <Text>-</Text>
                                    <Text style={styles.nameText}>
                                        {item.first || ""} {item.last || ""}
                                    </Text>
                                    <Text style={styles.time}>
                                        {item.createdAt.toDate().toLocaleString()}
                                    </Text>
                                </View>
                                <Text style={styles.text}>{item.text}</Text>
                            </View>
                        </View>
                    </View>
                </Pressable>
            )) : (
                <Text style={styles.text}>Ei uusia viestejä</Text>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    sectionTitle: {
        ...typography.title,
    },

    card: {
        flexDirection: 'row',
        marginBottom: 10,
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 10,
        width: '100%',
    },

    headerRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
        flex: 1,
    },

    contentContainer: {
        flex: 1,
        flexDirection: 'column',
    },

    textRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        flexWrap: 'wrap',
        columnGap: 5,
    },

    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },

    nameText: {
        fontSize: 14,
        fontWeight: "600",
        flexShrink: 1,
    },

    time: {
        fontSize: 12,
        color: '#666',
        flexShrink: 1,
    },

    text: {
        fontSize: 14,
        color: '#000000',
        flexShrink: 1,
        marginTop: 5,
    },
});
