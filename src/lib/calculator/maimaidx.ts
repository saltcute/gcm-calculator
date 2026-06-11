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
    [75, 12.0],
    [70, 11.2],
    [60, 9.6],
    [50, 8.0],
    [40, 6.4],
    [30, 4.8],
    [20, 3.2],
    [10, 1.6],
    [0, 0],
];
const RATING_COEFFICIENT_TIERS: ReadonlyArray<readonly [number, number]> =
    RATING_CONSTANTS.map(
        ([percent, coefficient]) =>
            [
                Math.round(percent * 10000),
                Math.round(coefficient * 10),
            ] as const,
    );

const MAX_SCORE_INT = 1005000;
const MAX_ACHIEVEMENT = 101;
const MIN_CONSTANT_INT = 10;
const MAX_CONSTANT_INT = 150;

export interface AchievementConstantCombination {
    constant: number;
    minAchievement: number;
    maxAchievement: number;
}

/**
 * Find every internal level (constant) that can produce the given rating, along
 * with the achievement range that yields it on that chart.
 *
 * @param rating Target single-chart rating.
 * @returns One entry per qualifying constant, ascending by constant.
 */
export function calculateAchievementConstantsForRating(
    rating: number,
    isAP: boolean,
    version: "dx" | "circle",
): AchievementConstantCombination[] {
    const apBonus = version === "circle" && isAP;
    const target = rating - (apBonus ? 1 : 0);
    if (target < 0) return [];

    const results: AchievementConstantCombination[] = [];

    for (let iclInt = MIN_CONSTANT_INT; iclInt <= MAX_CONSTANT_INT; iclInt++) {
        let loScore = Number.POSITIVE_INFINITY;
        let hiScore = Number.NEGATIVE_INFINITY;

        for (let i = 0; i < RATING_COEFFICIENT_TIERS.length; i++) {
            const [boundary, coeff] = RATING_COEFFICIENT_TIERS[i];
            const tierLow = boundary;
            const tierHigh =
                i === 0
                    ? MAX_SCORE_INT
                    : RATING_COEFFICIENT_TIERS[i - 1][0] - 1;
            if (tierLow > tierHigh) continue;

            const k = coeff * iclInt;
            let candidateLo: number;
            let candidateHi: number;
            if (k === 0) {
                if (target !== 0) continue;
                candidateLo = tierLow;
                candidateHi = tierHigh;
            } else {
                candidateLo = Math.ceil((target * 1e8) / k);
                candidateHi = Math.ceil(((target + 1) * 1e8) / k) - 1;
            }

            const lo = Math.max(candidateLo, tierLow);
            const hi = Math.min(candidateHi, tierHigh);
            if (lo > hi) continue;

            if (lo < loScore) loScore = lo;
            if (hi > hiScore) hiScore = hi;
        }

        if (loScore === Number.POSITIVE_INFINITY) continue;

        if (apBonus && loScore < MAX_SCORE_INT) continue;

        results.push({
            constant: iclInt / 10,
            minAchievement: loScore / 10000,
            maxAchievement:
                hiScore >= MAX_SCORE_INT ? MAX_ACHIEVEMENT : hiScore / 10000,
        });
    }

    return results;
}

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
