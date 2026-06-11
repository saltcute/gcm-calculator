import { Outlet } from "@tanstack/react-router";
import ToolSelector from "./ToolSelector";

export function GameWrapper() {
    return (
        <>
            <ToolSelector className="mx-auto" />
            <div className="mx-auto w-full max-w-7xl grow flex-col place-items-center justify-start rounded-4xl bg-white/75 p-2 pt-10 pb-10 shadow-4xl sm:p-5 md:p-10 lg:flex lg:justify-center">
                <Outlet />
            </div>
        </>
    );
}
