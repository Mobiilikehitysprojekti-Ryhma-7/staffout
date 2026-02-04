import { useState } from 'react';
import { Alert, Button, Image, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { AvatarPlaceholder } from './ui/AvatarPlaceholder';

type Props = {
  title: string;
  onImageSelected?: (base64: any) => void;
  photoURL? : string;
};

export default function ImagePickerComponent({ title, onImageSelected, photoURL }: Props) {
  const [image, setImage] = useState<string | null>(null);

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
      {image || photoURL ? (
        <Image
          source={image ? { uri: image } : photoURL ? { uri: photoURL } : undefined}
          style={{ width: 50, height: 50, borderRadius: 25, marginRight: 10 }}
        />
      ) : (
        <View style={{marginRight: 10}}>
        <AvatarPlaceholder />
        </View>
      )}

      <Button title={title} onPress={pickImage} />
    </View>
  );
}