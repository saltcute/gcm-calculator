import { useLocation } from "@tanstack/react-router";
import GameSelector from "./GameSelector";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header() {
    const location = useLocation();

    return (
        <div className="grow-0 flex-none flex pt-5 pb-4 w-full justify-between items-center">
            <p />
            <GameSelector
                current={GameSelector.filterValidGame(
                    location.pathname.split("/")[1],
                )}
            />
            <LanguageSwitcher />
        </div>
    );
}
