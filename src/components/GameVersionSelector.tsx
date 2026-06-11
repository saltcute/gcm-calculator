import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { useId } from "react";
import { useTranslation } from "react-i18next";

export default function GameVersionSelector<T extends string>({
    value,
    versions,
    onChange,
    game,
}: {
    value: T;
    versions: T[];
    onChange: (value: T) => void;
    game: string;
}) {
    const id = useId();
    const { t } = useTranslation();

    return (
        <FormControl>
            <FormLabel id={`${id}-label`}>
                {t("games.chunithm.tools.rating.input.version.title")}
            </FormLabel>
            <RadioGroup
                aria-labelledby={`${id}-label`}
                value={value}
                onChange={(e) => onChange(e.target.value as unknown as T)}
                name="radio-buttons-group"
            >
                {versions.map((v) => (
                    <FormControlLabel
                        key={v}
                        value={v}
                        control={<Radio />}
                        label={t(
                            `games.${game}.tools.rating.input.version.list.${v}`,
                        )}
                    />
                ))}
            </RadioGroup>
        </FormControl>
    );
}
