// Shared types for city statistics and pie slices.

export type CityStat = {
    city: string;
    count: number;
    percent: number;
    color: string;
};

export type PieSlice = {
    value: number;
    color: string;
    text: string;
    focused?: boolean;
};