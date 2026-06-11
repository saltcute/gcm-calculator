import { MaimaiDXRate } from "rg-stats";
import { truncateNumber } from "../util";

export const RATING_CONSTANTS = [
    [100.5, 22.4],
    [100.4999, 22.2],
    [100, 21.6],
    [99.9999, 21.4],
    [99.5, 21.1],
    [99, 20.8],
    [98.9999, 20.6],
    [98, 20.3],
    [97, 20.0],
    [96.9999, 17.6],
    [94, 16.8],
    [90, 15.2],
    [80, 13.6],
    [79.9999, 12.8],
    [75, 13.6],
    [70, 13.6],
    [60, 13.6],
    [50, 13.6],
    [40, 6.4],
    [30, 4.8],
    [20, 3.2],
    [10, 1.6],
    [0, 0],
];
/**
 * Calculate the rating of a score.
 * @param internalLevel Internal level of the chart.
 * @param achievement Achivement in percentage, range between 0 to 101.0000.
 * @returns Raw decimal rating value.
 */
export function calculateRating(
    internalLevel: number,
    achievement: number,
    isAP: boolean,
    version: "dx" | "circle",
): number {
    return MaimaiDXRate.calculate(
        achievement,
        internalLevel,
        (version === "circle" && isAP && "ALL PERFECT") || undefined,
    );
}

export function calculateNextRatingBoost(
    internalLevel: number,
    achievement: number,
    isAP: boolean,
    version: "dx" | "circle",
): {
    diff: number;
    boost: number;
} {
    if (achievement >= 100.5) return { diff: 0, boost: 0 };

    const ACH_PRECISION = 4;
    const ACH_MULT = 10 ** ACH_PRECISION;
    const ceilToStep = (v: number) =>
        Math.min(Math.ceil(v * ACH_MULT) / ACH_MULT, 100.5);

    const currentRating = calculateRating(
        internalLevel,
        achievement,
        isAP,
        version,
    );

    const candidates: number[] = [];

    for (const [score] of RATING_CONSTANTS) {
        if (score > achievement && score <= 100.5) candidates.push(score);
    }

    const currentTierIndex = RATING_CONSTANTS.findIndex(
        ([score]) => achievement >= score,
    );
    if (currentTierIndex !== -1) {
        const [, currentConstant] = RATING_CONSTANTS[currentTierIndex];
        if (currentConstant > 0 && internalLevel > 0) {
            const required =
                ((currentRating + 1) * 100) / (currentConstant * internalLevel);
            const base = Math.round(ceilToStep(required) * ACH_MULT);
            for (let i = 0; i < 10; i++) {
                candidates.push((base + i) / ACH_MULT);
            }
        }
    }

    candidates.push(100.5);

    let bestTarget: number | null = null;
    let bestRating = currentRating;
    for (const raw of candidates) {
        const target = ceilToStep(raw);
        if (target <= achievement) continue;
        const r = calculateRating(internalLevel, target, isAP, version);
        if (r > currentRating && (bestTarget === null || target < bestTarget)) {
            bestTarget = target;
            bestRating = r;
        }
    }

    if (bestTarget === null) return { diff: 0, boost: 0 };

    return {
        diff: truncateNumber(bestTarget - achievement, ACH_PRECISION),
        boost: bestRating - currentRating,
    };
}
