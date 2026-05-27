import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { createLink, useLocation } from "@tanstack/react-router";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

const LinkTab = createLink(Tab);

export default function GameSelector({
    current,
    className,
}: {
    current: (typeof GameSelector.GAME_LIST)[number];
    className?: string;
}) {
    const { t } = useTranslation();
    const location = useLocation();

    return (
        <Box
            className={clsx(
                className,
                "flex pl-5 pr-5 rounded-full overflow-hidden w-fit bg-white/75 backdrop-blur-sm justify-center",
            )}
        >
            <Tabs variant="scrollable" scrollButtons="auto" value={current}>
                {GameSelector.GAME_LIST.map((v) => (
                    <LinkTab
                        key={v}
                        value={v}
                        className="select-none text-base font-semibold font-(family-name:--locale-based-font-sans-block-family)"
                        to={location.pathname.replace(current, `${v}`)}
                        label={t(`games.${v}.title`)}
                        preload="intent"
                        sx={{ textTransform: "none" }}
                        viewTransition
                    />
                ))}
            </Tabs>
        </Box>
    );
}

GameSelector.GAME_LIST = ["maimaidx", "chunithm", "ongeki", "maimai"] as const;
GameSelector.isValidGame = (
    payload: string,
): payload is (typeof GameSelector.GAME_LIST)[number] => {
    return (GameSelector.GAME_LIST as unknown as string[]).includes(payload);
};
GameSelector.filterValidGame = (
    payload: string,
    defaultValue: (typeof GameSelector.GAME_LIST)[number] = "maimaidx",
) => {
    if (GameSelector.isValidGame(payload)) {
        return payload;
    } else {
        return defaultValue;
    }
};
