import { useLocation } from "@tanstack/react-router";
import { getGameByPathname } from "#/lib/util";

export default function Footer() {
    const { pathname } = useLocation();

    return (
        <footer className="flex gap-4 justify-left p-3">
            <a href="https://github.com/saltcute/gcm-calculator">Github</a>
            <a href={`https://${getGameByPathname(pathname)}.cab/discord`}>
                Discord
            </a>
        </footer>
    );
}
