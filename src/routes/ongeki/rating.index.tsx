import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import NumberField from "#/components/NumberField";
import GameVersionSelector, {
    type GameVersions,
} from "#/components/ongeki/rating/GameVersionSelector";
import useLoadStorage from "#/hooks/useLoadStorage";
import useStorage from "#/hooks/useStorage";
import {
    ComboLamps,
    calculateReFreshScoreRating,
    calculateReFreshStarRating,
    calculateScoreRating,
} from "#/lib/calculator/ongeki";
import { truncate } from "#/lib/util";

export const Route = createFileRoute("/ongeki/rating/")({
    component: RouteComponent,
});

function RouteComponent() {
    const { t } = useTranslation();

    const stored = useLoadStorage<{
        version: GameVersions;
        achievement: number;
        constants: number;
        stars: number;
        bell: boolean;
        combo: ComboLamps;
    }>("input-values", "/ongeki/rating");

    const [version, setVersion] = useState<GameVersions>(
        stored.version || "refresh",
    );
    const [achievement, setAchievement] = useState(
        stored.achievement || 1007500,
    );
    const [constants, setConstants] = useState(stored.constants || 14.2);
    const [stars, setStars] = useState(stored.stars || 0);
    const [bell, setBell] = useState(stored.bell || false);
    const [combo, setCombo] = useState(stored.combo || "none");

    useStorage(
        "input-values",
        JSON.stringify({
            version,
            achievement,
            constants,
        }),
        "/ongeki/rating",
    );

    return (
        <div className="flex flex-col lg:flex-row grow gap-8 justify-center">
            <div className="flex flex-col lg:flex-row grow gap-4 items-center">
                <div className="flex flex-col gap-4 justify-center">
                    <NumberField
                        label={t(
                            "games.ongeki.tools.rating.input.constants.title",
                        )}
                        tooltip={t(
                            "games.ongeki.tools.rating.input.constants.tooltip",
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
                        label={t("games.ongeki.tools.rating.input.achievement")}
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
                <div className="flex flex-7 flex-col gap-2">
                    <GameVersionSelector
                        value={version}
                        onChange={(v) => setVersion(v)}
                    />
                    <AnimatePresence>
                        {version === "refresh" && (
                            <motion.div
                                layout
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 1 }}
                                className="flex gap-2 justify-between"
                            >
                                <FormControl className="flex-1">
                                    <InputLabel id="ongeki-stars-select-label">
                                        Stars
                                    </InputLabel>
                                    <Select
                                        labelId="ongeki-stars-select-label"
                                        value={stars}
                                        label="Stars"
                                        onChange={(e) =>
                                            setStars(e.target.value)
                                        }
                                    >
                                        {[0, 1, 2, 3, 4, 5, 6].map((v) => (
                                            <MenuItem key={v} value={v}>
                                                {t(
                                                    `games.ongeki.tools.rating.input.stars.${v}`,
                                                )}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl className="flex-1">
                                    <InputLabel id="ongeki-lamp-select-label">
                                        {t(
                                            "games.ongeki.tools.rating.input.lamps.title",
                                        )}
                                    </InputLabel>
                                    <Select
                                        labelId="ongeki-lamp-select-label"
                                        value={combo}
                                        label="Combo Type"
                                        onChange={(e) =>
                                            setCombo(e.target.value)
                                        }
                                    >
                                        {ComboLamps.map((v) => (
                                            <MenuItem key={v} value={v}>
                                                {t(
                                                    `games.ongeki.tools.rating.input.lamps.values.${v}`,
                                                )}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                onChange={(e) =>
                                                    setBell(e.target.checked)
                                                }
                                            />
                                        }
                                        label={t(
                                            "games.ongeki.tools.rating.input.bell.title",
                                        )}
                                    />
                                </FormControl>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
            <div className="flex flex-4 flex-col text-nowrap">
                {version === "origin" ? (
                    <div className="flex flex-col items-center font-(family-name:--locale-based-font-sans-block-family)">
                        <div className="text-4xl sm:text-5xl xl:text-6xl">
                            RATING
                        </div>
                        <div className="text-7xl sm:text-8xl xl:text-9xl">
                            {truncate(
                                calculateScoreRating(constants, achievement),
                                2,
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col text-center items-center font-(family-name:--locale-based-font-sans-block-family)">
                        <div className="flex flex-col">
                            <div className="text-2xl sm:text-3xl xl:text-4xl">
                                <ruby>
                                    RATING <rp>(</rp>
                                    <rt>Score</rt>
                                    <rp>)</rp>
                                </ruby>
                            </div>
                            <div className="text-5xl sm:text-6xl xl:text-7xl">
                                {truncate(
                                    calculateReFreshScoreRating(
                                        constants,
                                        achievement,
                                        combo,
                                        bell,
                                    ),
                                    3,
                                )}
                                <span className="text-black/20 text-2xl sm:text-3xl xl:text-4xl">
                                    (
                                    {truncate(
                                        calculateReFreshScoreRating(
                                            constants,
                                            achievement,
                                            combo,
                                            bell,
                                        ) * 1.2,
                                        3,
                                    )}
                                    )
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <div className="text-2xl sm:text-3xl xl:text-4xl ">
                                <ruby>
                                    RATING <rp>(</rp>
                                    <rt>Star</rt>
                                    <rp>)</rp>
                                </ruby>
                            </div>
                            <div className="text-5xl sm:text-6xl xl:text-7xl">
                                +
                                {truncate(
                                    calculateReFreshStarRating(
                                        constants,
                                        stars,
                                    ),
                                    3,
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
