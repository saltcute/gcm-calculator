import { truncateNumber } from "../util";

export const ComboLamps = ["none", "fc", "ab", "abp"] as const;
export type ComboLamps = (typeof ComboLamps)[number];

/**
 * Calculate the rating of a score.
 * @param internalLevel Internal level of the chart.
 * @param score Score, range between 0 to 1010000.
 * @param bell Full Bell or None.
 * @param combo All Break Plus, All Break, Full Combo or None.
 * @returns Raw decimal rating value.
 */
export function calculateReFreshScoreRating(
    internalLevel: number,
    score: number,
    combo?: ComboLamps,
    isFullBell?: boolean,
): number {
    let bonus = 0,
        scoreCoef = 0;
    if (score >= 1010000) {
        scoreCoef = 2.0;
        bonus += 0.3; // SSS+ bonus;
    } else if (score >= 1007500) {
        // scoreCoef = 1.75 + ((score - 1007500) / 2500) * 0.25;
        scoreCoef = 1.75 + (score - 1007500) / 10000;
        bonus += 0.3; // SSS+ bonus;
    } else if (score >= 1000000) {
        // scoreCoef = 1.25 + ((score - 1000000) / 7500) * 0.5;
        scoreCoef = 1.25 + (score - 1000000) / 15000;
        bonus += 0.2; // SSS bonus;
    } else if (score >= 990000) {
        // scoreCoef = 0.75 + ((score - 990000) / 10000) * 0.5;
        scoreCoef = 0.75 + (score - 990000) / 20000;
        bonus += 0.1; // SS bonus;
    } else if (score >= 970000) {
        // scoreCoef = 0 + ((score - 970000) / 20000) * 0.75;
        scoreCoef = 0 + ((score - 970000) / 80000) * 3;
    } else if (score >= 900000) {
        scoreCoef = -4.0 - ((900000 - score) / 70000) * 4.0;
    } else if (score >= 800000) {
        scoreCoef = -6.0 - ((800000 - score) / 100000) * 2.0;
    } else {
        scoreCoef = -internalLevel - (-score / 800000) * (internalLevel - 6.0);
    }

    if (isFullBell) {
        bonus += 0.05;
    }

    if (combo === "abp") {
        bonus += 0.35;
    } else if (combo === "ab") {
        bonus += 0.3;
    } else if (combo === "fc") {
        bonus += 0.1;
    }

    return Math.max(
        0,
        truncateNumber(
            parseFloat(
                (internalLevel + truncateNumber(scoreCoef, 3) + bonus).toFixed(
                    6,
                ),
            ),
            3,
        ),
    );
}

export function getStar(starRatio: number) {
    if (starRatio < 0 || starRatio > 1) return 0;
    if (starRatio >= 0.98) return 5;
    if (starRatio >= 0.97) return 4;
    if (starRatio >= 0.96) return 3;
    if (starRatio >= 0.95) return 2;
    if (starRatio >= 0.94) return 1;
    return 0;
}

export function calculateReFreshStarRating(
    internalLevel: number,
    starCount: number,
) {
    if (starCount < 0) starCount = 0;
    if (starCount > 5) starCount = 5;
    return Math.floor(starCount * internalLevel * internalLevel) / 1000;
}

export function calculateScoreRating(internalLevel: number, score: number) {
    let scoreCoef = 0;
    if (score >= 1007500) {
        scoreCoef = 2.0;
    } else if (score >= 1000000) {
        scoreCoef = 1.5 + ((score - 1000000) / 7500) * 0.5;
    } else if (score >= 970000) {
        scoreCoef = 0 + ((score - 970000) / 30000) * 1.5;
    } else if (score >= 900000) {
        scoreCoef = -4.0 - ((900000 - score) / 70000) * 4.0;
    } else if (score >= 800000) {
        scoreCoef = -6.0 - ((800000 - score) / 100000) * 2.0;
    } else {
        scoreCoef = -internalLevel - (-score / 800000) * (internalLevel - 6.0);
    }

    return Math.max(
        0,
        truncateNumber(
            parseFloat(
                (internalLevel + truncateNumber(scoreCoef, 2)).toFixed(4),
            ),
            2,
        ),
    );
}
