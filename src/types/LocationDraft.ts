// Location payload stored for a user.
export type LocationDraft = {
    lat: number;
    lng: number;
    accuracy: number | null;
    geohash: string;
    city?: string;
};