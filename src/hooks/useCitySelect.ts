import { useMemo, useState } from "react";
import { cleanCity } from "@/src/utils/cleanCity";

type Params = {
    value: string;
    onChange: (city: string) => void;
};

export function useCitySelect({ value, onChange }: Params) {
    // Local sheet state
    const [open, setOpen] = useState(false);
    const [showOtherInput, setShowOtherInput] = useState(false);
    const [otherDraft, setOtherDraft] = useState("");

    // Normalized value only for displaying / comparing
    const normalizedValue = useMemo(() => (cleanCity(value) ?? value).trim(), [value]);
    const isEmpty = !normalizedValue;

    function close() {
        setOpen(false);
        setShowOtherInput(false);
        setOtherDraft("");
    }

    function pickPreset(city: string) {
        onChange(city);
        close();
    }

    function startOther() {
        setOtherDraft("");
        setShowOtherInput(true);
    }

    function saveOther() {
        const raw = otherDraft.trim();
        const cleaned = cleanCity(raw);
        if (!cleaned) return; // Validate input, but keep the raw text stored
        onChange(raw);
        close();
    }

    return {
        open,
        setOpen,
        showOtherInput,
        setShowOtherInput,
        otherDraft,
        setOtherDraft,

        normalizedValue,
        isEmpty,

        close,
        pickPreset,
        startOther,
        saveOther,
    };
}
