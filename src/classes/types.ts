
type SpeciesClass = "Omnivore" | "Herbivore" | "Carnivore" | "Photovore"
type SpeciesSize = "Tiny" | "Small" | "Medium" | "Large" | "Enormous"
type SpeciesType = "Permanent" | "Limited" | "Event" | "Exclusive" | "Mission"

export enum SpeciesStability {
    STABLE = "STABLE",
    UNSTABLE = "UNSTABLE",
    RISING = "RISING",
    LOWERING = "LOWERING",
    UNKNOWN = "UNKNOWN",
}

export interface SpeciesData {
    name: string;
    description?: string;
    value_min: number;
    value_max: number;
    demand: number;
    stability: SpeciesStability;
    class?: keyof SpeciesClass;
    type?: SpeciesType;
    size?: keyof SpeciesSize;
}

export interface SpeciesValue {
    min: number;
    max: number;
}