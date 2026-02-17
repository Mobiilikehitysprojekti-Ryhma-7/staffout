import { useState, useEffect } from 'react';
import { Alert, Image, View, Pressable } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { AddButton } from '../ui/MessageButtons';

type Props = {
    onImageSelected?: (base64: any) => void;
    photoURL?: string;
    resetTrigger?: boolean;
};

export default function ImagePickerComponent({ onImageSelected, photoURL, resetTrigger }: Props) {
    const [image, setImage] = useState<string | null>(null);

    useEffect(() => {
        if (resetTrigger) {
            setImage(null);
        }
    }, [resetTrigger]);

    const pickImage = async () => {
        const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!granted) {
            Alert.alert('Permission required', 'Permission to access the media library is required.');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (result.canceled) return;

        const renderedImage = result.assets[0].uri;
        const resized = await manipulateAsync(
            renderedImage,
            [{ resize: { width: 400, height: 400 } }],
            { compress: 0.8, format: SaveFormat.JPEG, base64: true }
        );

        setImage(resized.uri);
        onImageSelected?.(resized.base64);
    };

    return (
        <View style={{ alignItems: 'center', flexDirection: 'row' }}>
            <Pressable onPress={() => setImage(null)}>
                <Image
                    source={image ? { uri: image } : photoURL ? { uri: photoURL } : undefined}
                    style={{ width: 40, height: 40, borderRadius: 10, marginRight: 10 }}
                />
            </Pressable>

            <Pressable disabled={!!image} onPress={pickImage}>
                <AddButton disabled={!!image}></AddButton>
            </Pressable>
        </View>
    );
}