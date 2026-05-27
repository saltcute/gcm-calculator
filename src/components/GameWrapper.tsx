import { Outlet } from "@tanstack/react-router";
import ToolSelector from "./ToolSelector";

export function GameWrapper() {
    return (
        <>
            <ToolSelector className="mx-auto" />
            <div className="bg-white/75 rounded-4xl w-full max-w-7xl mx-auto p-2 sm:p-5 md:p-10 pt-10 pb-10 grow flex place-items-center justify-center">
                <Outlet />
            </div>
            <p />
        </>
    );
}
