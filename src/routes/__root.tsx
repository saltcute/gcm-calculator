import { ThemeProvider } from "@mui/material/styles";
import { TanStackDevtools } from "@tanstack/react-devtools";
import {
    createRootRoute,
    HeadContent,
    Scripts,
    useLocation,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { useTranslation } from "react-i18next";
import i18n, { getInitialLocale } from "#/i18n";

import "@fontsource-variable/comfortaa/wght.css";
import "@fontsource-variable/geologica/wght.css";
import "@fontsource-variable/noto-sans-sc/wght.css";
import "@fontsource-variable/noto-sans-tc/wght.css";
import "@fontsource/m-plus-rounded-1c/400.css";
import "@fontsource/maple-mono/400.css";
import "@fontsource/huninn/400.css";
import "@fontsource/zen-kaku-gothic-new/700.css";

import GameSelector from "#/components/GameSelector";
import Header from "#/components/Header";
import { muiThemeByGame } from "#/constants/muiThemeByGame";
import appCss from "../styles.css?url";

export const Route = createRootRoute({
    beforeLoad: async () => {
        const locale = getInitialLocale();
        if (locale && i18n.language !== locale) {
            await i18n.changeLanguage(locale);
        }
        if (typeof document !== "undefined") {
            document.documentElement.setAttribute("lang", i18n.language);
        }
    },
    notFoundComponent: () => {
        return <div>Not Found :(</div>;
    },
    head: () => ({
        meta: [
            {
                charSet: "utf-8",
            },
            {
                name: "viewport",
                content: "width=device-width, initial-scale=1",
            },
            {
                title: i18n.t("generic.title"),
            },
        ],
        links: [
            {
                rel: "stylesheet",
                href: appCss,
            },
        ],
    }),
    shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
    const location = useLocation();
    const { i18n } = useTranslation();
    const lang = i18n.language;

    const getBackgroundImagePath = () => {
        if (location.pathname.startsWith("/maimaidx")) {
            return "/bg/maimaidx.webp";
        } else if (location.pathname.startsWith("/chunithm")) {
            return "/bg/chunithm.webp";
        } else if (location.pathname.startsWith("/ongeki")) {
            return "/bg/ongeki.webp";
        } else if (location.pathname.startsWith("/maimai")) {
            return "/bg/maimai.webp";
        } else return null;
    };
    const bgPath = getBackgroundImagePath();
    return (
        <html lang={lang} suppressHydrationWarning>
            <head>
                <HeadContent />
            </head>
            <body className="w-full h-full max-w-none" suppressHydrationWarning>
                {!!bgPath && (
                    <img
                        src={bgPath}
                        alt="Background"
                        className="blur-sm scale-102 fixed inset-0 w-full h-full object-cover -z-10 pointer-events-none"
                    />
                )}
                <ThemeProvider
                    theme={
                        muiThemeByGame[
                            GameSelector.filterValidGame(
                                location.pathname.split("/")[1],
                            )
                        ]
                    }
                >
                    <div className="flex fixed inset-0 w-full h-screen max-w-none flex-col items-center justify-center">
                        <Header />
                        <div className="flex grow w-full font-sans antialiased wrap-anywhere container flex-col items-center">
                            {children}
                        </div>
                    </div>
                </ThemeProvider>
                <TanStackDevtools
                    config={{
                        position: "bottom-right",
                    }}
                    plugins={[
                        {
                            name: "Tanstack Router",
                            render: <TanStackRouterDevtoolsPanel />,
                        },
                    ]}
                />
                <Scripts />
            </body>
        </html>
    );
}
