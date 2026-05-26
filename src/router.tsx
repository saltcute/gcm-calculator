import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
    const router = createTanStackRouter({
        routeTree,
        rewrite: {
            input: ({ url }) => {
                if (!import.meta.env.DEV) {
                    if (url.hostname === "calc.maimaidx.cab") {
                        url.pathname = `/maimaidx${url.pathname}`;
                    } else if (url.hostname === "calc.maimai.cab") {
                        url.pathname = `/maimai${url.pathname}`;
                    } else if (url.hostname === "calc.chunithm.cab") {
                        url.pathname = `/chunithm${url.pathname}`;
                    } else if (url.hostname === "calc.ongeki.cab") {
                        url.pathname = `/ongeki${url.pathname}`;
                    }
                }

                return url;
            },
            output: ({ url }) => {
                if (!import.meta.env.DEV) {
                    if (url.pathname.startsWith("/maimaidx")) {
                        url.hostname = "calc.maimaidx.cab";
                        url.pathname =
                            url.pathname.replace(/^\/maimaidx/, "") || "/";
                    } else if (url.pathname.startsWith("/maimai")) {
                        url.hostname = "calc.maimai.cab";
                        url.pathname =
                            url.pathname.replace(/^\/maimai/, "") || "/";
                    } else if (url.pathname.startsWith("/chunithm")) {
                        url.hostname = "calc.chunithm.cab";
                        url.pathname =
                            url.pathname.replace(/^\/chunithm/, "") || "/";
                    } else if (url.pathname.startsWith("/ongeki")) {
                        url.hostname = "calc.ongeki.cab";
                        url.pathname =
                            url.pathname.replace(/^\/ongeki/, "") || "/";
                    }
                }

                return url;
            },
        },
        scrollRestoration: true,
        defaultPreload: "intent",
        defaultPreloadStaleTime: 0,
        defaultViewTransition: true,
    });

    return router;
}

declare module "@tanstack/react-router" {
    interface Register {
        router: ReturnType<typeof getRouter>;
    }
}
