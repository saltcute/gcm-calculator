import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Tooltip from "@mui/material/Tooltip";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import GameVersionSelector, {
    type GameVersions,
} from "#/components/maimaidx/rating/GameVersionSelector";
import NumberField from "#/components/NumberField";
import useLoadStorage from "#/hooks/useLoadStorage";
import useStorage from "#/hooks/useStorage";
import {
    calculateNextRatingBoost,
    calculateRating,
} from "#/lib/calculator/maimaidx";
import { truncate } from "#/lib/util";

export const Route = createFileRoute("/maimaidx/rating/")({
    component: RouteComponent,
});

function RouteComponent() {
    const { t } = useTranslation();

    const stored = useLoadStorage<{
        version: GameVersions;
        achievement: number;
        constants: number;
        isAP: boolean;
    }>("input-values", "/maimaidx/rating");

    const [version, setVersion] = useState<GameVersions>(
        stored.version || "dx",
    );
    const [achievement, setAchievement] = useState(stored.achievement || 100.5);
    const [constants, setConstants] = useState(stored.constants || 13.9);
    const [isAP, setIsAP] = useState(stored.isAP || false);

    useStorage(
        "input-values",
        JSON.stringify({
            version,
            achievement,
            constants,
            isAP,
        }),
        "/maimaidx/rating",
    );

    const { diff, boost } = calculateNextRatingBoost(
        constants,
        achievement,
        isAP,
        version,
    );

    return (
        <div className="flex flex-col lg:flex-row grow gap-8 justify-center">
            <div className="flex flex-col lg:flex-row grow gap-4 items-center">
                <div className="flex flex-col gap-4">
                    <NumberField
                        label={t(
                            "games.maimaidx.tools.rating.input.constants.title",
                        )}
                        tooltip={t(
                            "games.maimaidx.tools.rating.input.constants.tooltip",
                        )}
                        min={0}
                        max={15}
                        step={0.1}
                        value={constants}
                        onValueChange={(v) => !v || setConstants(v)}
                        format={{
                            minimumFractionDigits: 1,
                            maximumFractionDigits: 1,
                        }}
                    ></NumberField>
                    <NumberField
                        label={t(
                            "games.maimaidx.tools.rating.input.achievement",
                        )}
                        min={0}
                        max={101}
                        step={0.05}
                        value={achievement}
                        onValueChange={(v) => !v || setAchievement(v)}
                        format={{
                            minimumFractionDigits: 4,
                            maximumFractionDigits: 4,
                        }}
                    ></NumberField>
                </div>
                <div className="flex flex-col">
                    <GameVersionSelector
                        value={version}
                        onChange={(v) => setVersion(v)}
                    />
                    <Tooltip
                        describeChild
                        arrow
                        title={
                            version === "circle" &&
                            t("games.maimaidx.tools.rating.input.isAP.tooltip")
                        }
                    >
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={isAP}
                                    disabled={version !== "circle"}
                                    onChange={(e) => setIsAP(e.target.checked)}
                                />
                            }
                            label={t(
                                "games.maimaidx.tools.rating.input.isAP.title",
                            )}
                        />
                    </Tooltip>
                </div>
            </div>
            <div className="flex flex-5 flex-col text-nowrap">
                <div className="flex flex-col items-center font-(family-name:--locale-based-font-sans-block-family)">
                    <div className="text-4xl sm:text-5xl xl:text-6xl">
                        RATING
                    </div>
                    <div className="text-7xl sm:text-8xl xl:text-9xl">
                        {truncate(
                            calculateRating(
                                constants,
                                achievement,
                                isAP,
                                version,
                            ),
                            0,
                        )}
                    </div>
                </div>
                <div className="text-center whitespace-pre-line sm:text-base text-sm xl:text-xl">
                    {!diff
                        ? version === "circle" && !isAP
                            ? t(
                                  "games.maimaidx.tools.rating.output.suggestion.AP-required",
                              )
                            : t(
                                  "games.maimaidx.tools.rating.output.suggestion.maxed",
                              )
                        : t(
                              "games.maimaidx.tools.rating.output.suggestion.next-boost",
                              {
                                  diff: truncate(diff, 4),
                                  boost: truncate(boost, 0),
                              },
                          )}
                </div>
            </div>
        </div>
    );
}
