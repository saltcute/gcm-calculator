import { useLocation } from "@tanstack/react-router";
import GameSelector from "./GameSelector";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header() {
    const location = useLocation();

    return (
        <header className="flex w-full flex-none grow-0 items-center justify-evenly gap-4 pt-5 pb-4">
            <p className="flex-none md:flex-1" />
            <GameSelector
                current={GameSelector.filterValidGame(
                    location.pathname.split("/")[1],
                )}
                className="flex-4"
            />
            <LanguageSwitcher className="flex-1" />
        </header>
    );
}
