import { useEffect, useState } from 'react'
import { useUserProfile } from './useUserProfile';
import { useOrganizationMembership } from './useOrganizationMembership';
import { createChannel, deleteChannel, getChannels, updateChannel } from '@/src/services/chat/channels.service';

export default function useChannels() {
    const { user } = useUserProfile();
    const oid = user?.organizationId;
    const role = useOrganizationMembership();
    const [channels, setChannels] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [channelName, setChannelName] = useState<string>('');

    useEffect(() => {
        fetchChannels();
    }, [oid]);

    async function fetchChannels() {
        if (!oid) return;
        const channels = await getChannels(oid);
        if (!channels) return;
        setChannels(channels)
        setLoading(false);
    }

    const handleCreate = async () => {
        if (channelName.trim().length === 0) {
            alert("Kanavan nimi ei voi olla tyhjä.");
            return false;
        }
        if (oid) {
            try {
                await createChannel(oid, channelName);
                setChannelName('');
                alert("Kanava luotu onnistuneesti.");
                await fetchChannels();
                return true;
            } catch (error) {
                console.error("Failed to create channel:", error);
                return false;
            }
        }
        return false;
    }

    const handleEdit = async (channelId: string) => {
        if (channelName.trim().length === 0) {
            alert("Kanavan nimi ei voi olla tyhjä.");
            return false;
        }
        if (oid) {
            try {
                await updateChannel(oid, channelId, channelName);
                setChannelName('');
                alert("Kanava päivitetty onnistuneesti.");
                await fetchChannels();
                return true;
            } catch (error) {
                console.error("Failed to update channel:", error);
                return false;
            }
        }
        return false;
    }

    const handleDelete = async (channelId: string) => {
        if(!oid) return false;
        try {
            await deleteChannel(oid, channelId);
            alert("Kanava poistettu onnistuneesti.");
            await fetchChannels();
        } catch (error) {
            console.error("Failed to delete channel:", error);
        }
    }

    return {
        channels,
        loading,
        role,
        handleCreate,
        channelName,
        setChannelName,
        handleEdit,
        handleDelete,
    }
}

