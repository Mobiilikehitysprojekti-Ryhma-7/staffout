import { View, Text, StyleSheet, Button, TextInput, Platform } from 'react-native'
import { BottomSheetTextInput, BottomSheetView } from '@gorhom/bottom-sheet';
import { BenefitCategorySelect } from './BenefitCategorySelect';
import { BenefitCategory } from '@/src/types/benefit';
import { BenefitValidUntil } from './BenefitValidUntil';
import ImagePickerComponent from '@/src/components/ImagePicker';
import { useState } from 'react';

const CATEGORIES: { key: BenefitCategory; label: string }[] = [
  { key: "sports", label: "Urheilu" },
  { key: "meals", label: "Ruokailu" },
  { key: "culture", label: "Kulttuuri" },
  { key: "health", label: "Terveys" },
  { key: "other", label: "Muu" },
];

export type BenefitCategories = typeof CATEGORIES[number]["key"];
export type CategoryOption = typeof CATEGORIES[number];

type BenefitFormProps = {
    benefitTitle: string;
    setBenefitTitle: (value: string) => void;
    benefitCategory: any;
    setBenefitCategory: (value: any) => void;
    benefitValidUntil: any;
    setBenefitValidUntil: (value: any) => void;
    benefitPhotoURL: string;
    setBenefitPhotoURL: (value: string) => void;
    benefitDescription: string;
    setBenefitDescription: (value: string) => void;
    handleCreate: () => void;
    handleCancel: () => void;
    setBase64Image: (value: string | null) => void;
};

export default function BenefitForm({
    benefitTitle,
    setBenefitTitle,
    benefitCategory,
    setBenefitCategory,
    benefitValidUntil,
    setBenefitValidUntil,
    benefitPhotoURL,
    setBenefitPhotoURL,
    benefitDescription,
    setBenefitDescription,
    handleCreate,
    handleCancel,
    setBase64Image
}: BenefitFormProps) {

    const Input = Platform.OS === 'web' ? TextInput : BottomSheetTextInput

    return (
        <BottomSheetView style={styles.container}>
            <Text style={styles.label}>Edun otsikko</Text>
            <Input
                placeholder="Edun otsikko"
                style={styles.input}
                value={benefitTitle}
                onChangeText={setBenefitTitle}
            ></Input>
            <Text style={styles.label}>Edun kuvaus</Text>
            <Input
                placeholder="Edun kuvaus"
                style={styles.input}
                value={benefitDescription}
                onChangeText={setBenefitDescription}
            ></Input>
            <Text style={styles.label}>Edun kategoria</Text>
            <BenefitCategorySelect
                value={benefitCategory}
                onChange={setBenefitCategory}
                options={CATEGORIES}
            />
            <Text style={styles.label}>Edun voimassaolo päivämäärä</Text>
            <BenefitValidUntil
                value={benefitValidUntil}
                onChange={setBenefitValidUntil}
                fieldStyle={styles.input}
            />
            <Text style={styles.label}>Edun kuva</Text>
            <ImagePickerComponent title="Valitse kuva" onImageSelected={setBase64Image} photoURL={benefitPhotoURL} />
            <View style={{ height: 20 }}></View>
            <View style={styles.buttonContainer}>
                <Button title="Luo etu" onPress={handleCreate}></Button>
                <Button title="Peruuta" onPress={handleCancel}></Button>
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
        flexDirection: 'column',
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
