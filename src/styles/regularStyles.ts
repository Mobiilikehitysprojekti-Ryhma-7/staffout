import { StyleSheet } from 'react-native';

export const regularStyles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
        width: '100%',
        borderRadius: 5,
    },
})

export const typography = StyleSheet.create({
    title: {
        fontSize: 22,
        fontWeight: "800",
        marginBottom: 10,
        alignSelf: 'flex-start',
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    body: {
        fontSize: 14,
        fontWeight: '400',
        marginBottom: 5,
        alignItems: 'flex-start',
        width: '100%',
    },
})