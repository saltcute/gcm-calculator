import type { OngekiNoteLamp } from "rg-stats/js/algorithms/ongeki-rating";

export const COMBO_LAMPS = ["none", "fc", "ab", "abp"] as const;
export type ComboLamps = (typeof COMBO_LAMPS)[number];

export const LAMP_MAP: Record<ComboLamps, OngekiNoteLamp> = {
    none: "CLEAR",
    fc: "FULL COMBO",
    ab: "ALL BREAK",
    abp: "ALL BREAK+",
};
