
import { Keyboard } from "react-native";
import { useEffect, useState } from "react";
import { useUserProfile } from "./useUserProfile";
import { useOrganizationMembership } from "./useOrganizationMembership";
import { getUserById } from "@/src/services/users.service";
import { uploadMessageImage, getMessageImageURL } from "../services/storage/storage.service";
import { doc, collection } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import {
    createMessage,
    deleteMessage,
    getMessages,
    updateMessage,
} from "@/src/services/chat/messages.service";

type SelectedMessage = {
    messageId: string;
    text: string;
    createdBy: string;
};

export default function useMessages(channelId?: string) {
    const { user } = useUserProfile();
    const { role } = useOrganizationMembership();
    const uid = user?.uid;
    const oid = user?.organizationId;

    const [messages, setMessages] = useState<any[]>([]);
    const [merged, setMerged] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [selectedMessage, setSelectedMessage] = useState<SelectedMessage | null>(null);
    const [editMessage, setEditMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [base64Image, setBase64Image] = useState<string | null>(null);

    useEffect(() => {
        fetchMessages();
    }, [oid, channelId]);

    useEffect(() => {
        if (messages.length === 0) {
            setMerged([]);
            return;
        }
        mergeUserProfile();
    }, [messages]);

    async function fetchMessages() {
        if (!oid || !channelId) return;
        setLoading(true);
        const list = await getMessages(oid, channelId);
        setMessages(list ?? []);
        setLoading(false);
    }

    async function mergeUserProfile() {
        const mergedData = await Promise.all(
            messages.map(async (message) => {
                const userProfile = await getUserById(message.createdBy);
                return { ...message, ...userProfile };
            })
        );
        setMerged(mergedData);
    }

    async function sendMessage() {
        if (!oid || !channelId || newMessage.trim().length === 0) return false;
        try {

            const messageRef = doc(collection(db, "messages"));
            const messageId = messageRef.id;

            let photoURL = "";
            if (base64Image) {
                const upload = await uploadMessageImage(base64Image, messageId);
                photoURL = await getMessageImageURL(upload.path);
            }

            const attachmentsToSend = photoURL ? [photoURL] : [];
            await createMessage(oid, channelId, newMessage, attachmentsToSend);
            setNewMessage("");
            setBase64Image(null);
            await fetchMessages();
            return true;
        } catch (error) {
            console.error("Error sending message:", error);
            return false;
        }
    }

    async function handleUpdateMessage() {
        if (!selectedMessage || !oid || !channelId) {
            console.error("Missing required parameters for editing message.");
            return false;
        }
        try {
            await updateMessage(oid, channelId, selectedMessage.messageId, editMessage);
            await fetchMessages();
            return true;
        } catch (error) {
            console.error("Error updating message:", error);
            return false;
        }
    }

    async function handleDeleteMessage() {
        if (!selectedMessage || !oid || !channelId) {
            console.error("Missing required parameters for deleting message.");
            return false;
        }
        try {
            await deleteMessage(oid, channelId, selectedMessage.messageId);
            await fetchMessages();
            return true;
        } catch (error) {
            console.error("Error deleting message:", error);
            return false;
        }
    }

    const startEditMessage = (messageId: string, text: string, createdBy: string) => {
        setSelectedMessage({ messageId, text, createdBy });
        setEditMessage(text);
        Keyboard.dismiss();
    };

    const clearSelection = () => {
        setSelectedMessage(null);
        setEditMessage("");
    };

    return {
        merged,
        loading,
        role,
        uid,
        newMessage,
        setNewMessage,
        selectedMessage,
        setSelectedMessage,
        editMessage,
        setEditMessage,
        sendMessage,
        handleUpdateMessage,
        handleDeleteMessage,
        startEditMessage,
        clearSelection,
        base64Image,
        setBase64Image,
    };
}