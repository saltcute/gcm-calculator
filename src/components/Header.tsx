import { useLocation } from "@tanstack/react-router";
import GameSelector from "./GameSelector";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header() {
    const location = useLocation();

    return (
        <div className="grow-0 gap-4 flex-none flex pt-5 pb-4 w-full justify-evenly items-center">
            <p className="md:flex-1 flex-none" />
            <GameSelector
                current={GameSelector.filterValidGame(
                    location.pathname.split("/")[1],
                )}
                className="flex-4"
            />
            <LanguageSwitcher className="flex-1" />
        </div>
    );
}
