import { BenefitCategories, CategoryOption } from "../components/benefits/BenefitForm";

export type CategorySelectProps = {
    value: BenefitCategories;
    onChange: (next: BenefitCategories) => void;
    options: readonly CategoryOption[];
    placeholder?: string;

    // Optional UI texts
    title?: string;
};