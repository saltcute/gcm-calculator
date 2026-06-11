import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MaimaiRate } from "rg-stats";
import NumberField from "#/components/NumberField";
import useLoadStorage from "#/hooks/useLoadStorage";
import useStorage from "#/hooks/useStorage";
import { truncate } from "#/lib/util";

export const Route = createFileRoute("/maimai/rating/")({
    component: RouteComponent,
});

function RouteComponent() {
    const { t } = useTranslation();

    const stored = useLoadStorage<{
        achievement: number;
        maxAchievement: number;
        constants: number;
    }>("input-values", "/maimaidx/rating");

    const [achievement, setAchievement] = useState(stored.achievement || 100);
    const [maxAchievement, setMaxAchievement] = useState(
        stored.achievement || 100,
    );
    const [constants, setConstants] = useState(stored.constants || 13.9);

    useStorage(
        "input-values",
        JSON.stringify({
            maxAchievement,
            achievement,
            constants,
        }),
        "/maimai/rating",
    );

    return (
        <div className="flex grow flex-col justify-center gap-8 lg:flex-row">
            <div className="flex grow flex-col items-center gap-4">
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
                    label={t("games.maimai.tools.rating.input.achievement")}
                    min={0}
                    max={maxAchievement}
                    step={0.1}
                    value={achievement}
                    onValueChange={(v) => !v || setAchievement(v)}
                    format={{
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    }}
                ></NumberField>
                <NumberField
                    label={t("games.maimai.tools.rating.input.maxAchievement")}
                    min={0}
                    max={104}
                    step={0.1}
                    value={maxAchievement}
                    onValueChange={(v) => {
                        if (v) {
                            if (achievement > v) {
                                setAchievement(v);
                            }
                            setMaxAchievement(v);
                        }
                    }}
                    format={{
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    }}
                ></NumberField>
            </div>
            <div className="flex flex-5 flex-col text-nowrap">
                <div className="font-(family-name:--locale-based-font-sans-block-family) flex flex-col items-center">
                    <div className="text-4xl sm:text-5xl xl:text-6xl">
                        RATING
                    </div>
                    <div className="text-7xl sm:text-8xl xl:text-9xl">
                        {truncate(
                            MaimaiRate.calculate(
                                achievement,
                                maxAchievement,
                                constants,
                            ),
                            2,
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
