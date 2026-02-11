export type CitySelectProps = {
    value: string;
    onChange: (city: string) => void;
    options: string[];
    placeholder?: string;

    // Optional UI texts
    title?: string;
    otherOptionLabel?: string;
    otherInputLabel?: string;
    otherInputPlaceholder?: string;
};