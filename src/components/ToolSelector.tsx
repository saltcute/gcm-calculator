import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { createLink, useLocation, useRouter } from "@tanstack/react-router";
import clsx from "clsx";

import { useTranslation } from "react-i18next";

const LinkTab = createLink(Tab);

export default function ToolSelector({ className }: { className?: string }) {
    const { t } = useTranslation();

    const location = useLocation();

    const { routesByPath } = useRouter();

    const currentGame = location.pathname.split("/").slice(1)[0];
    const currentTool = location.pathname.split("/").slice(1)[1];

    const toolList = [
        ...new Set(
            Object.keys(routesByPath)
                .filter((v) => v.split("/").slice(1).includes(currentGame))
                .map((v) => v.split("/").slice(2)[0])
                .filter((v) => !!v),
        ),
    ];

    return (
        toolList.length <= 1 || (
            <Box
                className={clsx(
                    className,
                    "grow-0 pl-5 pr-5 rounded-full overflow-hidden w-fit bg-white/75 backdrop-blur-sm",
                )}
            >
                <Tabs value={currentTool} centered sx={{ minHeight: 36 }}>
                    {toolList.map((v) => (
                        <LinkTab
                            key={v}
                            value={v}
                            className="pl-2 pr-2 pt-2 pb-2 select-none text-xs font-semibold font-(family-name:--locale-based-font-sans-block-family)"
                            to={location.pathname.replace(currentTool, `${v}`)}
                            label={t(`games.${currentGame}.tools.${v}.title`)}
                            preload="intent"
                            sx={{ textTransform: "none", minHeight: 36 }}
                            viewTransition
                        />
                    ))}
                </Tabs>
            </Box>
        )
    );
}
