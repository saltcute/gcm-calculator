import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { GameVersions } from "#/components/maimaidx/rating/MaimaiDXGameVersionSelector";
import MaimaiDXGameVersionSelector from "#/components/maimaidx/rating/MaimaiDXGameVersionSelector";
import NumberField from "#/components/NumberField";
import useLoadStorage from "#/hooks/useLoadStorage";
import useStorage from "#/hooks/useStorage";
import { calculateAchievementConstantsForRating } from "#/lib/calculator/maimaidx";
import { truncate } from "#/lib/util";

export const Route = createFileRoute("/maimaidx/achievement/")({
    component: RouteComponent,
});

function RouteComponent() {
    const { t } = useTranslation();

    const stored = useLoadStorage<{
        version: GameVersions;
        rating: number;
        isAP: boolean;
    }>("input-values", "/maimaidx/achievement");

    const [version, setVersion] = useState<GameVersions>(
        stored.version || "dx",
    );
    const [rating, setRating] = useState(stored.rating || 312);
    const [isAP, setisAP] = useState(stored.isAP || false);

    const possibleAchievementRates = calculateAchievementConstantsForRating(
        rating,
        isAP,
        version,
    );

    useStorage(
        "input-values",
        JSON.stringify({
            version,
            rating,
            isAP,
        }),
        "/maimaidx/achievement",
    );

    return (
        <div className="flex grow flex-col items-center justify-center gap-8 lg:min-w-1/1 lg:flex-row lg:justify-start">
            <div className="flex flex-none flex-col items-center justify-center gap-4 lg:flex-row">
                <div className="flex flex-col gap-4">
                    <NumberField
                        label={t(
                            "games.maimaidx.tools.achievement.input.rating.title",
                        )}
                        min={0}
                        max={337}
                        step={1}
                        value={rating}
                        onValueChange={(v) => !v || setRating(v)}
                        format={{
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                        }}
                    ></NumberField>
                </div>
                <div className="flex flex-col">
                    <MaimaiDXGameVersionSelector
                        value={version}
                        onChange={(v) => setVersion(v)}
                    />
                    <Tooltip
                        describeChild
                        arrow
                        title={
                            version === "circle" &&
                            t(
                                "games.maimaidx.tools.achievement.input.isAP.tooltip",
                            )
                        }
                    >
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={isAP}
                                    disabled={version !== "circle"}
                                    onChange={(e) => setisAP(e.target.checked)}
                                />
                            }
                            label={t(
                                "games.maimaidx.tools.achievement.input.isAP.title",
                            )}
                        />
                    </Tooltip>
                </div>
            </div>
            <div className="flex min-w-1/1 grow flex-col justify-center rounded-2xl bg-white/55 p-0 text-center align-middle font-serif shadow-2xl lg:min-w-[initial] lg:text-2xl">
                {possibleAchievementRates.length <= 0 ? (
                    <div className="m-8">
                        {t(
                            "games.maimaidx.tools.achievement.output.impossible",
                        )}
                    </div>
                ) : (
                    <TableContainer component="div">
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell className="whitespace-nowrap">
                                        {t(
                                            `games.maimaidx.tools.achievement.output.table.headers.constants`,
                                        )}
                                    </TableCell>
                                    <TableCell className="whitespace-pre-wrap">
                                        {t(
                                            `games.maimaidx.tools.achievement.output.table.headers.minAchievement`,
                                        )}
                                    </TableCell>
                                    <TableCell className="whitespace-pre-wrap">
                                        {t(
                                            `games.maimaidx.tools.achievement.output.table.headers.maxAchievement`,
                                        )}
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {possibleAchievementRates
                                    .sort((a, b) => b.constant - a.constant)
                                    .map((v) => (
                                        <TableRow key={v.constant}>
                                            <TableCell>{v.constant}</TableCell>
                                            <TableCell>
                                                {truncate(v.minAchievement, 4)}
                                            </TableCell>
                                            <TableCell>
                                                {truncate(v.maxAchievement, 4)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </div>
        </div>
    );
}
