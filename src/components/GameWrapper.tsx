import { Outlet } from "@tanstack/react-router";
import ToolSelector from "./ToolSelector";

export function GameWrapper() {
    return (
        <>
            <ToolSelector className="mx-auto" />
            <div className="mx-auto flex w-full max-w-7xl grow place-items-center justify-center rounded-4xl bg-white/75 p-2 pt-10 pb-10 sm:p-5 md:p-10">
                <Outlet />
            </div>
        </>
    );
}
