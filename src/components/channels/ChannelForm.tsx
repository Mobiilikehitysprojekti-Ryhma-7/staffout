import { View, Text, StyleSheet, Button, TextInput, Platform } from 'react-native'
import { BottomSheetTextInput, BottomSheetView } from '@gorhom/bottom-sheet';

type ChannelFormProps = {
    channelName: string;
    setChannelName: (value: string) => void;
    handleCreate: () => void;
    handleCancel: () => void;
};

export default function ChannelForm({
    channelName,
    setChannelName,
    handleCreate,
    handleCancel,
}: ChannelFormProps) {

    const Input = Platform.OS === 'web' ? TextInput : BottomSheetTextInput

    return (
        <BottomSheetView style={styles.container}>
            <Text style={styles.label}>Kanavan nimi</Text>
            <Input
                placeholder="Kanavan nimi"
                style={styles.input}
                value={channelName}
                onChangeText={setChannelName}
            ></Input>
            <View style={styles.buttonContainer}>
                <Button title="Peruuta" onPress={handleCancel} />
                <Button title="Luo kanava" onPress={handleCreate}></Button>
            </View>
        </BottomSheetView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 10,
    },
    label: {
        fontSize: 14,
        fontWeight: '400',
        marginBottom: 5,
        textAlign: 'left',
        width: '100%',
    },
    error: {
        color: 'red',
        marginBottom: 5,
        fontSize: 14,
        fontWeight: '400',
    },
    input: {
        alignSelf: 'stretch',
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 20,
        width: '100%',
        borderRadius: 5,
    },
});
