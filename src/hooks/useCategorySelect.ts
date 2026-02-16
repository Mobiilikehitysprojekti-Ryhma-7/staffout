import { useState } from "react";

type Params<T extends string> = {
    value: T;
    onChange: (next: T) => void;
};

export function useCategorySelect<T extends string>({ value, onChange }: Params<T>) {
    // Local sheet state
    const [open, setOpen] = useState(false);

    const isEmpty = !value;

    function close() {
        setOpen(false);
    }

    function pickPreset(next: T) {
        onChange(next);
        close();
    }

    return {
        open,
        setOpen,

        isEmpty,

        close,
        pickPreset,
    };
}
