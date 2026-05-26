import { Outlet } from "@tanstack/react-router";
import ToolSelector from "./ToolSelector";

export function GameWrapper() {
    return (
        <>
            <ToolSelector />
            <div className="bg-white/75 rounded-4xl m-10 ml-0 mr-0 sm:ml-5 sm:mr-5 md:ml-10 md:mr-10 p-2 sm:p-5 md:p-15 w-full grow flex items-center justify-center">
                <Outlet />
            </div>
        </>
    );
}
