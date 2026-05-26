import { truncateNumber } from "../util";

export const RATING_CONSTANTS = [
    [100.5, 22.4],
    [100, 21.6],
    [99.5, 21.1],
    [99, 20.8],
    [98, 20.3],
    [97, 20.0],
    [94, 16.8],
    [90, 15.2],
    [80, 13.6],
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
    const [_, ratingConstant] = RATING_CONSTANTS.find(
        ([score]) => achievement >= score,
    ) || [0, 0];
    let rating = truncateNumber(
        (Math.min(achievement, 100.5) / 100) * ratingConstant * internalLevel,
        0,
    );
    if (version === "circle" && isAP) {
        rating += 1;
    }
    return rating;
}

export function calculateAchievementDifferenceUntilNextMilestone(
    achievement: number,
) {
    let lastAchievementRequired = -1;
    for (const [achievementRequired] of RATING_CONSTANTS) {
        if (achievement >= achievementRequired) break;
        lastAchievementRequired = achievementRequired;
    }
    if (lastAchievementRequired < 0) return null;
    return truncateNumber(lastAchievementRequired - achievement, 4);
}

export function calculateRatingBoostAfterNextMilestone(
    internalLevel: number,
    achievement: number,
) {
    let lastAchievementRequired = -1;
    for (const [achievementRequired] of RATING_CONSTANTS) {
        if (achievement >= achievementRequired) break;
        lastAchievementRequired = achievementRequired;
    }
    if (lastAchievementRequired < 0) return null;
    return (
        calculateRating(internalLevel, lastAchievementRequired, false, "dx") -
        calculateRating(internalLevel, achievement, false, "dx")
    );
}
