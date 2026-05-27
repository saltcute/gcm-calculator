import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import GameVersionSelector, {
    type GameVersions,
} from "#/components/chunithm/rating/GameVersionSelector";
import NumberField from "#/components/NumberField";
import useLoadStorage from "#/hooks/useLoadStorage";
import useStorage from "#/hooks/useStorage";
import {
    calculateParadiseLostRating,
    calculateRating,
} from "#/lib/calculator/chunithm";
import { truncate } from "#/lib/util";

export const Route = createFileRoute("/chunithm/rating/")({
    component: RouteComponent,
});

function RouteComponent() {
    const { t } = useTranslation();

    const stored = useLoadStorage<{
        version: GameVersions;
        achievement: number;
        constants: number;
    }>("input-values", "/chunithm/rating");

    const [version, setVersion] = useState<GameVersions>(
        stored.version || "new",
    );
    const [achievement, setAchievement] = useState(
        stored.achievement || 1007500,
    );
    const [constants, setConstants] = useState(stored.constants || 14.3);

    useStorage(
        "input-values",
        JSON.stringify({
            version,
            achievement,
            constants,
        }),
        "/chunithm/rating",
    );

    return (
        <div className="flex flex-col lg:flex-row grow gap-8 justify-center">
            <div className="flex flex-col xl:flex-row grow gap-4 items-center">
                <div className="flex flex-col gap-4">
                    <NumberField
                        label={t(
                            "games.chunithm.tools.rating.input.constants.title",
                        )}
                        tooltip={t(
                            "games.chunithm.tools.rating.input.constants.tooltip",
                        )}
                        min={0}
                        max={16}
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
                            "games.chunithm.tools.rating.input.achievement",
                        )}
                        min={0}
                        max={1010000}
                        step={500}
                        value={achievement}
                        onValueChange={(v) => !v || setAchievement(v)}
                        format={{
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                        }}
                    ></NumberField>
                </div>
                <div className="flex flex-col">
                    <GameVersionSelector
                        value={version}
                        onChange={(v) => setVersion(v)}
                    />
                </div>
            </div>
            <div className="flex flex-3 flex-col text-nowrap items-center font-(family-name:--locale-based-font-sans-block-family)">
                <div className="text-4xl sm:text-5xl xl:text-6xl">RATING</div>
                <div className="text-7xl sm:text-8xl xl:text-9xl">
                    {truncate(
                        (version === "origin"
                            ? calculateParadiseLostRating
                            : calculateRating)(constants, achievement),
                        2,
                    )}
                </div>
            </div>
        </div>
    );
}
