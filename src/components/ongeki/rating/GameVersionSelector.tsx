import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { useId } from "react";
import { useTranslation } from "react-i18next";

const GAME_VERSIONS = ["origin", "refresh"] as const;

export type GameVersions = (typeof GAME_VERSIONS)[number];

export default function GameVersionSelector({
    value,
    onChange,
}: {
    value: GameVersions;
    onChange: (value: GameVersions) => void;
}) {
    const id = useId();
    const { t } = useTranslation();

    return (
        <FormControl>
            <FormLabel id={`${id}-label`}>Version</FormLabel>
            <RadioGroup
                aria-labelledby={`${id}-label`}
                value={value}
                onChange={(e) =>
                    onChange(e.target.value as unknown as GameVersions)
                }
                name="radio-buttons-group"
            >
                {GAME_VERSIONS.map((v) => (
                    <FormControlLabel
                        key={v}
                        value={v}
                        control={<Radio />}
                        label={t(
                            `games.chunithm.tools.rating.input.versions.${v}`,
                        )}
                    />
                ))}
            </RadioGroup>
        </FormControl>
    );
}
